import { formatCompactNumber, formatCurrency } from "@/lib/format"
import {
    AreaSeries,
    CandlestickSeries,
    ColorType,
    createChart,
    CrosshairMode,
    HistogramSeries,
    LineSeries,
    TickMarkType,
    type UTCTimestamp,
} from "lightweight-charts"
import { useEffect, useRef, useState } from "react"

export type LWChartType = "area" | "line" | "candlestick" | "histogram"

export interface LWValuePoint {
  timestamp: number
  value: number
}

export interface LWOhlcPoint {
  timestamp: number
  open: number
  high: number
  low: number
  close: number
}

interface TooltipState {
  visible: boolean
  x: number
  y: number
  time: string
  value?: string
  open?: string
  high?: string
  low?: string
  close?: string
  isUp?: boolean
}

interface LightweightChartProps {
  type: LWChartType
  data: LWValuePoint[] | LWOhlcPoint[]
  color?: string
  height?: number
  currency?: string
  isLoading?: boolean
}

export function LightweightChart({
  type,
  data,
  color = "#3b82f6",
  height = 350,
  currency = "USD",
  isLoading = false,
}: LightweightChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<ReturnType<typeof createChart> | null>(null)
  const seriesRef = useRef<any>(null)
  const [tooltip, setTooltip] = useState<TooltipState>({ visible: false, x: 0, y: 0, time: "" })

  // Build/rebuild chart when type or styling changes
  useEffect(() => {
    if (!containerRef.current) return

    // Cleanup previous instance
    if (chartRef.current) {
      chartRef.current.remove()
      chartRef.current = null
      seriesRef.current = null
    }

    // Detect user locale and timezone from the browser
    const userLocale = navigator.language || "en-US"
    const userTZ = Intl.DateTimeFormat().resolvedOptions().timeZone

    // Formatters that use the user's local timezone
    // const fmtDate = new Intl.DateTimeFormat(userLocale, {
    //   timeZone: userTZ,
    //   month: "short",
    //   day: "numeric",
    //   year: "numeric",
    // })
    const fmtDateTime = new Intl.DateTimeFormat(userLocale, {
      timeZone: userTZ,
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
    const fmtTime = new Intl.DateTimeFormat(userLocale, {
      timeZone: userTZ,
      hour: "2-digit",
      minute: "2-digit",
    })
    // const fmtMonthDay = new Intl.DateTimeFormat(userLocale, {
    //   timeZone: userTZ,
    //   month: "short",
    //   day: "numeric",
    // })

    const chart = createChart(containerRef.current, {
      localization: {
        locale: userLocale,
        // timeFormatter: crosshair axis label (the label that appears on the time axis when hovering)
        timeFormatter: (utcSec: number) => {
          const d = new Date(utcSec * 1000)
          return fmtDateTime.format(d)
        },
      },
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#9ca3af",
        fontFamily: "inherit",
      },
      grid: {
        vertLines: { color: "#1f293750" },
        horzLines: { color: "#1f293750" },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: { color: "#4b5563", width: 1, style: 1, labelBackgroundColor: "#1f2937" },
        horzLine: { color: "#4b5563", width: 1, style: 1, labelBackgroundColor: "#1f2937" },
      },
      rightPriceScale: {
        borderColor: "#374151",
        textColor: "#9ca3af",
        scaleMargins: { top: 0.1, bottom: 0.1 },
      },
      timeScale: {
        borderColor: "#374151",
        timeVisible: true,
        secondsVisible: false,
        rightOffset: 5,
        barSpacing: 6,
        fixLeftEdge: false,
        fixRightEdge: false,
        // tickMarkFormatter renders the tick labels on the x-axis in the user's local timezone
        tickMarkFormatter: (utcSec: number, tickType: TickMarkType) => {
          const d = new Date(utcSec * 1000)
          if (tickType === TickMarkType.Year) {
            return new Intl.DateTimeFormat(userLocale, { timeZone: userTZ, year: "numeric" }).format(d)
          }
          if (tickType === TickMarkType.Month) {
            return new Intl.DateTimeFormat(userLocale, { timeZone: userTZ, month: "short", year: "numeric" }).format(d)
          }
          if (tickType === TickMarkType.DayOfMonth) {
            return new Intl.DateTimeFormat(userLocale, { timeZone: userTZ, month: "short", day: "numeric" }).format(d)
          }
          // TickMarkType.Time or TimeWithSeconds — show time only
          return fmtTime.format(d)
        },
      },
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
        horzTouchDrag: true,
        vertTouchDrag: false,
      },
      handleScale: {
        mouseWheel: true,
        pinch: true,
        axisPressedMouseMove: { time: true, price: false },
      },
      width: containerRef.current.clientWidth,
      height,
    })

    chartRef.current = chart

    // Format price axis labels
    const priceFormatter = (val: number) => formatCompactNumber(val, 2)

    let series: any

    if (type === "candlestick") {
      series = chart.addSeries(CandlestickSeries, {
        upColor: "#10b981",
        downColor: "#ef4444",
        borderUpColor: "#10b981",
        borderDownColor: "#ef4444",
        wickUpColor: "#10b981",
        wickDownColor: "#ef4444",
        priceFormat: { type: "custom", formatter: priceFormatter, minMove: 0.00001 },
      })
    } else if (type === "histogram") {
      series = chart.addSeries(HistogramSeries, {
        color,
        priceFormat: { type: "custom", formatter: priceFormatter, minMove: 0.01 },
        priceScaleId: "right",
      })
    } else if (type === "line") {
      series = chart.addSeries(LineSeries, {
        color,
        lineWidth: 2,
        crosshairMarkerVisible: true,
        crosshairMarkerRadius: 5,
        crosshairMarkerBackgroundColor: color,
        priceFormat: { type: "custom", formatter: priceFormatter, minMove: 0.00001 },
      })
    } else {
      // area
      series = chart.addSeries(AreaSeries, {
        lineColor: color,
        topColor: `${color}55`,
        bottomColor: `${color}00`,
        lineWidth: 2,
        crosshairMarkerVisible: true,
        crosshairMarkerRadius: 5,
        crosshairMarkerBackgroundColor: color,
        priceFormat: { type: "custom", formatter: priceFormatter, minMove: 0.00001 },
      })
    }

    seriesRef.current = series

    // Crosshair tooltip
    chart.subscribeCrosshairMove((param) => {
      if (!containerRef.current || !param.point || !param.time || !param.seriesData.size) {
        setTooltip((t) => ({ ...t, visible: false }))
        return
      }

      const rect = containerRef.current.getBoundingClientRect()
      const x = param.point.x
      const y = param.point.y
      const clampedX = Math.max(0, Math.min(x, rect.width))
      const clampedY = Math.max(0, Math.min(y, rect.height))

      const time = new Date((param.time as number) * 1000)
      // fmtDateTime and fmtTime are captured from the outer scope (local timezone)
      const timeStr = fmtDateTime.format(time)

      const seriesData = param.seriesData.get(series)

      if (type === "candlestick" && seriesData) {
        const d = seriesData as { open: number; high: number; low: number; close: number }
        setTooltip({
          visible: true,
          x: clampedX,
          y: clampedY,
          time: timeStr,
          isUp: d.close >= d.open,
          open: formatCurrency(d.open, currency.toUpperCase()),
          high: formatCurrency(d.high, currency.toUpperCase()),
          low: formatCurrency(d.low, currency.toUpperCase()),
          close: formatCurrency(d.close, currency.toUpperCase()),
        })
      } else if (seriesData && "value" in seriesData) {
        setTooltip({
          visible: true,
          x: clampedX,
          y: clampedY,
          time: timeStr,
          value: formatCurrency(seriesData.value as number, currency.toUpperCase()),
        })
      }
    })

    // ResizeObserver
    const observer = new ResizeObserver((entries) => {
      if (!chartRef.current || !entries.length) return
      chartRef.current.applyOptions({ width: entries[0].contentRect.width })
    })
    observer.observe(containerRef.current)

    return () => {
      observer.disconnect()
      chart.remove()
      chartRef.current = null
      seriesRef.current = null
      setTooltip({ visible: false, x: 0, y: 0, time: "" })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, color, height])

  // Update data when it changes
  useEffect(() => {
    if (!seriesRef.current || isLoading) return

    if (type === "candlestick") {
      const d = data as LWOhlcPoint[]
      if (!d.length) return
      seriesRef.current.setData(
        d
          .filter((p) => p.timestamp && p.open && p.high && p.low && p.close)
          .map((p) => ({ time: Math.floor(p.timestamp / 1000) as UTCTimestamp, open: p.open, high: p.high, low: p.low, close: p.close }))
      )
    } else {
      const d = data as LWValuePoint[]
      if (!d.length) return
      seriesRef.current.setData(
        d
          .filter((p) => p.timestamp && p.value != null)
          .map((p) => ({ time: Math.floor(p.timestamp / 1000) as UTCTimestamp, value: p.value }))
      )
    }

    chartRef.current?.timeScale().fitContent()
  }, [data, type, isLoading])

  const tooltipStyle: React.CSSProperties = {
    position: "absolute",
    left: tooltip.x > (containerRef.current?.clientWidth ?? 0) / 2 ? "auto" : tooltip.x + 12,
    right: tooltip.x > (containerRef.current?.clientWidth ?? 0) / 2
      ? (containerRef.current?.clientWidth ?? 0) - tooltip.x + 12
      : "auto",
    top: tooltip.y > 160 ? tooltip.y - 100 : tooltip.y + 12,
    pointerEvents: "none",
    zIndex: 10,
  }

  return (
    <div className="relative w-full" style={{ height }}>
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-gray-400 text-sm">Loading chart...</div>
        </div>
      ) : data.length === 0 ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-gray-400 text-sm">No data available</div>
        </div>
      ) : null}

      <div ref={containerRef} className="w-full" style={{ height, opacity: isLoading || data.length === 0 ? 0 : 1 }} />

      {tooltip.visible && (
        <div
          className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-xl text-xs"
          style={tooltipStyle}
        >
          <p className="text-gray-400 mb-2">{tooltip.time}</p>
          {type === "candlestick" ? (
            <div className="space-y-1">
              <div className="flex justify-between gap-4">
                <span className="text-gray-400">O</span>
                <span className="text-white font-medium">{tooltip.open}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-400">H</span>
                <span className="text-green-400 font-medium">{tooltip.high}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-400">L</span>
                <span className="text-red-400 font-medium">{tooltip.low}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-400">C</span>
                <span className={`font-medium ${tooltip.isUp ? "text-green-400" : "text-red-400"}`}>{tooltip.close}</span>
              </div>
            </div>
          ) : (
            <p className="text-white font-semibold">{tooltip.value}</p>
          )}
        </div>
      )}
    </div>
  )
}
