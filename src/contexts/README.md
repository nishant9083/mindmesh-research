# CoinGecko Context Usage Guide

## Overview

The `CoinGeckoContext` provides a centralized state management solution for cryptocurrency data throughout your application. It leverages React Context API with optimized hooks for efficient data sharing and updates.

## Features

✅ **Global Market Data** - Access to top 100 cryptocurrencies by market cap  
✅ **Historical Chart Data** - Price, volume, and market cap data for multiple time ranges  
✅ **Asset Selection Management** - Centralized state for selected cryptocurrencies  
✅ **Auto-refresh** - Configurable automatic data updates  
✅ **Memoization** - Optimized performance with useMemo and useCallback  
✅ **Custom Hooks** - Specialized hooks for different use cases  
✅ **Type Safety** - Full TypeScript support

## Setup

### 1. Wrap your app with the provider

```tsx
import { CoinGeckoProvider } from "@/contexts"

function App() {
  return (
    <CoinGeckoProvider
      initialSelectedAssets={["ethereum", "bitcoin"]}
      initialTimeRange="7D"
      autoRefreshInterval={60000} // 60 seconds
    >
      <YourApp />
    </CoinGeckoProvider>
  )
}
```

### 2. Provider Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | ReactNode | required | Your app components |
| `autoRefreshInterval` | number | 60000 | Auto-refresh interval in ms (0 to disable) |
| `initialTimeRange` | TimeRange | "7D" | Initial time range for charts |
| `initialSelectedAssets` | string[] | [] | Initial selected coin IDs |

## Usage Examples

### Basic Hook - useCoinGecko()

Access all context data and functions:

```tsx
import { useCoinGecko } from "@/contexts"

function MyComponent() {
  const {
    marketData,           // All market data
    isLoadingMarkets,     // Loading state
    marketError,          // Error state
    selectedAssets,       // Currently selected assets
    toggleAsset,          // Toggle asset selection
    timeRange,            // Current time range
    setTimeRange,         // Update time range
  } = useCoinGecko()

  return (
    <div>
      {marketData.map(coin => (
        <div key={coin.id} onClick={() => toggleAsset(coin.id)}>
          {coin.name}: ${coin.current_price}
        </div>
      ))}
    </div>
  )
}
```

### Specialized Hook - useMarketData()

For components that only need market data:

```tsx
import { useMarketData } from "@/contexts"

function CryptoList() {
  const { marketData, isLoadingMarkets, refreshMarketData } = useMarketData()

  if (isLoadingMarkets) return <Spinner />

  return (
    <div>
      <button onClick={refreshMarketData}>Refresh</button>
      {marketData.map(coin => (
        <CoinCard key={coin.id} coin={coin} />
      ))}
    </div>
  )
}
```

### Chart Data Hook - useChartData()

For components working with historical data:

```tsx
import { useChartData } from "@/contexts"

function PriceChart() {
  const { chartData, isLoadingCharts } = useChartData()

  if (isLoadingCharts) return <Loading />

  return <Chart data={chartData} />
}
```

### Asset Selection Hook - useAssetSelection()

For managing selected cryptocurrencies:

```tsx
import { useAssetSelection } from "@/contexts"

function AssetSelector() {
  const { selectedAssets, toggleAsset, clearAssets } = useAssetSelection()

  return (
    <div>
      <button onClick={clearAssets}>Clear All</button>
      <div>Selected: {selectedAssets.join(", ")}</div>
    </div>
  )
}
```

### Single Coin Hook - useCoin()

Get data for a specific cryptocurrency:

```tsx
import { useCoin } from "@/contexts"

function CoinDetail({ coinId }: { coinId: string }) {
  const coin = useCoin(coinId)

  if (!coin) return <NotFound />

  return (
    <div>
      <h1>{coin.name}</h1>
      <p>Price: ${coin.current_price}</p>
      <p>Market Cap: ${coin.market_cap}</p>
    </div>
  )
}
```

### Search Hook - useCoinSearch()

Search through available cryptocurrencies:

```tsx
import { useCoinSearch } from "@/contexts"
import { useState } from "react"

function CoinSearchBar() {
  const [query, setQuery] = useState("")
  const results = useCoinSearch(query)

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search coins..."
      />
      {results.map(coin => (
        <div key={coin.id}>{coin.name} ({coin.symbol})</div>
      ))}
    </div>
  )
}
```

## Context API Reference

### State

```typescript
{
  // Market Data
  marketData: CoinMarketData[]
  isLoadingMarkets: boolean
  marketError: string | null
  
  // Chart Data
  chartData: Record<string, CoinHistoricalData>
  isLoadingCharts: boolean
  chartError: string | null
  
  // Selection
  selectedAssets: string[]
  timeRange: TimeRange
}
```

### Actions

```typescript
{
  // Asset Management
  setSelectedAssets: (assets: string[]) => void
  toggleAsset: (coinId: string) => void
  clearAssets: () => void
  
  // Time Range
  setTimeRange: (range: TimeRange) => void
  
  // Data Fetching
  refreshMarketData: () => Promise<void>
  fetchChartDataForAssets: (coinIds: string[], days?: string | number) => Promise<void>
  
  // Utilities
  getCoinById: (coinId: string) => CoinMarketData | undefined
  searchCoins: (query: string) => CoinMarketData[]
}
```

### Time Ranges

```typescript
type TimeRange = "1D" | "7D" | "30D" | "90D" | "1Y" | "Max"
```

## Best Practices

### 1. Use Specialized Hooks

Instead of using `useCoinGecko()` everywhere, use the specialized hooks for better component isolation:

```tsx
// ❌ Not optimal
const { marketData } = useCoinGecko()

// ✅ Better
const { marketData } = useMarketData()
```

### 2. Avoid Unnecessary Re-renders

The context is memoized, but you should still destructure only what you need:

```tsx
// ❌ Component re-renders on any context change
const context = useCoinGecko()

// ✅ Component only re-renders when marketData changes
const { marketData } = useCoinGecko()
```

### 3. Handle Loading States

Always check loading states before rendering data:

```tsx
const { marketData, isLoadingMarkets } = useMarketData()

if (isLoadingMarkets) {
  return <LoadingSpinner />
}

return <DataView data={marketData} />
```

### 4. Error Handling

Handle errors gracefully:

```tsx
const { marketData, marketError } = useMarketData()

if (marketError) {
  return <ErrorMessage message={marketError} />
}
```

### 5. Search Optimization

Debounce search queries to avoid excessive re-renders:

```tsx
import { useMemo } from "react"
import { useCoinGecko } from "@/contexts"
import { debounce } from "lodash"

function SearchComponent() {
  const [query, setQuery] = useState("")
  const { searchCoins } = useCoinGecko()
  
  const debouncedSearch = useMemo(
    () => debounce(setQuery, 300),
    []
  )
  
  const results = searchCoins(query)
  
  return <SearchResults results={results} />
}
```

## Advanced Use Cases

### Multi-page Application

The context persists across page navigation:

```tsx
// Page 1: Select assets
function MarketPage() {
  const { toggleAsset } = useAssetSelection()
  return <AssetSelector onSelect={toggleAsset} />
}

// Page 2: View selected assets
function PortfolioPage() {
  const { selectedAssets } = useAssetSelection()
  const { chartData } = useChartData()
  return <Portfolio assets={selectedAssets} data={chartData} />
}
```

### Custom Data Refresh

Manually trigger data refresh:

```tsx
function RefreshButton() {
  const { refreshMarketData } = useCoinGecko()
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refreshMarketData()
    setIsRefreshing(false)
  }
  
  return (
    <button onClick={handleRefresh} disabled={isRefreshing}>
      {isRefreshing ? "Refreshing..." : "Refresh Data"}
    </button>
  )
}
```

### Dynamic Chart Data

Fetch chart data for specific time periods:

```tsx
function CustomChart() {
  const { fetchChartDataForAssets } = useCoinGecko()
  
  const loadCustomRange = async () => {
    await fetchChartDataForAssets(["bitcoin", "ethereum"], 365) // 1 year
  }
  
  return <button onClick={loadCustomRange}>Load Year Data</button>
}
```

## Performance Tips

1. **Memoization**: The context automatically memoizes all values and functions
2. **Auto-refresh**: Disable if not needed by setting `autoRefreshInterval={0}`
3. **Selective Rendering**: Use specialized hooks to minimize re-renders
4. **Lazy Loading**: Chart data is only fetched when assets are selected

## TypeScript Support

All hooks and context values are fully typed:

```typescript
import { CoinMarketData, CoinHistoricalData, TimeRange } from "@/contexts"

const coin: CoinMarketData = useCoin("bitcoin")!
const range: TimeRange = "7D"
```

## Troubleshooting

### "useCoinGecko must be used within a CoinGeckoProvider"

Make sure your component is wrapped with `<CoinGeckoProvider>`:

```tsx
// App.tsx
<CoinGeckoProvider>
  <YourComponent /> ✅
</CoinGeckoProvider>

// Outside provider
<YourComponent /> ❌
```

### Data not updating

Check that auto-refresh is enabled and the interval is set correctly:

```tsx
<CoinGeckoProvider autoRefreshInterval={60000}>
```

### Chart data not loading

Ensure assets are selected before expecting chart data:

```tsx
const { selectedAssets, chartData } = useCoinGecko()
console.log(selectedAssets) // Should not be empty
console.log(chartData) // Should have data for selected assets
```

## Migration Guide

If you have existing components with local state, migrate to the context:

### Before:
```tsx
function MyComponent() {
  const [data, setData] = useState([])
  
  useEffect(() => {
    fetchData().then(setData)
  }, [])
  
  return <View data={data} />
}
```

### After:
```tsx
function MyComponent() {
  const { marketData } = useMarketData()
  
  return <View data={marketData} />
}
```

## Conclusion

The CoinGecko Context provides a powerful, optimized way to manage cryptocurrency data throughout your application. Use the specialized hooks for specific use cases, and follow the best practices for optimal performance.
