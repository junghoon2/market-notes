"use client";

import { useEffect, useRef, useState } from "react";
import {
  createChart,
  ColorType,
  CandlestickSeries,
  HistogramSeries,
} from "lightweight-charts";
import type { CandleData } from "@/lib/stock-api";

type StockChartProps = {
  /** 초기 캔들 데이터 (서버에서 전달) */
  data: CandleData[];
  /** 종목 심볼 */
  symbol: string;
  /** 차트 높이 (px) */
  height?: number;
};

/** 인터랙티브 캔들스틱 차트 컴포넌트 */
export default function StockChart({
  data,
  symbol,
  height = 400,
}: StockChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  // 다크모드 감지 상태
  const [isDark, setIsDark] = useState(false);

  // 다크모드 감지
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDark(mq.matches);

    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // 차트 생성 및 데이터 바인딩
  useEffect(() => {
    if (!chartContainerRef.current || data.length === 0) return;

    // 기존 차트 정리
    chartContainerRef.current.innerHTML = "";

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: {
          type: ColorType.Solid,
          color: isDark ? "#09090b" : "#ffffff",
        },
        textColor: isDark ? "#a1a1aa" : "#71717a",
      },
      grid: {
        vertLines: { color: isDark ? "#27272a" : "#f4f4f5" },
        horzLines: { color: isDark ? "#27272a" : "#f4f4f5" },
      },
      width: chartContainerRef.current.clientWidth,
      height,
      rightPriceScale: {
        borderColor: isDark ? "#27272a" : "#e4e4e7",
      },
      timeScale: {
        borderColor: isDark ? "#27272a" : "#e4e4e7",
        timeVisible: false,
      },
      crosshair: {
        vertLine: { color: isDark ? "#3f3f46" : "#d4d4d8" },
        horzLine: { color: isDark ? "#3f3f46" : "#d4d4d8" },
      },
    });

    // 캔들스틱 시리즈 추가
    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#ef4444",
      downColor: "#3b82f6",
      borderUpColor: "#ef4444",
      borderDownColor: "#3b82f6",
      wickUpColor: "#ef4444",
      wickDownColor: "#3b82f6",
    });

    candleSeries.setData(data);

    // 볼륨 히스토그램 추가
    const volumeSeries = chart.addSeries(HistogramSeries, {
      priceFormat: { type: "volume" },
      priceScaleId: "volume",
    });

    chart.priceScale("volume").applyOptions({
      scaleMargins: { top: 0.8, bottom: 0 },
    });

    const volumeData = data
      .filter((d) => d.volume != null)
      .map((d) => ({
        time: d.time,
        value: d.volume!,
        color:
          d.close >= d.open
            ? isDark
              ? "rgba(239,68,68,0.3)"
              : "rgba(239,68,68,0.4)"
            : isDark
              ? "rgba(59,130,246,0.3)"
              : "rgba(59,130,246,0.4)",
      }));

    volumeSeries.setData(volumeData);

    // 차트를 데이터에 맞게 조정
    chart.timeScale().fitContent();

    // 리사이즈 대응
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [data, height, isDark]);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-dashed border-zinc-300 p-8 text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
        {symbol}의 차트 데이터를 불러올 수 없습니다.
      </div>
    );
  }

  return (
    <div className="my-6 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
      {/* 차트 헤더 */}
      <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
        <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          {symbol}
        </span>
        <span className="text-xs text-zinc-500 dark:text-zinc-400">
          Powered by Lightweight Charts
        </span>
      </div>
      {/* 차트 영역 */}
      <div ref={chartContainerRef} />
    </div>
  );
}
