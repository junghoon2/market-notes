"use client";

import { useEffect, useRef } from "react";
import { createChart, ColorType, LineSeries } from "lightweight-charts";
import type { CandleData } from "@/lib/stock-api";

type MiniChartProps = {
  /** 캔들 데이터 (close만 사용) */
  data: CandleData[];
  /** 차트 너비 (px) */
  width?: number;
  /** 차트 높이 (px) */
  height?: number;
};

/** 글 목록에서 사용하는 소형 라인 차트 */
export default function MiniChart({
  data,
  width = 120,
  height = 40,
}: MiniChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || data.length === 0) return;

    containerRef.current.innerHTML = "";

    // 상승/하락 판별
    const firstClose = data[0].close;
    const lastClose = data[data.length - 1].close;
    const isUp = lastClose >= firstClose;
    const lineColor = isUp ? "#ef4444" : "#3b82f6";

    const chart = createChart(containerRef.current, {
      width,
      height,
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
      },
      // 미니 차트는 축/그리드 숨김
      rightPriceScale: { visible: false },
      timeScale: { visible: false },
      grid: {
        vertLines: { visible: false },
        horzLines: { visible: false },
      },
      crosshair: {
        vertLine: { visible: false },
        horzLine: { visible: false },
      },
      handleScroll: false,
      handleScale: false,
    });

    // 라인 시리즈로 종가만 표시
    const lineSeries = chart.addSeries(LineSeries, {
      color: lineColor,
      lineWidth: 2,
      priceLineVisible: false,
      lastValueVisible: false,
      crosshairMarkerVisible: false,
    });

    lineSeries.setData(
      data.map((d) => ({ time: d.time, value: d.close }))
    );

    chart.timeScale().fitContent();

    return () => chart.remove();
  }, [data, width, height]);

  if (data.length === 0) return null;

  return <div ref={containerRef} className="inline-block" />;
}
