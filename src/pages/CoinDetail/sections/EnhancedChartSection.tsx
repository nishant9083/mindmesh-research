import { useState, useEffect } from "react"
import { useCoinGecko } from "@/contexts"
import { useCoinOHLC } from "@/hooks"
import type { ChartTimeframe, ChartType } from "@/types"
import { ComposedChart, LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Bar } from "recharts"
import { formatCurrency, formatDateTime, formatCompactNumber } from "@/lib/format"
import { TrendingUp, CandlestickChart, BarChart3 } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

// Timeframe to days mapping for API calls
const timeframeToDays: Record<ChartTimeframe, string | number> = {
  "1D": 1,
  "7D": 7,
  "30D": 30,
  "90D": 90,
  "1Y": 365,
  "ALL": "max",
}

interface EnhancedChartSectionProps {
  coinId: string
  coinName: string
  currency: string
}

// Custom Candlestick Shape Component
const Candlestick = (props: any) => {
  const { x, y, width, height, openClose } = props
  const isGrowing = openClose[1] > openClose[0]
  const color = isGrowing ? "#10b981" : "#ef4444"
  const ratio = Math.abs(height / (openClose[0] - openClose[1]))

  return (
    <g stroke={color} fill="none" strokeWidth="2">
      <path d={`M ${x + width / 2},${y} L ${x + width / 2},${y + height}`} />
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

export function EnhancedChartSection({ coinId, currency }: EnhancedChartSectionProps) {
  const [timeframe, setTimeframe] = useState<ChartTimeframe>("7D")
  const [chartType, setChartType] = useState<ChartType>("area")
  const [dataType, setDataType] = useState<"price" | "volume" | "mcap">("price")
  
  const { chartData, isLoadingCharts, fetchChartDataForAssets } = useCoinGecko()
  const historicalData = chartData[coinId]

  // Fetch chart data when coinId or timeframe changes
  useEffect(() => {
    const days = timeframeToDays[timeframe]
    fetchChartDataForAssets([coinId], days)
  }, [coinId, timeframe, fetchChartDataForAssets])

  const { data: ohlcData, isLoading: isLoadingOHLC } = useCoinOHLC(
    coinId,
    timeframe,
    { vs_currency: currency }
  )

  // Transform data
  const chartPoints = historicalData?.prices?.map(([timestamp, price], index) => ({
    timestamp,
    date: new Date(timestamp),
    price,
    volume: historicalData.total_volumes?.[index]?.[1] ?? 0,
    marketCap: historicalData.market_caps?.[index]?.[1] ?? 0,
  })) || []

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

  const getDataKey = () => {
    switch (dataType) {
      case "volume": return "volume"
      case "mcap": return "marketCap"
      default: return "price"
    }
  }

  const formatYAxis = (value: number) => {
    const formatted = formatCompactNumber(value, 2)
    return formatted
  }

  return (
    <div className="bg-[#0a0b0d] border border-gray-800 rounded-lg overflow-hidden">
      <Tabs defaultValue="price" className="w-full" onValueChange={(value) => setDataType(value as any)}>
        {/* Header with Tabs */}
        <div className="px-4 py-3 border-b border-gray-800 bg-linear-to-r from-gray-900/50 to-gray-900/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <TabsList className="bg-gray-900/50 border border-gray-700">
              <TabsTrigger value="price" className="text-white data-[state=active]:bg-blue-600">
                Price
              </TabsTrigger>
              <TabsTrigger value="volume" className="text-white data-[state=active]:bg-blue-600">
                Volume
              </TabsTrigger>
              <TabsTrigger value="mcap" className="text-white data-[state=active]:bg-blue-600">
                Market Cap
              </TabsTrigger>
            </TabsList>

            {/* Chart Type Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setChartType("area")}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  chartType === "area"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
              >
                <BarChart3 className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setChartType("line")}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  chartType === "line"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
              >
                <TrendingUp className="h-3.5 w-3.5" />
              </button>
              {dataType === "price" && (
                <button
                  onClick={() => setChartType("candlestick")}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    chartType === "candlestick"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                  }`}
                >
                  <CandlestickChart className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Timeframe Selector */}
        <div className="px-4 py-3 border-b border-gray-800 flex items-center gap-2 overflow-x-auto">
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                timeframe === tf
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800/50 text-gray-400 hover:bg-gray-700"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>

        {/* Chart Content */}
        <TabsContent value="price" className="m-0 p-4">
          <div className="h-87.5 w-full">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-gray-400 text-sm">Loading chart...</div>
              </div>
            ) : chartType === "candlestick" ? (
              candlestickPoints.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={candlestickPoints}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                    <XAxis
                      dataKey="timestamp"
                      tickFormatter={(value) => {
                        const date = new Date(value)
                        return timeframe === "1D"
                          ? date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
                          : date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
                      }}
                      stroke="#6b7280"
                      style={{ fontSize: "11px" }}
                    />
                    <YAxis
                      domain={["auto", "auto"]}
                      tickFormatter={formatYAxis}
                      stroke="#6b7280"
                      style={{ fontSize: "11px" }}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload
                          const isGrowing = data.close >= data.open
                          return (
                            <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-xl">
                              <p className="text-xs text-gray-400 mb-2">{formatDateTime(data.timestamp)}</p>
                              <div className="space-y-1 text-xs">
                                <div className="flex justify-between gap-3">
                                  <span className="text-gray-400">O:</span>
                                  <span className="text-white font-medium">{formatCurrency(data.open, currency.toUpperCase())}</span>
                                </div>
                                <div className="flex justify-between gap-3">
                                  <span className="text-gray-400">H:</span>
                                  <span className="text-green-400 font-medium">{formatCurrency(data.high, currency.toUpperCase())}</span>
                                </div>
                                <div className="flex justify-between gap-3">
                                  <span className="text-gray-400">L:</span>
                                  <span className="text-red-400 font-medium">{formatCurrency(data.low, currency.toUpperCase())}</span>
                                </div>
                                <div className="flex justify-between gap-3">
                                  <span className="text-gray-400">C:</span>
                                  <span className={`font-medium ${isGrowing ? "text-green-400" : "text-red-400"}`}>
                                    {formatCurrency(data.close, currency.toUpperCase())}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Bar dataKey="openClose" fill="#8884d8" shape={<Candlestick />} label={false} />
                  </ComposedChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-gray-400 text-sm">No data available</div>
                </div>
              )
            ) : chartPoints.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                {chartType === "area" ? (
                  <AreaChart data={chartPoints}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                    <XAxis
                      dataKey="timestamp"
                      tickFormatter={(value) => {
                        const date = new Date(value)
                        return timeframe === "1D"
                          ? date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
                          : date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
                      }}
                      stroke="#6b7280"
                      style={{ fontSize: "11px" }}
                    />
                    <YAxis
                      domain={["auto", "auto"]}
                      tickFormatter={formatYAxis}
                      stroke="#6b7280"
                      style={{ fontSize: "11px" }}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload
                          const value = data[getDataKey()]
                          return (
                            <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-xl">
                              <p className="text-xs text-gray-400 mb-1">{formatDateTime(data.timestamp)}</p>
                              <p className="text-sm font-semibold text-white">
                                {formatCurrency(value, currency.toUpperCase())}
                              </p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey={getDataKey()}
                      stroke="#3b82f6"
                      strokeWidth={2}
                      fill="url(#colorValue)"
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
                        return timeframe === "1D"
                          ? date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
                          : date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
                      }}
                      stroke="#6b7280"
                      style={{ fontSize: "11px" }}
                    />
                    <YAxis
                      domain={["auto", "auto"]}
                      tickFormatter={formatYAxis}
                      stroke="#6b7280"
                      style={{ fontSize: "11px" }}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload
                          const value = data[getDataKey()]
                          return (
                            <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-xl">
                              <p className="text-xs text-gray-400 mb-1">{formatDateTime(data.timestamp)}</p>
                              <p className="text-sm font-semibold text-white">
                                {formatCurrency(value, currency.toUpperCase())}
                              </p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey={getDataKey()}
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
                <div className="text-gray-400 text-sm">No data available</div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="volume" className="m-0 p-4">
          <div className="h-87.5 w-full">
            {isLoadingCharts ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-gray-400 text-sm">Loading chart...</div>
              </div>
            ) : chartPoints.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                {chartType === "area" ? (
                  <AreaChart data={chartPoints}>
                    <defs>
                      <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                    <XAxis
                      dataKey="timestamp"
                      tickFormatter={(value) => {
                        const date = new Date(value)
                        return timeframe === "1D"
                          ? date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
                          : date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
                      }}
                      stroke="#6b7280"
                      style={{ fontSize: "11px" }}
                    />
                    <YAxis
                      domain={["auto", "auto"]}
                      tickFormatter={formatYAxis}
                      stroke="#6b7280"
                      style={{ fontSize: "11px" }}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload
                          return (
                            <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-xl">
                              <p className="text-xs text-gray-400 mb-1">{formatDateTime(data.timestamp)}</p>
                              <p className="text-sm font-semibold text-white">
                                {formatCurrency(data.volume, currency.toUpperCase())}
                              </p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="volume"
                      stroke="#10b981"
                      strokeWidth={2}
                      fill="url(#colorVolume)"
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
                        return timeframe === "1D"
                          ? date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
                          : date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
                      }}
                      stroke="#6b7280"
                      style={{ fontSize: "11px" }}
                    />
                    <YAxis
                      domain={["auto", "auto"]}
                      tickFormatter={formatYAxis}
                      stroke="#6b7280"
                      style={{ fontSize: "11px" }}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload
                          return (
                            <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-xl">
                              <p className="text-xs text-gray-400 mb-1">{formatDateTime(data.timestamp)}</p>
                              <p className="text-sm font-semibold text-white">
                                {formatCurrency(data.volume, currency.toUpperCase())}
                              </p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="volume"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={false}
                      animationDuration={300}
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-gray-400 text-sm">No data available</div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="mcap" className="m-0 p-4">
          <div className="h-87.5 w-full">
            {isLoadingCharts ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-gray-400 text-sm">Loading chart...</div>
              </div>
            ) : chartPoints.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                {chartType === "area" ? (
                  <AreaChart data={chartPoints}>
                    <defs>
                      <linearGradient id="colorMcap" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                    <XAxis
                      dataKey="timestamp"
                      tickFormatter={(value) => {
                        const date = new Date(value)
                        return timeframe === "1D"
                          ? date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
                          : date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
                      }}
                      stroke="#6b7280"
                      style={{ fontSize: "11px" }}
                    />
                    <YAxis
                      domain={["auto", "auto"]}
                      tickFormatter={formatYAxis}
                      stroke="#6b7280"
                      style={{ fontSize: "11px" }}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload
                          return (
                            <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-xl">
                              <p className="text-xs text-gray-400 mb-1">{formatDateTime(data.timestamp)}</p>
                              <p className="text-sm font-semibold text-white">
                                {formatCurrency(data.marketCap, currency.toUpperCase())}
                              </p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="marketCap"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      fill="url(#colorMcap)"
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
                        return timeframe === "1D"
                          ? date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
                          : date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
                      }}
                      stroke="#6b7280"
                      style={{ fontSize: "11px" }}
                    />
                    <YAxis
                      domain={["auto", "auto"]}
                      tickFormatter={formatYAxis}
                      stroke="#6b7280"
                      style={{ fontSize: "11px" }}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload
                          return (
                            <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-xl">
                              <p className="text-xs text-gray-400 mb-1">{formatDateTime(data.timestamp)}</p>
                              <p className="text-sm font-semibold text-white">
                                {formatCurrency(data.marketCap, currency.toUpperCase())}
                              </p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="marketCap"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      dot={false}
                      animationDuration={300}
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-gray-400 text-sm">No data available</div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
