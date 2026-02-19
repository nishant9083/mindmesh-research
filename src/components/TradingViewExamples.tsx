/**
 * TradingView Widget Examples
 * 
 * This file contains various example implementations of the TradingView widget
 * These examples can be copied and used throughout the application
 */

import { TradingViewWidget, formatTradingViewSymbol, EXCHANGES, QUOTE_CURRENCIES } from "@/components"
import { TradingViewChartSection } from "@/pages/CoinDetail/sections/TradingViewChartSection"

// ============================================================================
// EXAMPLE 1: Basic Usage
// ============================================================================
export function BasicBitcoinChart() {
  return (
    <TradingViewWidget 
      symbol="BINANCE:BTCUSDT"
      height={500}
    />
  )
}

// ============================================================================
// EXAMPLE 2: With Helper Function
// ============================================================================
export function DynamicCoinChart({ coinSymbol }: { coinSymbol: string }) {
  const symbol = formatTradingViewSymbol(coinSymbol, EXCHANGES.BINANCE, QUOTE_CURRENCIES.USDT)
  
  return (
    <TradingViewWidget 
      symbol={symbol}
      height={600}
      interval="60" // 1 hour
      theme="dark"
    />
  )
}

// ============================================================================
// EXAMPLE 3: Full Featured Chart Card
// ============================================================================
export function FullFeaturedChart({ coinSymbol, coinName }: { coinSymbol: string; coinName: string }) {
  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
      <div className="px-4 py-3 border-b border-gray-800">
        <h3 className="text-lg font-semibold text-white">{coinName} Advanced Chart</h3>
      </div>
      <TradingViewWidget 
        symbol={formatTradingViewSymbol(coinSymbol)}
        height={500}
        interval="D"
        theme="dark"
        showVolume={true}
        toolbar={true}
      />
    </div>
  )
}

// ============================================================================
// EXAMPLE 4: Multiple Coin Comparison Dashboard
// ============================================================================
export function CoinComparisonDashboard() {
  const coins = [
    { symbol: "BTC", name: "Bitcoin", exchange: EXCHANGES.BINANCE },
    { symbol: "ETH", name: "Ethereum", exchange: EXCHANGES.COINBASE },
    { symbol: "SOL", name: "Solana", exchange: EXCHANGES.BINANCE },
    { symbol: "ADA", name: "Cardano", exchange: EXCHANGES.BINANCE },
  ]
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      {coins.map(coin => (
        <div key={coin.symbol} className="bg-gray-900 rounded-lg p-4 border border-gray-800">
          <h4 className="text-white font-semibold mb-3">{coin.name}</h4>
          <TradingViewWidget 
            symbol={formatTradingViewSymbol(coin.symbol, coin.exchange)}
            height={300}
            interval="D"
            theme="dark"
            hideSideToolbar={true}
          />
        </div>
      ))}
    </div>
  )
}

// ============================================================================
// EXAMPLE 5: Using in CoinDetail Page
// ============================================================================
export function CoinDetailWithTradingView({ coinSymbol, coinName }: { coinSymbol: string; coinName: string }) {
  return (
    <div className="space-y-4">
      {/* Use the ready-made section component */}
      <TradingViewChartSection 
        coinSymbol={coinSymbol}
        coinName={coinName}
        height={600}
      />
    </div>
  )
}

// ============================================================================
// EXAMPLE 6: Custom Styled Chart
// ============================================================================
export function CustomStyledChart({ coinSymbol }: { coinSymbol: string }) {
  return (
    <TradingViewWidget 
      symbol={formatTradingViewSymbol(coinSymbol)}
      height={500}
      interval="D"
      theme="dark"
      showVolume={true}
      containerStyle={{
        border: "2px solid #3b82f6",
        borderRadius: "12px",
        boxShadow: "0 4px 6px rgba(59, 130, 246, 0.1)",
      }}
    />
  )
}

// ============================================================================
// EXAMPLE 7: Minimalist Chart (No Toolbars)
// ============================================================================
export function MinimalistChart({ coinSymbol }: { coinSymbol: string }) {
  return (
    <div className="bg-black rounded-lg overflow-hidden">
      <TradingViewWidget 
        symbol={formatTradingViewSymbol(coinSymbol)}
        height={400}
        interval="D"
        theme="dark"
        toolbar={false}
        hideSideToolbar={true}
        showVolume={false}
      />
    </div>
  )
}

// ============================================================================
// EXAMPLE 8: Chart with Different Exchanges
// ============================================================================
export function MultiExchangeChart({ coinSymbol }: { coinSymbol: string }) {
  const exchanges = [
    { name: "Binance", value: EXCHANGES.BINANCE },
    { name: "Coinbase", value: EXCHANGES.COINBASE },
    { name: "Kraken", value: EXCHANGES.KRAKEN },
  ]
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {exchanges.map(exchange => (
        <div key={exchange.value} className="bg-gray-900 rounded-lg p-3 border border-gray-800">
          <h4 className="text-white text-sm font-medium mb-2">{exchange.name}</h4>
          <TradingViewWidget 
            symbol={formatTradingViewSymbol(coinSymbol, exchange.value)}
            height={250}
            interval="60"
            theme="dark"
            hideSideToolbar={true}
            toolbar={false}
          />
        </div>
      ))}
    </div>
  )
}

// ============================================================================
// EXAMPLE 9: Hourly Intraday Chart
// ============================================================================
export function IntradayChart({ coinSymbol, coinName }: { coinSymbol: string; coinName: string }) {
  return (
    <div className="bg-[#0a0b0d] border border-gray-800 rounded-lg p-4">
      <div className="mb-3">
        <h3 className="text-white font-semibold">{coinName} Intraday</h3>
        <p className="text-gray-400 text-xs">15-minute intervals</p>
      </div>
      <TradingViewWidget 
        symbol={formatTradingViewSymbol(coinSymbol)}
        height={400}
        interval="15" // 15 minutes
        theme="dark"
        showVolume={true}
      />
    </div>
  )
}

// ============================================================================
// EXAMPLE 10: Auto-sizing Chart
// ============================================================================
export function AutoSizingChart({ coinSymbol }: { coinSymbol: string }) {
  return (
    <div style={{ width: "100%", height: "600px" }}>
      <TradingViewWidget 
        symbol={formatTradingViewSymbol(coinSymbol)}
        interval="D"
        theme="dark"
        autosize={true}
      />
    </div>
  )
}

// ============================================================================
// USAGE IN COINDETAIL PAGE
// ============================================================================
/*
To use in CoinDetailPage.tsx, add this import:

import { TradingViewChartSection } from "./sections/TradingViewChartSection"

Then add in the right column section:

<div className="lg:col-span-8 xl:col-span-9 space-y-4">
  {/* TradingView Chart - Option 1: Use the section component *\/}
  <TradingViewChartSection 
    coinSymbol={coinDetail.symbol}
    coinName={coinDetail.name}
    height={600}
  />
  
  {/* OR Option 2: Use the base component directly *\/}
  <div className="bg-[#0a0b0d] border border-gray-800 rounded-lg p-4">
    <h3 className="text-white font-semibold mb-4">{coinDetail.name} Chart</h3>
    <TradingViewWidget 
      symbol={formatTradingViewSymbol(coinDetail.symbol)}
      height={600}
      interval="D"
      theme="dark"
    />
  </div>
  
  {/* ... other sections ... *\/}
</div>
*/
