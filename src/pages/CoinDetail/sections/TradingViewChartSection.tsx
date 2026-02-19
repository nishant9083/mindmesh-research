import { TradingViewWidget, formatTradingViewSymbol, EXCHANGES, mapExchangeToTradingView } from "@/components"
import { useState } from "react"
import type { CoinTicker } from "@/types"

interface TradingViewChartSectionProps {
  coinSymbol: string
  coinName: string
  height?: number
  tickers?: CoinTicker[]
}

/**
 * TradingView Chart Section Component
 * 
 * A ready-to-use section component that displays a TradingView chart
 * for a specific cryptocurrency. Now supports dynamic exchanges based
 * on actual trading pairs from CoinGecko data.
 * 
 * @example
 * ```tsx
 * <TradingViewChartSection 
 *   coinSymbol="BTC" 
 *   coinName="Bitcoin"
 *   height={600}
 *   tickers={coinTickers}
 * />
 * ```
 */
export function TradingViewChartSection({ 
  coinSymbol, 
  coinName,
  height = 500,
  tickers = []
}: TradingViewChartSectionProps) {
  // Extract available exchanges from tickers
  const availableExchangesFromTickers = tickers.length > 0 
    ? Array.from(new Set(tickers.map(t => ({ 
        value: mapExchangeToTradingView(t.market.name),
        label: t.market.name 
      }))))
        .filter(ex => ex.value !== "BINANCE") // We'll add BINANCE as default
        .slice(0, 8) // Limit to top 8
    : []
  
  // Default exchanges combined with available from tickers
  const defaultExchanges = [
    { value: EXCHANGES.BINANCE, label: "Binance" },
    { value: EXCHANGES.COINBASE, label: "Coinbase" },
    { value: EXCHANGES.KRAKEN, label: "Kraken" },
    { value: EXCHANGES.BITSTAMP, label: "Bitstamp" },
    { value: EXCHANGES.BITFINEX, label: "Bitfinex" },
  ]
  
  // Merge and deduplicate exchanges
  const allExchanges = [...defaultExchanges, ...availableExchangesFromTickers]
  const exchanges = Array.from(
    new Map(allExchanges.map(ex => [ex.value, ex])).values()
  ).slice(0, 10) // Limit to 10 exchanges
  
  // Extract available quote currencies from tickers
  const availableQuotesFromTickers = tickers.length > 0
    ? Array.from(new Set(tickers.map(t => t.target.toUpperCase()))).slice(0, 8)
    : []
  
  // Default quotes combined with available from tickers
  const defaultQuotes = [
    { value: "USDT", label: "USDT" },
    { value: "USD", label: "USD" },
    { value: "BTC", label: "BTC" },
    { value: "ETH", label: "ETH" },
  ]
  
  const additionalQuotes = availableQuotesFromTickers
    .filter(q => !["USDT", "USD", "BTC", "ETH"].includes(q))
    .map(q => ({ value: q, label: q }))
  
  const quotes = [...defaultQuotes, ...additionalQuotes].slice(0, 8)
  
  // State for user preferences
  const [selectedExchange, setSelectedExchange] = useState<string>(exchanges[0]?.value || EXCHANGES.BINANCE)
  const [selectedQuote, setSelectedQuote] = useState<string>("USDT")
  const [interval, setInterval] = useState<"15" | "60" | "D" | "W">("D")

  // Generate the TradingView symbol
  const tvSymbol = formatTradingViewSymbol(coinSymbol, selectedExchange, selectedQuote)

  // Interval options
  const intervals = [
    { value: "15" as const, label: "15m" },
    { value: "60" as const, label: "1h" },
    { value: "D" as const, label: "1D" },
    { value: "W" as const, label: "1W" },
  ]

  return (
    <div className="bg-[#0a0b0d] border border-gray-800 rounded-lg overflow-hidden">
      {/* Header with controls */}
      <div className="px-4 py-3 border-b border-gray-800 bg-[#0d0e10]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-white">
              {coinName} Advanced Chart
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Powered by TradingView
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Exchange Selector */}
            <select
              value={selectedExchange}
              onChange={(e) => setSelectedExchange(e.target.value)}
              className="px-3 py-1.5 text-xs font-medium bg-gray-800 text-gray-300 border border-gray-700 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {exchanges.map((ex) => (
                <option key={ex.value} value={ex.value}>
                  {ex.label}
                </option>
              ))}
            </select>

            {/* Quote Currency Selector */}
            <select
              value={selectedQuote}
              onChange={(e) => setSelectedQuote(e.target.value)}
              className="px-3 py-1.5 text-xs font-medium bg-gray-800 text-gray-300 border border-gray-700 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {quotes.map((q) => (
                <option key={q.value} value={q.value}>
                  {q.label}
                </option>
              ))}
            </select>

            {/* Interval Selector */}
            <div className="flex items-center gap-1">
              {intervals.map((int) => (
                <button
                  key={int.value}
                  onClick={() => setInterval(int.value)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    interval === int.value
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                  }`}
                >
                  {int.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* TradingView Chart */}
      <div className="p-0">
        <TradingViewWidget
          symbol={tvSymbol}
          interval={interval}
          theme="dark"
          height={height}
          width="100%"
          toolbar={true}
          showVolume={true}
          hideSideToolbar={false}
          allowSymbolChange={false}
          containerStyle={{
            backgroundColor: "#0a0b0d",
          }}
        />
      </div>
    </div>
  )
}
