import { fetchCandleData } from "@/lib/stock-api";
import StockChart from "./StockChart";

type StockChartWrapperProps = {
  /** 종목 심볼 (예: "005930.KS", "AAPL") */
  symbol: string;
  /** 조회 기간 (예: "1m", "3m", "1y") */
  period?: string;
  /** 차트 높이 (px) */
  height?: number;
};

/**
 * MDX에서 사용할 서버 컴포넌트 래퍼
 * 서버에서 데이터를 fetch한 후 클라이언트 차트에 전달
 */
export default async function StockChartWrapper({
  symbol,
  period = "3m",
  height = 400,
}: StockChartWrapperProps) {
  // 서버에서 주식 데이터 조회
  const data = await fetchCandleData(symbol, period);

  return <StockChart data={data} symbol={symbol} height={height} />;
}
