import type { LWChartType, LWOhlcPoint, LWValuePoint } from "@/components"
import { formatTradingViewSymbol, LightweightChart, mapExchangeToTradingView, TradingViewWidget } from "@/components"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCoinGecko } from "@/contexts"
import { useCoinOHLC } from "@/hooks"
import type { ChartTimeframe, ChartType, CoinTicker } from "@/types"
import { BarChart3, CandlestickChart, TrendingUp } from "lucide-react"
import { useEffect, useState } from "react"

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
  coinSymbol: string
  currency: string
  tickers?: CoinTicker[]
}

export function EnhancedChartSection({ coinId, coinSymbol, currency, tickers = [] }: EnhancedChartSectionProps) {
  const [timeframe, setTimeframe] = useState<ChartTimeframe>("7D")
  const [chartType, setChartType] = useState<ChartType>("area")
  const [dataType, setDataType] = useState<"price" | "volume" | "mcap" | "tradingview">("price")

  // TradingView specific state
  const [selectedExchange, setSelectedExchange] = useState<string>("BINANCE")
  const [selectedQuote, setSelectedQuote] = useState<string>("USDT")

  const { chartData, isLoadingCharts, fetchChartDataForAssets } = useCoinGecko()
  const historicalData = chartData[coinId]

  // Extract available exchanges and quotes from tickers
  const availableExchanges = tickers.length > 0
    ? Array.from(new Set(tickers.map((t) => mapExchangeToTradingView(t.market.name))))
        .filter((ex) => ex !== "BINANCE")
        .slice(0, 5)
    : []
  const exchangeOptions = ["BINANCE", ...availableExchanges].filter((ex, i, arr) => arr.indexOf(ex) === i)

  const availableQuotes = tickers.length > 0
    ? Array.from(new Set(tickers.map((t) => t.target.toUpperCase()))).slice(0, 6)
    : ["USDT", "USD", "BTC"]
  const quoteOptions = Array.from(new Set(["USDT", "USD", ...availableQuotes]))

  // Fetch chart data when coinId or timeframe changes
  useEffect(() => {
    const days = timeframeToDays[timeframe]
    fetchChartDataForAssets([coinId], days)
  }, [coinId, timeframe, fetchChartDataForAssets])

  const { data: ohlcData, isLoading: isLoadingOHLC } = useCoinOHLC(coinId, timeframe, {
    vs_currency: currency,
  })

  // Transform to LightweightChart format
  const pricePoints: LWValuePoint[] =
    historicalData?.prices?.map(([timestamp, value]) => ({ timestamp, value })) ?? []
  const volumePoints: LWValuePoint[] =
    historicalData?.total_volumes?.map(([timestamp, value]) => ({ timestamp, value })) ?? []
  const mcapPoints: LWValuePoint[] =
    historicalData?.market_caps?.map(([timestamp, value]) => ({ timestamp, value })) ?? []
  const candlePoints: LWOhlcPoint[] =
    ohlcData?.map((c) => ({
      timestamp: c.timestamp,
      open: c.open,
      high: c.high,
      low: c.low,
      close: c.close,
    })) ?? []

  const timeframes: ChartTimeframe[] = ["1D", "7D", "30D", "90D", "1Y", "ALL"]
  const isLoading = chartType === "candlestick" ? isLoadingOHLC : isLoadingCharts

  // Map chartType to LWChartType
  const lwType: LWChartType =
    chartType === "candlestick" ? "candlestick" : chartType === "line" ? "line" : "area"

  const CHART_HEIGHT = 350

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
              <TabsTrigger value="tradingview" className="text-white data-[state=active]:bg-blue-600">
                TradingView
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
          <span className="ml-auto text-[10px] text-gray-600 whitespace-nowrap">
            Scroll to zoom · Drag to pan
          </span>
        </div>

        {/* Chart Content */}
        <TabsContent value="price" className="m-0 p-4">
          <LightweightChart
            type={lwType}
            data={chartType === "candlestick" ? candlePoints : pricePoints}
            color="#3b82f6"
            height={CHART_HEIGHT}
            currency={currency}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="volume" className="m-0 p-4">
          <LightweightChart
            type={chartType === "line" ? "line" : "histogram"}
            data={volumePoints}
            color="#10b981"
            height={CHART_HEIGHT}
            currency={currency}
            isLoading={isLoadingCharts}
          />
        </TabsContent>

        <TabsContent value="mcap" className="m-0 p-4">
          <LightweightChart
            type={lwType}
            data={mcapPoints}
            color="#f59e0b"
            height={CHART_HEIGHT}
            currency={currency}
            isLoading={isLoadingCharts}
          />
        </TabsContent>

        <TabsContent value="tradingview" className="m-0 p-0">
          <div className="bg-[#0d0e10]">
            {/* TradingView Controls */}
            <div className="px-4 py-3 border-b border-gray-800 flex flex-wrap items-center gap-2">
              <span className="text-xs text-gray-400">Exchange:</span>
              <select
                value={selectedExchange}
                onChange={(e) => setSelectedExchange(e.target.value)}
                className="px-2 py-1 text-xs bg-gray-800 text-gray-300 border border-gray-700 rounded hover:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {exchangeOptions.map((ex) => (
                  <option key={ex} value={ex}>
                    {ex}
                  </option>
                ))}
              </select>

              <span className="text-xs text-gray-400 ml-2">Quote:</span>
              <select
                value={selectedQuote}
                onChange={(e) => setSelectedQuote(e.target.value)}
                className="px-2 py-1 text-xs bg-gray-800 text-gray-300 border border-gray-700 rounded hover:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {quoteOptions.map((q) => (
                  <option key={q} value={q}>
                    {q}
                  </option>
                ))}
              </select>

              <span className="text-xs text-gray-500 ml-auto">
                Symbol: {coinSymbol.toUpperCase()}/{selectedQuote}
              </span>
            </div>

            {/* TradingView Chart */}
            <div className="p-4">
              <TradingViewWidget
                symbol={formatTradingViewSymbol(coinSymbol, selectedExchange, selectedQuote)}
                height={500}
                interval="D"
                theme="dark"
                toolbar={true}
                showVolume={true}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
