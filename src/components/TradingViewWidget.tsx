import { useEffect, useRef, memo } from "react"

export interface TradingViewWidgetProps {
  /**
   * The trading symbol to display (e.g., "BINANCE:BTCUSDT", "COINBASE:BTCUSD")
   * Format: EXCHANGE:SYMBOL or just SYMBOL for auto-detection
   */
  symbol: string
  
  /**
   * The interval/timeframe for the chart
   * @default "D" (Daily)
   */
  interval?: "1" | "3" | "5" | "15" | "30" | "60" | "120" | "240" | "D" | "W" | "M"
  
  /**
   * Theme of the widget
   * @default "dark"
   */
  theme?: "light" | "dark"
  
  /**
   * Width of the container
   * @default "100%"
   */
  width?: string | number
  
  /**
   * Height of the container
   * @default 500
   */
  height?: string | number
  
  /**
   * Locale for the widget
   * @default "en"
   */
  locale?: string
  
  /**
   * Enable/disable the toolbar
   * @default true
   */
  toolbar?: boolean
  
  /**
   * Enable/disable timezone menu
   * @default false
   */
  timezoneMenu?: boolean
  
  /**
   * Enable/disable the ability to save chart
   * @default false
   */
  enablePublishing?: boolean
  
  /**
   * Hide side toolbar
   * @default false
   */
  hideSideToolbar?: boolean
  
  /**
   * Allow symbol change from the widget
   * @default false
   */
  allowSymbolChange?: boolean
  
  /**
   * Show volume by default
   * @default true
   */
  showVolume?: boolean
  
  /**
   * Container style (background, border, etc.)
   */
  containerStyle?: React.CSSProperties
  
  /**
   * Auto size to container
   * @default false
   */
  autosize?: boolean
  
  /**
   * Additional studies/indicators to load
   * Example: ["STD;SMA"]
   */
  studies?: string[]
  
  /**
   * Chart style: bars, candles, line, area, etc.
   * @default 1 (candles)
   */
  style?: "0" | "1" | "2" | "3" | "8" | "9"
}

/**
 * TradingView Advanced Chart Widget Component
 * 
 * A reusable component that embeds TradingView's professional charting widget.
 * Supports various cryptocurrencies and trading pairs from major exchanges.
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <TradingViewWidget symbol="BINANCE:BTCUSDT" />
 * 
 * // With custom configuration
 * <TradingViewWidget 
 *   symbol="COINBASE:ETHUSD"
 *   interval="60"
 *   height={600}
 *   theme="dark"
 *   showVolume={true}
 * />
 * 
 * // In CoinDetail page
 * <TradingViewWidget 
 *   symbol={`BINANCE:${coin.symbol.toUpperCase()}USDT`}
 *   height={500}
 *   allowSymbolChange={false}
 * />
 * ```
 */
export const TradingViewWidget = memo(function TradingViewWidget({
  symbol,
  interval = "D",
  theme = "dark",
  width = "100%",
  height = 500,
  locale = "en",
  toolbar = true,
  timezoneMenu = false,
  enablePublishing = false,
  hideSideToolbar = false,
  allowSymbolChange = false,
  showVolume = true,
  containerStyle = {},
  autosize = false,
  studies = [],
  style = "1", // 1 = candles
}: TradingViewWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const scriptRef = useRef<HTMLScriptElement | null>(null)

  useEffect(() => {
    // Clean up previous script if it exists
    if (scriptRef.current) {
      scriptRef.current.remove()
      scriptRef.current = null
    }

    // Clear container
    if (containerRef.current) {
      containerRef.current.innerHTML = ""
    }

    // Create TradingView widget script
    const script = document.createElement("script")
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js"
    script.async = true
    script.type = "text/javascript"
    
    script.onload = () => {
      if (containerRef.current && (window as any).TradingView) {
        new (window as any).TradingView.widget({
          container_id: containerRef.current.id,
          symbol,
          interval,
          timezone: "Etc/UTC",
          theme,
          style,
          locale,
          toolbar_bg: theme === "dark" ? "#0a0b0d" : "#f1f3f6",
          enable_publishing: enablePublishing,
          allow_symbol_change: allowSymbolChange,
          hide_side_toolbar: hideSideToolbar,
          withdateranges: toolbar,
          hide_volume: !showVolume,
          studies,
          ...(autosize ? { autosize: true } : { width, height }),
        })
      }
    }

    scriptRef.current = script
    document.head.appendChild(script)

    // Cleanup on unmount
    return () => {
      if (scriptRef.current) {
        scriptRef.current.remove()
        scriptRef.current = null
      }
    }
  }, [
    symbol,
    interval,
    theme,
    width,
    height,
    locale,
    toolbar,
    timezoneMenu,
    enablePublishing,
    hideSideToolbar,
    allowSymbolChange,
    showVolume,
    autosize,
    studies,
    style,
  ])

  // Generate unique container ID
  const containerId = `tradingview_${symbol.replace(/[^a-zA-Z0-9]/g, "_")}_${Date.now()}`

  return (
    <div
      className="tradingview-widget-container"
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
        ...containerStyle,
      }}
    >
      <div
        id={containerId}
        ref={containerRef}
        style={{
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  )
})

/**
 * Maps CoinGecko exchange names to TradingView exchange identifiers
 * @param exchangeName - Exchange name from CoinGecko (e.g., "binance", "coinbase pro")
 * @returns TradingView exchange identifier or default to BINANCE
 */
export function mapExchangeToTradingView(exchangeName: string): string {
  const name = exchangeName.toLowerCase().trim()
  
  // Common exchange mappings
  const exchangeMap: Record<string, string> = {
    "binance": "BINANCE",
    "coinbase": "COINBASE",
    "coinbase pro": "COINBASE",
    "coinbase exchange": "COINBASE",
    "kraken": "KRAKEN",
    "bitstamp": "BITSTAMP",
    "bitfinex": "BITFINEX",
    "gemini": "GEMINI",
    "kucoin": "KUCOIN",
    "huobi": "HUOBI",
    "okx": "OKX",
    "okex": "OKX",
    "bybit": "BYBIT",
    "bittrex": "BITTREX",
    "poloniex": "POLONIEX",
    "gate.io": "GATEIO",
    "crypto.com": "CRYPTOCOM",
  }
  
  return exchangeMap[name] || "BINANCE"
}

/**
 * Helper function to format coin symbol for TradingView
 * Converts CoinGecko coin data to TradingView symbol format
 * 
 * @param coinSymbol - The coin symbol (e.g., "BTC", "ETH")
 * @param exchange - The exchange to use (default: "BINANCE")
 * @param quoteCurrency - The quote currency (default: "USDT")
 * @returns Formatted TradingView symbol (e.g., "BINANCE:BTCUSDT")
 * 
 * @example
 * ```tsx
 * const symbol = formatTradingViewSymbol("BTC") // "BINANCE:BTCUSDT"
 * const symbol = formatTradingViewSymbol("ETH", "COINBASE", "USD") // "COINBASE:ETHUSD"
 * ```
 */
export function formatTradingViewSymbol(
  coinSymbol: string,
  exchange: string = "BINANCE",
  quoteCurrency: string = "USDT"
): string {
  const symbol = coinSymbol.toUpperCase()
  const quote = quoteCurrency.toUpperCase()
  return `${exchange.toUpperCase()}:${symbol}${quote}`
}

/**
 * Common exchange options for TradingView
 */
export const EXCHANGES = {
  BINANCE: "BINANCE",
  COINBASE: "COINBASE",
  KRAKEN: "KRAKEN",
  BITSTAMP: "BITSTAMP",
  BITFINEX: "BITFINEX",
  GEMINI: "GEMINI",
  KUCOIN: "KUCOIN",
  HUOBI: "HUOBI",
  OKX: "OKX",
  BYBIT: "BYBIT",
} as const

/**
 * Common quote currencies
 */
export const QUOTE_CURRENCIES = {
  USDT: "USDT",
  USD: "USD",
  BTC: "BTC",
  ETH: "ETH",
  EUR: "EUR",
  GBP: "GBP",
} as const
