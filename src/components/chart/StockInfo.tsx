import { fetchStockInfo } from "@/lib/stock-api";

type StockInfoProps = {
  /** 종목 심볼 */
  symbol: string;
};

/**
 * 종목 요약 정보 카드 (서버 컴포넌트)
 * MDX 본문에서 <StockInfo symbol="005930.KS" /> 형태로 사용
 */
export default async function StockInfoCard({ symbol }: StockInfoProps) {
  const info = await fetchStockInfo(symbol);

  const isPositive = info.change >= 0;
  const changeColor = isPositive ? "text-red-600" : "text-blue-600";
  const arrow = isPositive ? "▲" : "▼";

  return (
    <div className="my-4 inline-flex items-center gap-4 rounded-lg border border-zinc-200 px-5 py-3 dark:border-zinc-800">
      {/* 종목명 */}
      <div>
        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          {info.name}
        </p>
        <p className="text-xs text-zinc-500">{info.symbol}</p>
      </div>

      {/* 현재가 */}
      <div className="text-right">
        <p className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
          {info.price.toLocaleString()}
        </p>
        <p className={`text-sm font-medium ${changeColor}`}>
          {arrow} {Math.abs(info.change).toLocaleString()} (
          {Math.abs(info.changePercent)}%)
        </p>
      </div>
    </div>
  );
}
