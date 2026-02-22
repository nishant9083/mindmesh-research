import { formatCompactNumber, formatCurrency } from "@/lib/format"
import {
    AreaSeries,
    ColorType,
    createChart,
    CrosshairMode,
    HistogramSeries,
    LineSeries,
    TickMarkType,
    type ISeriesApi,
    type UTCTimestamp,
} from "lightweight-charts"
import { useEffect, useRef, useState } from "react"

export interface MultiSeriesItem {
  id: string
  label: string
  color: string
  data: Array<{ timestamp: number; value: number }>
}

interface TooltipRow {
  id: string
  label: string
  color: string
  value: string
  raw: number
}

interface TooltipState {
  visible: boolean
  x: number
  y: number
  time: string
  rows: TooltipRow[]
}

interface MultiSeriesLightweightChartProps {
  series: MultiSeriesItem[]
  type: "area" | "line" | "histogram"
  /** Fixed height in px. Omit or pass 0 to fill parent (requires parent to have a defined height). */
  height?: number
  isPercentage?: boolean
  currency?: string
  isLoading?: boolean
}

export function MultiSeriesLightweightChart({
  series,
  type,
  height = 0,
  isPercentage = false,
  currency = "USD",
  isLoading = false,
}: MultiSeriesLightweightChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<ReturnType<typeof createChart> | null>(null)
  const seriesMapRef = useRef<Map<string, ISeriesApi<any>>>(new Map())
  const [tooltip, setTooltip] = useState<TooltipState>({ visible: false, x: 0, y: 0, time: "", rows: [] })
  const [containerHeight, setContainerHeight] = useState(height || 300)

  // Build/rebuild chart when type changes
  useEffect(() => {
    if (!containerRef.current) return
    const resolvedHeight = containerHeight
    if (!resolvedHeight) return

    if (chartRef.current) {
      chartRef.current.remove()
      chartRef.current = null
      seriesMapRef.current.clear()
    }

    const userLocale = navigator.language || "en-US"
    const userTZ = Intl.DateTimeFormat().resolvedOptions().timeZone

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

    const chart = createChart(containerRef.current, {
      localization: {
        locale: userLocale,
        timeFormatter: (utcSec: number) => fmtDateTime.format(new Date(utcSec * 1000)),
      },
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#9ca3af",
        fontFamily: "inherit",
      },
      grid: {
        vertLines: { color: "#1e273850" },
        horzLines: { color: "#1e273850" },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: { color: "#4b5563", width: 1, style: 1, labelBackgroundColor: "#1a2332" },
        horzLine: { color: "#4b5563", width: 1, style: 1, labelBackgroundColor: "#1a2332" },
      },
      rightPriceScale: {
        visible: false,
      },
      leftPriceScale: {
        visible: true,
        borderColor: "#2a3548",
        textColor: "#718096",
        scaleMargins: { top: 0.08, bottom: 0.08 },
      },
      timeScale: {
        borderColor: "#2a3548",
        timeVisible: true,
        secondsVisible: false,
        rightOffset: 5,
        barSpacing: 4,
        fixLeftEdge: false,
        fixRightEdge: false,
        tickMarkFormatter: (utcSec: number, tickType: TickMarkType) => {
          const d = new Date(utcSec * 1000)
          if (tickType === TickMarkType.Year)
            return new Intl.DateTimeFormat(userLocale, { timeZone: userTZ, year: "numeric" }).format(d)
          if (tickType === TickMarkType.Month)
            return new Intl.DateTimeFormat(userLocale, { timeZone: userTZ, month: "short", year: "numeric" }).format(d)
          if (tickType === TickMarkType.DayOfMonth)
            return new Intl.DateTimeFormat(userLocale, { timeZone: userTZ, month: "short", day: "numeric" }).format(d)
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
      height: resolvedHeight,
    })

    chartRef.current = chart

    const priceFormatter = (val: number) =>
      isPercentage
        ? `${val >= 0 ? "+" : ""}${val.toFixed(2)}%`
        : formatCompactNumber(val, 2)

    // Create a series per asset
    for (const s of series) {
      let lwSeries: ISeriesApi<any>

      if (type === "histogram") {
        lwSeries = chart.addSeries(HistogramSeries, {
          color: s.color,
          priceFormat: { type: "custom", formatter: priceFormatter, minMove: 0.0001 },
          priceScaleId: "left",
        })
      } else if (type === "line") {
        lwSeries = chart.addSeries(LineSeries, {
          color: s.color,
          lineWidth: 2,
          crosshairMarkerVisible: true,
          crosshairMarkerRadius: 4,
          crosshairMarkerBackgroundColor: s.color,
          priceFormat: { type: "custom", formatter: priceFormatter, minMove: 0.0001 },
          priceScaleId: "left",
        })
      } else {
        lwSeries = chart.addSeries(AreaSeries, {
          lineColor: s.color,
          topColor: `${s.color}`,
          bottomColor: `${s.color}`,
          lineWidth: 2,
          crosshairMarkerVisible: true,
          crosshairMarkerRadius: 4,
          crosshairMarkerBackgroundColor: s.color,
          priceFormat: { type: "custom", formatter: priceFormatter, minMove: 0.0001 },
          priceScaleId: "left",
        })
      }

      if (s.data.length) {
        lwSeries.setData(
          s.data
            .filter((p) => p.timestamp && p.value != null)
            .map((p) => ({
              time: Math.floor(p.timestamp / 1000) as UTCTimestamp,
              value: p.value,
            }))
        )
      }

      seriesMapRef.current.set(s.id, lwSeries)
    }

    chart.timeScale().fitContent()

    // Multi-series crosshair tooltip
    chart.subscribeCrosshairMove((param) => {
      if (!containerRef.current || !param.point || !param.time || !param.seriesData.size) {
        setTooltip((t) => ({ ...t, visible: false }))
        return
      }

      const x = param.point.x
      const y = param.point.y
      const clampedX = Math.max(0, Math.min(x, containerRef.current.clientWidth))
      const clampedY = Math.max(0, Math.min(y, containerHeight))
      const timeStr = fmtDateTime.format(new Date((param.time as number) * 1000))

      const rows: TooltipRow[] = []
      for (const s of series) {
        const lwS = seriesMapRef.current.get(s.id)
        if (!lwS) continue
        const d = param.seriesData.get(lwS)
        if (!d || !("value" in d)) continue
        const raw = d.value as number
        rows.push({
          id: s.id,
          label: s.label,
          color: s.color,
          raw,
          value: isPercentage
            ? `${raw >= 0 ? "+" : ""}${raw.toFixed(2)}%`
            : formatCurrency(raw, currency.toUpperCase()),
        })
      }

      if (!rows.length) {
        setTooltip((t) => ({ ...t, visible: false }))
        return
      }

      setTooltip({ visible: true, x: clampedX, y: clampedY, time: timeStr, rows })
    })

    const observer = new ResizeObserver((entries) => {
      if (!chartRef.current || !entries.length) return
      const { width, height: h } = entries[0].contentRect
      chartRef.current.applyOptions({ width })
      // If auto-height mode, track height changes too
      if (!height && h > 0) {
        setContainerHeight(h)
        chartRef.current.applyOptions({ height: h })
      }
    })
    observer.observe(containerRef.current)

    return () => {
      observer.disconnect()
      chart.remove()
      chartRef.current = null
      seriesMapRef.current.clear()
      setTooltip({ visible: false, x: 0, y: 0, time: "", rows: [] })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, containerHeight, isPercentage])

  // Update data, add new series, remove dropped series — without rebuilding chart
  useEffect(() => {
    if (!chartRef.current || isLoading) return

    const chart = chartRef.current
    const currentIds = new Set(series.map((s) => s.id))
    const existingIds = new Set(seriesMapRef.current.keys())

    const priceFormatter = (val: number) =>
      isPercentage
        ? `${val >= 0 ? "+" : ""}${val.toFixed(2)}%`
        : formatCompactNumber(val, 2)

    // Remove series no longer in the list
    for (const id of existingIds) {
      if (!currentIds.has(id)) {
        const lwS = seriesMapRef.current.get(id)
        if (lwS) {
          try { chart.removeSeries(lwS) } catch {}
        }
        seriesMapRef.current.delete(id)
      }
    }

    // Add or update series
    for (const s of series) {
      let lwS = seriesMapRef.current.get(s.id)

      if (!lwS) {
        // New series — create and register
        if (type === "histogram") {
          lwS = chart.addSeries(HistogramSeries, {
            color: s.color,
            priceFormat: { type: "custom", formatter: priceFormatter, minMove: 0.0001 },
            priceScaleId: "left",
          })
        } else if (type === "line") {
          lwS = chart.addSeries(LineSeries, {
            color: s.color,
            lineWidth: 2,
            crosshairMarkerVisible: true,
            crosshairMarkerRadius: 4,
            crosshairMarkerBackgroundColor: s.color,
            priceFormat: { type: "custom", formatter: priceFormatter, minMove: 0.0001 },
            priceScaleId: "left",
          })
        } else {
          lwS = chart.addSeries(AreaSeries, {
            lineColor: s.color,
            topColor: `${s.color}40`,
            bottomColor: `${s.color}00`,
            lineWidth: 2,
            crosshairMarkerVisible: true,
            crosshairMarkerRadius: 4,
            crosshairMarkerBackgroundColor: s.color,
            priceFormat: { type: "custom", formatter: priceFormatter, minMove: 0.0001 },
            priceScaleId: "left",
          })
        }
        seriesMapRef.current.set(s.id, lwS)
      }

      // Set data
      if (s.data.length) {
        lwS.setData(
          s.data
            .filter((p) => p.timestamp && p.value != null)
            .map((p) => ({
              time: Math.floor(p.timestamp / 1000) as UTCTimestamp,
              value: p.value,
            }))
        )
      }
    }

    chart.timeScale().fitContent()
  }, [series, type, isPercentage, isLoading])

  const tooltipStyle: React.CSSProperties = {
    position: "absolute",
    left: tooltip.x > (containerRef.current?.clientWidth ?? 0) / 2 ? "auto" : tooltip.x + 12,
    right:
      tooltip.x > (containerRef.current?.clientWidth ?? 0) / 2
        ? (containerRef.current?.clientWidth ?? 0) - tooltip.x + 12
        : "auto",
    top: tooltip.y > 140 ? tooltip.y - (tooltip.rows.length * 24 + 40) : tooltip.y + 12,
    pointerEvents: "none",
    zIndex: 10,
  }

  return (
    <div className="relative w-full h-full" style={height ? { height } : undefined}>
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 z-10">
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-500 text-xs">Loading chart…</span>
        </div>
      )}
      {!isLoading && series.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-600 text-xs">
          Select assets from the table to view chart
        </div>
      )}

      <div
        ref={containerRef}
        className="w-full h-full"
        style={{ height: height || undefined, opacity: isLoading || series.length === 0 ? 0 : 1 }}
      />

      {tooltip.visible && tooltip.rows.length > 0 && (
        <div
          className="bg-[#1a2332] border border-[#2a3548] rounded-lg p-2.5 shadow-xl text-xs"
          style={tooltipStyle}
        >
          <p className="text-gray-400 text-[10px] mb-1.5">{tooltip.time}</p>
          {tooltip.rows.map((row) => (
            <div key={row.id} className="flex items-center justify-between gap-4 mb-1 last:mb-0">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: row.color }} />
                <span className="text-gray-400 text-[11px]">{row.label}</span>
              </div>
              <span
                className="text-white font-medium text-[11px]"
                style={
                  row.raw !== undefined && isPercentage
                    ? { color: row.raw >= 0 ? "#10b981" : "#ef4444" }
                    : {}
                }
              >
                {row.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
