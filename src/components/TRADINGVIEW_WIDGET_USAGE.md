# TradingView Chart Widget - Usage Guide

This guide explains how to use the reusable TradingView chart widget component in your application.

## Overview

The `TradingViewWidget` component provides a professional-grade charting solution for cryptocurrency trading data. It embeds TradingView's advanced chart widget, supporting multiple exchanges, timeframes, and customization options.

## Components

### 1. `TradingViewWidget` (Base Component)

The core reusable component that renders the TradingView chart.

### 2. `TradingViewChartSection` (Section Component)

A ready-to-use section component with built-in controls for exchange, quote currency, and timeframe selection.

## Quick Start

### Basic Usage

```tsx
import { TradingViewWidget } from "@/components"

function MyComponent() {
  return (
    <TradingViewWidget 
      symbol="BINANCE:BTCUSDT"
      height={500}
    />
  )
}
```

### With Helper Function

```tsx
import { TradingViewWidget, formatTradingViewSymbol } from "@/components"

function CoinChart({ coinSymbol }: { coinSymbol: string }) {
  const symbol = formatTradingViewSymbol(coinSymbol) // Defaults to BINANCE:XXXUSDT
  
  return (
    <TradingViewWidget 
      symbol={symbol}
      height={600}
      interval="60" // 1 hour
    />
  )
}
```

### In CoinDetail Page

```tsx
import { TradingViewChartSection } from "./sections/TradingViewChartSection"

export function CoinDetailPage({ coinId }: CoinDetailPageProps) {
  const { data: coinDetail } = useCoinDetail(coinId)
  
  return (
    <div>
      {/* Other sections */}
      
      <TradingViewChartSection 
        coinSymbol={coinDetail.symbol}
        coinName={coinDetail.name}
        height={600}
      />
    </div>
  )
}
```

## Configuration Options

### TradingViewWidgetProps

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `symbol` | `string` | **Required** | Trading symbol (e.g., "BINANCE:BTCUSDT") |
| `interval` | `string` | `"D"` | Timeframe: "1", "3", "5", "15", "30", "60", "120", "240", "D", "W", "M" |
| `theme` | `"light" \| "dark"` | `"dark"` | Chart theme |
| `width` | `string \| number` | `"100%"` | Chart width |
| `height` | `string \| number` | `500` | Chart height |
| `toolbar` | `boolean` | `true` | Show/hide toolbar |
| `showVolume` | `boolean` | `true` | Show/hide volume |
| `allowSymbolChange` | `boolean` | `false` | Allow users to change symbol |
| `hideSideToolbar` | `boolean` | `false` | Hide the side toolbar |
| `style` | `"0" \| "1" \| "2"...` | `"1"` | Chart style (0=bars, 1=candles, 2=line, etc.) |
| `studies` | `string[]` | `[]` | Technical indicators to load |
| `autosize` | `boolean` | `false` | Auto-resize to container |
| `containerStyle` | `CSSProperties` | `{}` | Container styling |

## Examples

### Example 1: Simple Bitcoin Chart

```tsx
<TradingViewWidget 
  symbol="BINANCE:BTCUSDT"
  height={400}
/>
```

### Example 2: Ethereum with Hourly Timeframe

```tsx
<TradingViewWidget 
  symbol="COINBASE:ETHUSD"
  interval="60"
  height={500}
  theme="dark"
/>
```

### Example 3: With Custom Styling

```tsx
<TradingViewWidget 
  symbol="BINANCE:SOLUSDT"
  interval="D"
  height={600}
  showVolume={true}
  containerStyle={{
    border: "1px solid #374151",
    borderRadius: "8px",
  }}
/>
```

### Example 4: Dynamic Symbol from Props

```tsx
import { TradingViewWidget, formatTradingViewSymbol, EXCHANGES } from "@/components"

interface CryptoChartProps {
  coinSymbol: string
  exchange?: string
  quoteCurrency?: string
}

function CryptoChart({ 
  coinSymbol, 
  exchange = EXCHANGES.BINANCE,
  quoteCurrency = "USDT" 
}: CryptoChartProps) {
  const symbol = formatTradingViewSymbol(coinSymbol, exchange, quoteCurrency)
  
  return (
    <div className="p-4 bg-gray-900 rounded-lg">
      <h3 className="text-white mb-4">{coinSymbol.toUpperCase()} Chart</h3>
      <TradingViewWidget 
        symbol={symbol}
        height={500}
        interval="D"
      />
    </div>
  )
}
```

### Example 5: Using the Section Component

```tsx
import { TradingViewChartSection } from "@/pages/CoinDetail/sections/TradingViewChartSection"

function CoinPage() {
  return (
    <div className="space-y-4">
      <TradingViewChartSection 
        coinSymbol="BTC"
        coinName="Bitcoin"
        height={600}
      />
    </div>
  )
}
```

### Example 6: Multiple Charts in Dashboard

```tsx
import { TradingViewWidget, formatTradingViewSymbol } from "@/components"

function TradingDashboard() {
  const coins = [
    { symbol: "BTC", name: "Bitcoin" },
    { symbol: "ETH", name: "Ethereum" },
    { symbol: "SOL", name: "Solana" },
  ]
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {coins.map(coin => (
        <div key={coin.symbol} className="bg-gray-900 rounded-lg p-4">
          <h3 className="text-white mb-2">{coin.name}</h3>
          <TradingViewWidget 
            symbol={formatTradingViewSymbol(coin.symbol)}
            height={300}
            interval="D"
            hideSideToolbar={true}
          />
        </div>
      ))}
    </div>
  )
}
```

## Helper Functions

### `formatTradingViewSymbol()`

Converts coin symbol to TradingView format.

```tsx
import { formatTradingViewSymbol, EXCHANGES, QUOTE_CURRENCIES } from "@/components"

// Basic usage
const symbol1 = formatTradingViewSymbol("BTC")
// Result: "BINANCE:BTCUSDT"

// Custom exchange
const symbol2 = formatTradingViewSymbol("ETH", EXCHANGES.COINBASE)
// Result: "COINBASE:ETHUSDT"

// Custom exchange and quote
const symbol3 = formatTradingViewSymbol("BTC", EXCHANGES.KRAKEN, QUOTE_CURRENCIES.USD)
// Result: "KRAKEN:BTCUSD"
```

## Constants

### Available Exchanges

```tsx
import { EXCHANGES } from "@/components"

EXCHANGES.BINANCE    // "BINANCE"
EXCHANGES.COINBASE   // "COINBASE"
EXCHANGES.KRAKEN     // "KRAKEN"
EXCHANGES.BITSTAMP   // "BITSTAMP"
EXCHANGES.BITFINEX   // "BITFINEX"
EXCHANGES.GEMINI     // "GEMINI"
EXCHANGES.KUCOIN     // "KUCOIN"
EXCHANGES.HUOBI      // "HUOBI"
EXCHANGES.OKX        // "OKX"
EXCHANGES.BYBIT      // "BYBIT"
```

### Available Quote Currencies

```tsx
import { QUOTE_CURRENCIES } from "@/components"

QUOTE_CURRENCIES.USDT  // "USDT"
QUOTE_CURRENCIES.USD   // "USD"
QUOTE_CURRENCIES.BTC   // "BTC"
QUOTE_CURRENCIES.ETH   // "ETH"
QUOTE_CURRENCIES.EUR   // "EUR"
QUOTE_CURRENCIES.GBP   // "GBP"
```

## Advanced Usage

### With Technical Indicators

```tsx
<TradingViewWidget 
  symbol="BINANCE:BTCUSDT"
  height={600}
  studies={[
    "STD;SMA",           // Simple Moving Average
    "STD;EMA",           // Exponential Moving Average
    "STD;MACD",          // MACD
    "STD;RSI",           // RSI
  ]}
/>
```

### Auto-sizing to Container

```tsx
<div style={{ width: "100%", height: "600px" }}>
  <TradingViewWidget 
    symbol="BINANCE:BTCUSDT"
    autosize={true}
  />
</div>
```

### Chart Styles

```tsx
// Candlesticks (default)
<TradingViewWidget symbol="BINANCE:BTCUSDT" style="1" />

// Bars
<TradingViewWidget symbol="BINANCE:BTCUSDT" style="0" />

// Line
<TradingViewWidget symbol="BINANCE:BTCUSDT" style="2" />

// Area
<TradingViewWidget symbol="BINANCE:BTCUSDT" style="3" />
```

## Integration in CoinDetail Page

To add TradingView chart to the CoinDetail page:

```tsx
// In CoinDetailPage.tsx
import { TradingViewChartSection } from "./sections/TradingViewChartSection"

export function CoinDetailPage({ coinId }: CoinDetailPageProps) {
  const { data: coinDetail } = useCoinDetail(coinId)
  
  return (
    <div className="h-full overflow-y-auto bg-[#060709]">
      <div className="max-w-[1800px] mx-auto px-4 py-4">
        {/* ... other sections ... */}
        
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-8 xl:col-span-9 space-y-4">
            {/* Add TradingView Chart */}
            <TradingViewChartSection 
              coinSymbol={coinDetail.symbol}
              coinName={coinDetail.name}
              height={600}
            />
            
            {/* ... other sections ... */}
          </div>
        </div>
      </div>
    </div>
  )
}
```

## Benefits

1. **Professional Charts**: Industry-standard TradingView charts with advanced features
2. **Reusable**: Use anywhere with simple props
3. **Flexible**: Extensive customization options
4. **Type-Safe**: Full TypeScript support
5. **Easy Integration**: Drop-in replacement for existing charts
6. **No API Key Required**: TradingView widget is free to use
7. **Real-time Data**: Live market data from major exchanges

## Notes

- The TradingView widget loads from their CDN
- No installation of additional packages required
- Widget is free to use for non-commercial purposes
- For commercial use, check TradingView's licensing terms
- The component uses memo() for performance optimization
- Symbol format: `EXCHANGE:BASEQUOTE` (e.g., `BINANCE:BTCUSDT`)

## Troubleshooting

### Chart not appearing

1. Check that the symbol format is correct
2. Ensure the network can access TradingView's CDN
3. Verify the container has proper width/height

### Symbol not found

1. Verify the trading pair exists on the selected exchange
2. Use the correct symbol format
3. Try a different exchange using the `formatTradingViewSymbol()` helper

## Support

For more information about TradingView widgets:
- [TradingView Widget Documentation](https://www.tradingview.com/widget/)
- [TradingView Symbol Standards](https://www.tradingview.com/symbols/)
