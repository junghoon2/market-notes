/** 주식 캔들 데이터 타입 */
export type CandleData = {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
};

/** 주식 요약 정보 */
export type StockInfo = {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
};

/**
 * 기간 문자열을 Yahoo Finance range 파라미터로 변환
 * 예: "1m" → "1mo", "3m" → "3mo", "1y" → "1y"
 */
function periodToRange(period: string): string {
  const map: Record<string, string> = {
    "1w": "5d",
    "1m": "1mo",
    "3m": "3mo",
    "6m": "6mo",
    "1y": "1y",
    "3y": "3y",
    "5y": "5y",
  };
  return map[period] ?? "3mo";
}

/** 기간에 따른 적절한 인터벌 결정 */
function periodToInterval(period: string): string {
  const map: Record<string, string> = {
    "1w": "15m",
    "1m": "1d",
    "3m": "1d",
    "6m": "1d",
    "1y": "1wk",
    "3y": "1wk",
    "5y": "1mo",
  };
  return map[period] ?? "1d";
}

/**
 * Yahoo Finance API로 주식 캔들 데이터를 가져옴
 * 빌드 시 또는 서버에서 호출 (API 키 불필요)
 */
export async function fetchCandleData(
  symbol: string,
  period: string = "3m"
): Promise<CandleData[]> {
  const range = periodToRange(period);
  const interval = periodToInterval(period);

  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=${range}&interval=${interval}`;

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
      next: { revalidate: 3600 }, // 1시간 캐시
    });

    if (!res.ok) {
      console.error(`Yahoo Finance API 오류: ${res.status} for ${symbol}`);
      return getSampleData();
    }

    const json = await res.json();
    const result = json.chart?.result?.[0];

    if (!result) return getSampleData();

    const timestamps = result.timestamp as number[];
    const quotes = result.indicators?.quote?.[0];

    if (!timestamps || !quotes) return getSampleData();

    // Yahoo Finance 응답을 CandleData 배열로 변환
    const candles: CandleData[] = [];
    for (let i = 0; i < timestamps.length; i++) {
      const open = quotes.open?.[i];
      const high = quotes.high?.[i];
      const low = quotes.low?.[i];
      const close = quotes.close?.[i];

      // 누락된 데이터 건너뛰기
      if (open == null || high == null || low == null || close == null) continue;

      const date = new Date(timestamps[i] * 1000);
      candles.push({
        time: date.toISOString().split("T")[0],
        open: Math.round(open * 100) / 100,
        high: Math.round(high * 100) / 100,
        low: Math.round(low * 100) / 100,
        close: Math.round(close * 100) / 100,
        volume: quotes.volume?.[i] ?? 0,
      });
    }

    return candles.length > 0 ? candles : getSampleData();
  } catch (error) {
    console.error(`주식 데이터 fetch 실패 (${symbol}):`, error);
    return getSampleData();
  }
}

/**
 * 주식 요약 정보 조회
 */
export async function fetchStockInfo(symbol: string): Promise<StockInfo> {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=1d&interval=1d`;

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      next: { revalidate: 300 }, // 5분 캐시
    });

    if (!res.ok) return getSampleStockInfo(symbol);

    const json = await res.json();
    const meta = json.chart?.result?.[0]?.meta;

    if (!meta) return getSampleStockInfo(symbol);

    const price = meta.regularMarketPrice ?? 0;
    const prevClose = meta.chartPreviousClose ?? meta.previousClose ?? price;
    const change = price - prevClose;
    const changePercent = prevClose !== 0 ? (change / prevClose) * 100 : 0;

    return {
      symbol,
      name: meta.shortName ?? meta.symbol ?? symbol,
      price: Math.round(price * 100) / 100,
      change: Math.round(change * 100) / 100,
      changePercent: Math.round(changePercent * 100) / 100,
    };
  } catch {
    return getSampleStockInfo(symbol);
  }
}

/** API 실패 시 사용할 샘플 캔들 데이터 */
function getSampleData(): CandleData[] {
  const data: CandleData[] = [];
  let price = 70000;

  for (let i = 60; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    // 주말 제외
    if (date.getDay() === 0 || date.getDay() === 6) continue;

    const change = (Math.random() - 0.48) * 2000;
    const open = price;
    const close = price + change;
    const high = Math.max(open, close) + Math.random() * 1000;
    const low = Math.min(open, close) - Math.random() * 1000;

    data.push({
      time: date.toISOString().split("T")[0],
      open: Math.round(open),
      high: Math.round(high),
      low: Math.round(low),
      close: Math.round(close),
      volume: Math.round(Math.random() * 10000000),
    });

    price = close;
  }

  return data;
}

/** API 실패 시 사용할 샘플 주식 정보 */
function getSampleStockInfo(symbol: string): StockInfo {
  return {
    symbol,
    name: symbol,
    price: 72500,
    change: 1500,
    changePercent: 2.11,
  };
}
