// 트레일링 스탑·재진입 규칙 백테스트
// 사용법: node scripts/trailing-stop-backtest.mjs
//
// 규칙(11월 2주차 기록 기준)
// - 12주(60거래일) 종가 고점 대비 -20%면 절반 매도, -30%면 전량 매도
// - 매도 후 저점 대비 +20% 오르거나 12주 종가 신고가면 전량 재진입
//
// 가정
// - 신호는 종가로 판정하고 다음 거래일 시가에 체결한다
// - 매수(시작·재진입) 후에는 매수일 이후의 고점만 스탑 기준으로 쓴다
//   (그러지 않으면 저점 +20% 재진입 직후 옛 고점 때문에 바로 다시 매도된다)
// - 수수료·세금·환율·배당은 반영하지 않고, 현금 수익률은 0이다

const SYMBOLS = [
  { symbol: "005930.KS", name: "삼성전자" },
  { symbol: "000660.KS", name: "SK하이닉스" },
  { symbol: "SNDK", name: "샌디스크" },
  { symbol: "NVDA", name: "엔비디아" },
];

// 결과 재현을 위해 수집 구간을 고정한다 (FETCH_TO 는 미포함)
const FETCH_FROM = "2024-06-01";
const FETCH_TO = "2026-11-14";

const PERIODS = [
  { label: "최근 2년", from: "2024-11-15" },
  { label: "실제 투자 기간", from: "2025-10-15" },
];

const BASE_RULE = { window: 60, half: 0.2, full: 0.3, reentry: 0.2 };

// 민감도 확인용: 스탑 폭, 고점 기간, 재진입 조건을 바꿔 본다
const RULE_GRID = [
  { window: 60, half: 0.15, full: 0.25, reentry: 0.2 },
  BASE_RULE,
  { window: 60, half: 0.25, full: 0.35, reentry: 0.2 },
  { window: 120, half: 0.2, full: 0.3, reentry: 0.2 },
  { window: 120, half: 0.25, full: 0.35, reentry: 0.2 },
  { window: 60, half: 0.2, full: 0.3, reentry: 0.3 },
  // reentry 가 Infinity 면 저점 반등 조건이 꺼지고 고점 기간 신고가에서만 재진입한다
  { window: 60, half: 0.2, full: 0.3, reentry: Infinity },
];

const pct = (v) => `${(v * 100).toFixed(1)}%`;

async function fetchDaily(symbol) {
  const period1 = Date.parse(`${FETCH_FROM}T00:00:00Z`) / 1000;
  const period2 = Date.parse(`${FETCH_TO}T00:00:00Z`) / 1000;
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?period1=${period1}&period2=${period2}&interval=1d`;
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) {
    throw new Error(`Yahoo Finance API 오류: ${res.status} for ${symbol}`);
  }

  const json = await res.json();
  const result = json.chart?.result?.[0];
  if (!result) {
    throw new Error(`Yahoo Finance 응답에 데이터가 없음: ${symbol}`);
  }

  const quotes = result.indicators.quote[0];
  // 거래소 현지 날짜로 맞춘다 (UTC 그대로 쓰면 미국장은 하루 밀릴 수 있다)
  const offset = result.meta.gmtoffset ?? 0;
  const bars = [];
  for (let i = 0; i < result.timestamp.length; i++) {
    const open = quotes.open[i];
    const close = quotes.close[i];
    // 누락된 데이터 건너뛰기
    if (open == null || close == null) continue;
    const date = new Date((result.timestamp[i] + offset) * 1000).toISOString().slice(0, 10);
    bars.push({ date, open, close });
  }
  return bars;
}

function maxClose(bars, from, to) {
  let max = -Infinity;
  for (let i = from; i <= to; i++) max = Math.max(max, bars[i].close);
  return max;
}

function maxDrawdown(values) {
  let peak = -Infinity;
  let mdd = 0;
  for (const v of values) {
    peak = Math.max(peak, v);
    mdd = Math.min(mdd, v / peak - 1);
  }
  return mdd;
}

function summarizeTrip(trip, lastClose) {
  const soldShares = trip.sells.reduce((sum, s) => sum + s.shares, 0);
  const avgSale = trip.sells.reduce((sum, s) => sum + s.shares * s.price, 0) / soldShares;
  // 재진입하지 못한 채 끝났으면 마지막 종가와 비교한다
  const compare = trip.reentryPrice ?? lastClose;
  return {
    firstSell: trip.sells[0].date,
    soldLevel: trip.soldLevel,
    avgSale,
    reentryDate: trip.reentryDate ?? null,
    compare,
    // 매도 평균가 대비 되산 가격이 얼마나 낮았나 (양수면 매도가 도움이 됨)
    saved: avgSale / compare - 1,
    whipsaw: trip.reentryPrice != null && trip.reentryPrice > avgSale,
  };
}

function simulate(bars, fromDate, rule) {
  const { window, half, full, reentry } = rule;
  // 12주 고점 계산에 window 일이 필요하므로 그 이후부터 시작한다
  const start = Math.max(
    bars.findIndex((b) => b.date >= fromDate),
    window - 1,
  );

  let shares = 1 / bars[start].close; // 시작일 종가에 전액 매수한 것으로 본다
  let cash = 0;
  let pos = 1; // 보유 비율: 1, 0.5, 0
  let anchor = start; // 매수(시작·재진입) 후에는 이 인덱스 이후 고점만 본다
  let low = null; // 첫 매도 신호 이후 최저 종가
  let pending = null; // 전일 종가에 나온 목표 보유 비율
  let trip = null; // 매도부터 전량 복귀까지 한 묶음

  const events = [];
  const trips = [];
  const equity = [];
  let exposure = 0;

  for (let t = start; t < bars.length; t++) {
    const bar = bars[t];

    // 전일 종가 신호를 당일 시가에 체결
    if (pending !== null) {
      if (pending < pos) {
        const sold = shares * (1 - pending / pos);
        shares -= sold;
        cash += sold * bar.open;
        trip ??= { sells: [], soldLevel: 0 };
        trip.sells.push({ date: bar.date, shares: sold, price: bar.open });
        trip.soldLevel = 1 - pending;
        events.push({ date: bar.date, action: pending === 0 ? "전량 매도" : "절반 매도", price: bar.open });
      } else {
        shares += cash / bar.open;
        cash = 0;
        anchor = t;
        low = null;
        trips.push({ ...trip, reentryDate: bar.date, reentryPrice: bar.open });
        trip = null;
        events.push({ date: bar.date, action: "재진입", price: bar.open });
      }
      pos = pending;
      pending = null;
    }

    equity.push({ date: bar.date, value: shares * bar.close + cash });
    exposure += pos;

    // 종가 기준 신호 판정
    const refHigh = maxClose(bars, Math.max(t - window + 1, anchor), t);
    const drawdown = bar.close / refHigh - 1;
    let target = pos;
    if (pos > 0 && drawdown <= -full) target = 0;
    else if (pos === 1 && drawdown <= -half) target = 0.5;

    if (target < 1 && pos === 1) {
      low = bar.close;
    } else if (pos < 1) {
      low = Math.min(low, bar.close);
      const isWindowHigh = bar.close >= maxClose(bars, t - window + 1, t);
      if (target === pos && (bar.close >= low * (1 + reentry) || isWindowHigh)) target = 1;
    }
    if (target !== pos) pending = target;
  }

  if (trip) trips.push(trip);

  const startClose = bars[start].close;
  const lastClose = bars[bars.length - 1].close;
  const window1 = bars.slice(start);
  const peak = window1.reduce((a, b) => (b.close > a.close ? b : a));

  return {
    startDate: bars[start].date,
    holdReturn: lastClose / startClose - 1,
    holdMdd: maxDrawdown(window1.map((b) => b.close)),
    ruleReturn: equity[equity.length - 1].value - 1,
    ruleMdd: maxDrawdown(equity.map((e) => e.value)),
    exposure: exposure / equity.length,
    peak,
    fromPeak: lastClose / peak.close - 1,
    events,
    trips: trips.map((tr) => summarizeTrip(tr, lastClose)),
    equity,
    hold: window1.map((b) => ({ date: b.date, value: b.close / startClose })),
    pendingAtEnd: pending,
  };
}

// 거래일이 다른 종목을 날짜 합집합에 맞춰 동일 비중(리밸런싱 없음)으로 합친다
function basket(curves) {
  const from = curves.map((c) => c[0].date).sort().at(-1);
  const dates = [...new Set(curves.flatMap((c) => c.map((p) => p.date)))].filter((d) => d >= from).sort();
  const values = dates.map(() => 0);
  for (const curve of curves) {
    // 종목마다 시작일이 달라도 공통 시작일을 1로 다시 맞춘다
    const byDate = new Map(curve.map((p) => [p.date, p.value]));
    let last = curve.findLast((p) => p.date <= from).value;
    const base = last;
    dates.forEach((d, i) => {
      last = byDate.get(d) ?? last;
      values[i] += last / base / curves.length;
    });
  }
  return { from, ret: values.at(-1) - 1, mdd: maxDrawdown(values) };
}

const data = [];
for (const s of SYMBOLS) {
  const bars = await fetchDaily(s.symbol);
  data.push({ ...s, bars });
}

console.log("## 데이터");
console.table(
  data.map(({ name, bars }) => ({
    종목: name,
    거래일수: bars.length,
    시작: bars[0].date,
    끝: bars.at(-1).date,
    마지막종가: bars.at(-1).close.toFixed(2),
    "52주 종가고점 대비": pct(bars.at(-1).close / maxClose(bars, bars.length - 252, bars.length - 1) - 1),
  })),
);

for (const period of PERIODS) {
  const results = data.map((d) => ({ ...d, sim: simulate(d.bars, period.from, BASE_RULE) }));

  console.log(`\n## ${period.label} (${period.from}~) — 12주 고점 -20% 절반 / -30% 전량`);
  console.table(
    results.map(({ name, sim }) => ({
      종목: name,
      시작일: sim.startDate,
      "보유 수익률": pct(sim.holdReturn),
      "규칙 수익률": pct(sim.ruleReturn),
      "보유 MDD": pct(sim.holdMdd),
      "규칙 MDD": pct(sim.ruleMdd),
      "매도 묶음": sim.trips.length,
      헛매도: sim.trips.filter((t) => t.whipsaw).length,
      "평균 보유비율": pct(sim.exposure),
    })),
  );

  for (const { name, sim } of results) {
    console.log(`\n### ${name} — 고점 ${sim.peak.date} ${sim.peak.close.toFixed(2)}, 현재 고점 대비 ${pct(sim.fromPeak)}`);
    console.table(sim.events.map((e) => ({ 체결일: e.date, 구분: e.action, 체결가: e.price.toFixed(2) })));
    console.table(
      sim.trips.map((t) => ({
        첫매도: t.firstSell,
        매도비율: pct(t.soldLevel),
        매도평균가: t.avgSale.toFixed(2),
        재진입: t.reentryDate ?? "미복귀",
        "재진입가(미복귀는 현재가)": t.compare.toFixed(2),
        "매도 효과": pct(t.saved),
        헛매도: t.whipsaw ? "Y" : "",
      })),
    );
    if (sim.pendingAtEnd !== null) console.log(`마지막 날 신호 미체결: 목표 보유비율 ${sim.pendingAtEnd}`);
  }

  // 삼전·하닉·샌디스크 동일 비중 묶음
  // 단순 보유와 출발 조건이 같도록 공통 시작일에 전액 매수한 것으로 다시 계산한다
  const commonFrom = results.slice(0, 3).map((r) => r.sim.startDate).sort().at(-1);
  const memory = data.slice(0, 3).map((d) => simulate(d.bars, commonFrom, BASE_RULE));
  const holdBasket = basket(memory.map((sim) => sim.hold));
  const ruleBasket = basket(memory.map((sim) => sim.equity));
  console.log(`\n### 메모리 3종목 동일 비중 (${holdBasket.from}~)`);
  console.table([
    { 방식: "단순 보유", 수익률: pct(holdBasket.ret), MDD: pct(holdBasket.mdd) },
    { 방식: "규칙 적용", 수익률: pct(ruleBasket.ret), MDD: pct(ruleBasket.mdd) },
  ]);
}

console.log(`\n## 민감도 (${PERIODS[0].label}, 종목별 시작일은 고점 기간에 따라 달라짐)`);
for (const rule of RULE_GRID) {
  const reentryLabel = rule.reentry === Infinity ? "신고가만" : `저점 +${rule.reentry * 100}% 또는 신고가`;
  console.log(`\n### ${rule.window}일 고점 -${rule.half * 100}% 절반 / -${rule.full * 100}% 전량, 재진입 ${reentryLabel}`);
  console.table(
    data.map(({ name, bars }) => {
      const sim = simulate(bars, PERIODS[0].from, rule);
      return {
        종목: name,
        시작일: sim.startDate,
        "보유 수익률": pct(sim.holdReturn),
        "규칙 수익률": pct(sim.ruleReturn),
        "보유 MDD": pct(sim.holdMdd),
        "규칙 MDD": pct(sim.ruleMdd),
        "매도 묶음": sim.trips.length,
        헛매도: sim.trips.filter((t) => t.whipsaw).length,
      };
    }),
  );
}
