import { useState } from "react"
import { useCoinGecko } from "@/contexts"
import { useCoinOHLC } from "@/hooks"
import type { ChartTimeframe, ChartType } from "@/types"
import { ComposedChart, LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Bar } from "recharts"
import { formatCurrency, formatDateTime } from "@/lib/format"
import { TrendingUp, CandlestickChart } from "lucide-react"

interface PriceChartSectionProps {
  coinId: string
  coinName: string
  currency: string
}

// Custom Candlestick Shape Component
const Candlestick = (props: any) => {
  const { x, y, width, height, openClose } = props
  const isGrowing = openClose[1] > openClose[0]
  const color = isGrowing ? "#10b981" : "#ef4444" // green or red
  const ratio = Math.abs(height / (openClose[0] - openClose[1]))

  return (
    <g stroke={color} fill="none" strokeWidth="2">
      {/* High-Low line (wick) */}
      <path
        d={`
          M ${x + width / 2},${y}
          L ${x + width / 2},${y + height}
        `}
      />
      {/* Open-Close box (body) */}
      <path
        d={`
          M ${x},${y + (isGrowing ? (1 - ratio) * height : 0)}
          L ${x},${y + (isGrowing ? height : ratio * height)}
          L ${x + width},${y + (isGrowing ? height : ratio * height)}
          L ${x + width},${y + (isGrowing ? (1 - ratio) * height : 0)}
          Z
        `}
        fill={color}
        fillOpacity="0.6"
      />
    </g>
  )
}

export function PriceChartSection({ coinId, coinName, currency }: PriceChartSectionProps) {
  const [timeframe, setTimeframe] = useState<ChartTimeframe>("1D")
  const [chartType, setChartType] = useState<ChartType>("area")
  
  const { chartData, isLoadingCharts } = useCoinGecko()
  const historicalData = chartData[coinId]

  // Fetch OHLC data for candlestick chart
  const { data: ohlcData, isLoading: isLoadingOHLC } = useCoinOHLC(
    coinId,
    timeframe,
    { vs_currency: currency }
  )

  // Transform data for line/area chart
  const chartPoints = historicalData?.prices?.map(([timestamp, price]) => ({
    timestamp,
    date: new Date(timestamp),
    price,
  })) || []

  // Transform OHLC data for candlestick chart
  const candlestickPoints = ohlcData?.map((candle) => ({
    timestamp: candle.timestamp,
    date: new Date(candle.timestamp),
    open: candle.open,
    high: candle.high,
    low: candle.low,
    close: candle.close,
    openClose: [candle.open, candle.close],
  })) || []

  const timeframes: ChartTimeframe[] = ["1D", "7D", "30D", "90D", "1Y", "ALL"]
  
  const isLoading = chartType === "candlestick" ? isLoadingOHLC : isLoadingCharts

  return (
    <div className="bg-[#0a0b0d] border border-gray-800 rounded-lg p-6">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            {coinName} Price Chart
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Historical price data in {currency.toUpperCase()}
          </p>
        </div>

        {/* Chart Type Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setChartType("area")}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              chartType === "area"
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            Area
          </button>
          <button
            onClick={() => setChartType("line")}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              chartType === "line"
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            Line
          </button>
          <button
            onClick={() => setChartType("candlestick")}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${
              chartType === "candlestick"
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            <CandlestickChart className="h-4 w-4" />
            Candlestick
          </button>
        </div>
      </div>

      {/* Timeframe Selector */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        {timeframes.map((tf) => (
          <button
            key={tf}
            onClick={() => setTimeframe(tf)}
            className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
              timeframe === tf
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            {tf}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="h-100 w-full">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-gray-400">Loading chart data...</div>
          </div>
        ) : chartType === "candlestick" ? (
          /* Candlestick Chart */
          candlestickPoints.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={candlestickPoints}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={(value) => {
                    const date = new Date(value)
                    if (timeframe === "1D") {
                      return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
                    }
                    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
                  }}
                  stroke="#6b7280"
                  style={{ fontSize: "12px" }}
                />
                <YAxis
                  domain={["auto", "auto"]}
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                  stroke="#6b7280"
                  style={{ fontSize: "12px" }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload
                      const isGrowing = data.close >= data.open
                      return (
                        <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-xl">
                          <p className="text-xs text-gray-400 mb-2">
                            {formatDateTime(data.timestamp)}
                          </p>
                          <div className="space-y-1 text-xs">
                            <div className="flex justify-between gap-3">
                              <span className="text-gray-400">Open:</span>
                              <span className="text-white font-medium">
                                {formatCurrency(data.open, currency.toUpperCase(), {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: data.open < 1 ? 6 : 2,
                                })}
                              </span>
                            </div>
                            <div className="flex justify-between gap-3">
                              <span className="text-gray-400">High:</span>
                              <span className="text-green-400 font-medium">
                                {formatCurrency(data.high, currency.toUpperCase(), {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: data.high < 1 ? 6 : 2,
                                })}
                              </span>
                            </div>
                            <div className="flex justify-between gap-3">
                              <span className="text-gray-400">Low:</span>
                              <span className="text-red-400 font-medium">
                                {formatCurrency(data.low, currency.toUpperCase(), {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: data.low < 1 ? 6 : 2,
                                })}
                              </span>
                            </div>
                            <div className="flex justify-between gap-3">
                              <span className="text-gray-400">Close:</span>
                              <span className={`font-medium ${isGrowing ? "text-green-400" : "text-red-400"}`}>
                                {formatCurrency(data.close, currency.toUpperCase(), {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: data.close < 1 ? 6 : 2,
                                })}
                              </span>
                            </div>
                            <div className="flex justify-between gap-3 pt-1 mt-1 border-t border-gray-700">
                              <span className="text-gray-400">Change:</span>
                              <span className={`font-medium ${isGrowing ? "text-green-400" : "text-red-400"}`}>
                                {isGrowing ? "+" : ""}
                                {((data.close - data.open) / data.open * 100).toFixed(2)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Bar
                  dataKey="openClose"
                  fill="#8884d8"
                  shape={<Candlestick />}
                  label={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-gray-400">No candlestick data available</div>
            </div>
          )
        ) : chartPoints.length > 0 ? (
          /* Line / Area Chart */
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "area" ? (
              <AreaChart data={chartPoints}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={(value) => {
                    const date = new Date(value)
                    if (timeframe === "1D") {
                      return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
                    }
                    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
                  }}
                  stroke="#6b7280"
                  style={{ fontSize: "12px" }}
                />
                <YAxis
                  domain={["auto", "auto"]}
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                  stroke="#6b7280"
                  style={{ fontSize: "12px" }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload
                      return (
                        <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-xl">
                          <p className="text-xs text-gray-400 mb-1">
                            {formatDateTime(data.timestamp)}
                          </p>
                          <p className="text-sm font-semibold text-white">
                            {formatCurrency(data.price, currency.toUpperCase(), {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: data.price < 1 ? 6 : 2,
                            })}
                          </p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="url(#colorPrice)"
                  animationDuration={300}
                />
              </AreaChart>
            ) : (
              <LineChart data={chartPoints}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={(value) => {
                    const date = new Date(value)
                    if (timeframe === "1D") {
                      return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
                    }
                    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
                  }}
                  stroke="#6b7280"
                  style={{ fontSize: "12px" }}
                />
                <YAxis
                  domain={["auto", "auto"]}
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                  stroke="#6b7280"
                  style={{ fontSize: "12px" }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload
                      return (
                        <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-xl">
                          <p className="text-xs text-gray-400 mb-1">
                            {formatDateTime(data.timestamp)}
                          </p>
                          <p className="text-sm font-semibold text-white">
                            {formatCurrency(data.price, currency.toUpperCase(), {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: data.price < 1 ? 6 : 2,
                            })}
                          </p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={false}
                  animationDuration={300}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-gray-400">No chart data available</div>
          </div>
        )}
      </div>
    </div>
  )
}
