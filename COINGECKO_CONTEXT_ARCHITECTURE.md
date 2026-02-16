# CoinGecko Context Architecture

## File Structure

```
src/
├── contexts/
│   ├── CoinGeckoContext.tsx    # Main context provider and hooks
│   ├── index.ts                # Exports for clean imports
│   └── README.md               # Comprehensive usage guide
├── services/
│   ├── coingecko-api.ts        # API integration layer
│   └── index.ts
├── components/
│   └── PricesChartCard.tsx     # Updated to use context
└── App.tsx                     # Provider setup
```

## Architecture Overview

```
┌─────────────────────────────────────────┐
│           CoinGeckoProvider             │
│  (Global State Management)              │
│                                         │
│  • Auto-refresh market data (60s)      │
│  • Manage selected assets              │
│  • Fetch chart data on demand         │
│  • Memoized values & callbacks        │
└────────────┬────────────────────────────┘
             │
             ├──> useCoinGecko()         (All features)
             ├──> useMarketData()        (Market data only)
             ├──> useChartData()         (Chart data only)
             ├──> useAssetSelection()    (Selection only)
             ├──> useCoin(id)            (Single coin)
             └──> useCoinSearch(query)   (Search)
                  │
                  ▼
             ┌─────────────────┐
             │   Components    │
             │                 │
             │  • Dashboard    │
             │  • PricesChart  │
             │  • Future comps │
             └─────────────────┘
```

## Key Features

### 1. **Centralized State Management**
- Single source of truth for all crypto data
- Accessible from any component in the tree
- No prop drilling required

### 2. **Optimized Performance**
- `useMemo` for expensive computations
- `useCallback` for stable function references
- Automatic memoization of context value
- Prevents unnecessary re-renders

### 3. **Specialized Hooks**
- Different hooks for different needs
- Better component isolation
- Reduced re-render surface area

### 4. **Type Safety**
- Full TypeScript support
- Strongly typed API responses
- IntelliSense support throughout

### 5. **Auto-refresh**
- Configurable refresh interval
- Automatic background updates
- Can be disabled per instance

### 6. **Error Handling**
- Graceful error states
- Error messages accessible via context
- Doesn't crash the app

## Data Flow

```
User Action
    ↓
Component Hook (e.g., useCoinGecko)
    ↓
Context State Update
    ↓
useEffect Triggers
    ↓
API Call (coingecko-api.ts)
    ↓
Update Context State
    ↓
Connected Components Re-render
```

## Usage Patterns

### Pattern 1: Display Market Data
```tsx
const { marketData, isLoadingMarkets } = useMarketData()
```

### Pattern 2: Manage Selection
```tsx
const { selectedAssets, toggleAsset } = useAssetSelection()
```

### Pattern 3: Display Charts
```tsx
const { chartData, timeRange, setTimeRange } = useCoinGecko()
```

### Pattern 4: Search
```tsx
const results = useCoinSearch(searchQuery)
```

## Benefits

### For Developers
- ✅ Clean, maintainable code structure
- ✅ Easy to understand and extend
- ✅ Follows React best practices
- ✅ Type-safe development experience
- ✅ No external state management library needed

### For Users
- ✅ Fast, responsive UI
- ✅ Real-time data updates
- ✅ Consistent state across pages
- ✅ Smooth user experience
- ✅ Reliable error handling

## Extension Points

The context can be easily extended to support:

1. **Favorites/Watchlists**
   ```tsx
   const [favorites, setFavorites] = useState<string[]>([])
   ```

2. **Price Alerts**
   ```tsx
   const [alerts, setAlerts] = useState<PriceAlert[]>([])
   ```

3. **Custom Sorting**
   ```tsx
   const [sortBy, setSortBy] = useState<SortOption>("market_cap")
   ```

4. **Filters**
   ```tsx
   const [filters, setFilters] = useState<FilterOptions>({})
   ```

5. **User Preferences**
   ```tsx
   const [preferences, setPreferences] = useState<UserPrefs>({})
   ```

## Testing

The context can be easily tested:

```tsx
import { renderHook } from "@testing-library/react-hooks"
import { CoinGeckoProvider, useCoinGecko } from "./CoinGeckoContext"

test("provides market data", async () => {
  const wrapper = ({ children }) => (
    <CoinGeckoProvider>{children}</CoinGeckoProvider>
  )
  
  const { result, waitForNextUpdate } = renderHook(
    () => useCoinGecko(),
    { wrapper }
  )
  
  await waitForNextUpdate()
  
  expect(result.current.marketData).toBeDefined()
})
```

## Performance Considerations

### Memory
- Chart data is only loaded for selected assets
- Old chart data is cleared when assets are deselected
- No memory leaks from intervals (properly cleaned up)

### Network
- Market data: ~1 request per minute (configurable)
- Chart data: Only when selection or time range changes
- Batched requests for multiple coins

### Rendering
- Memoized context value prevents cascade re-renders
- Specialized hooks limit re-render scope
- Proper dependency arrays in useEffect

## Future Enhancements

Potential improvements:

1. **Local Storage Persistence**
   - Save selected assets
   - Remember user preferences
   - Cache recent data

2. **WebSocket Support**
   - Real-time price updates
   - Live order book data
   - Instant notifications

3. **Advanced Caching**
   - SWR (stale-while-revalidate)
   - Request deduplication
   - Cache invalidation strategies

4. **Error Boundaries**
   - Automatic error recovery
   - Fallback UI components
   - Error logging

5. **Analytics Integration**
   - Track user interactions
   - Performance monitoring
   - Usage statistics

## Conclusion

This implementation provides a solid, scalable foundation for managing cryptocurrency data throughout your application. It follows React best practices, is fully typed, and optimized for performance.
