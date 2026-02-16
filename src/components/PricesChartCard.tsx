import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useRef, useEffect } from "react"
import { ChevronDown, Search, TrendingUp, Eye, Layers, Globe, X, Plus } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

// Raw OHLCV data structure from API
interface OHLCVData {
  UNIT: string
  TIMESTAMP: number
  TYPE: string
  MARKET: string
  INSTRUMENT: string
  OPEN: number
  HIGH: number
  LOW: number
  CLOSE: number
  VOLUME: number
  QUOTE_VOLUME: number
}

// Sample historical data for different assets
const historicalData: Record<string, OHLCVData[]> = {
  BTC: [
    { UNIT: "DAY", TIMESTAMP: 1739145600, TYPE: "267", MARKET: "cadli", INSTRUMENT: "BTC-USD", OPEN: 69500, HIGH: 70200, LOW: 69100, CLOSE: 69767.25, VOLUME: 103172, QUOTE_VOLUME: 9799888685 },
    { UNIT: "DAY", TIMESTAMP: 1739232000, TYPE: "267", MARKET: "cadli", INSTRUMENT: "BTC-USD", OPEN: 69767, HIGH: 70500, LOW: 69200, CLOSE: 69850.50, VOLUME: 98500, QUOTE_VOLUME: 9500000000 },
    { UNIT: "DAY", TIMESTAMP: 1739318400, TYPE: "267", MARKET: "cadli", INSTRUMENT: "BTC-USD", OPEN: 69850, HIGH: 70800, LOW: 69400, CLOSE: 70100.75, VOLUME: 105000, QUOTE_VOLUME: 10200000000 },
    { UNIT: "DAY", TIMESTAMP: 1739404800, TYPE: "267", MARKET: "cadli", INSTRUMENT: "BTC-USD", OPEN: 70100, HIGH: 71200, LOW: 69800, CLOSE: 70450.30, VOLUME: 112000, QUOTE_VOLUME: 10800000000 },
    { UNIT: "DAY", TIMESTAMP: 1739491200, TYPE: "267", MARKET: "cadli", INSTRUMENT: "BTC-USD", OPEN: 70450, HIGH: 70900, LOW: 69500, CLOSE: 69600.80, VOLUME: 95000, QUOTE_VOLUME: 9200000000 },
    { UNIT: "DAY", TIMESTAMP: 1739577600, TYPE: "267", MARKET: "cadli", INSTRUMENT: "BTC-USD", OPEN: 69600, HIGH: 70100, LOW: 69000, CLOSE: 69310.96, VOLUME: 88000, QUOTE_VOLUME: 8500000000 },
    { UNIT: "DAY", TIMESTAMP: 1739664000, TYPE: "267", MARKET: "cadli", INSTRUMENT: "BTC-USD", OPEN: 69310, HIGH: 69800, LOW: 68900, CLOSE: 69767.25, VOLUME: 92000, QUOTE_VOLUME: 8900000000 },
  ],
  ETH: [
    { UNIT: "DAY", TIMESTAMP: 1739145600, TYPE: "267", MARKET: "cadli", INSTRUMENT: "ETH-USD", OPEN: 2100, HIGH: 2150, LOW: 2080, CLOSE: 2120.50, VOLUME: 503172, QUOTE_VOLUME: 1799888685 },
    { UNIT: "DAY", TIMESTAMP: 1739232000, TYPE: "267", MARKET: "cadli", INSTRUMENT: "ETH-USD", OPEN: 2120, HIGH: 2180, LOW: 2100, CLOSE: 2150.30, VOLUME: 520000, QUOTE_VOLUME: 1850000000 },
    { UNIT: "DAY", TIMESTAMP: 1739318400, TYPE: "267", MARKET: "cadli", INSTRUMENT: "ETH-USD", OPEN: 2150, HIGH: 2200, LOW: 2120, CLOSE: 2080.75, VOLUME: 480000, QUOTE_VOLUME: 1720000000 },
    { UNIT: "DAY", TIMESTAMP: 1739404800, TYPE: "267", MARKET: "cadli", INSTRUMENT: "ETH-USD", OPEN: 2080, HIGH: 2120, LOW: 2000, CLOSE: 2020.40, VOLUME: 550000, QUOTE_VOLUME: 1950000000 },
    { UNIT: "DAY", TIMESTAMP: 1739491200, TYPE: "267", MARKET: "cadli", INSTRUMENT: "ETH-USD", OPEN: 2020, HIGH: 2080, LOW: 1980, CLOSE: 2050.60, VOLUME: 510000, QUOTE_VOLUME: 1800000000 },
    { UNIT: "DAY", TIMESTAMP: 1739577600, TYPE: "267", MARKET: "cadli", INSTRUMENT: "ETH-USD", OPEN: 2050, HIGH: 2100, LOW: 1950, CLOSE: 1991.38, VOLUME: 530000, QUOTE_VOLUME: 1880000000 },
    { UNIT: "DAY", TIMESTAMP: 1739664000, TYPE: "267", MARKET: "cadli", INSTRUMENT: "ETH-USD", OPEN: 1991, HIGH: 2050, LOW: 1970, CLOSE: 2005.18, VOLUME: 495000, QUOTE_VOLUME: 1760000000 },
  ],
  USDT: [
    { UNIT: "DAY", TIMESTAMP: 1739145600, TYPE: "267", MARKET: "cadli", INSTRUMENT: "USDT-USD", OPEN: 1.0001, HIGH: 1.0003, LOW: 0.9998, CLOSE: 1.0002, VOLUME: 50000000, QUOTE_VOLUME: 50000000 },
    { UNIT: "DAY", TIMESTAMP: 1739232000, TYPE: "267", MARKET: "cadli", INSTRUMENT: "USDT-USD", OPEN: 1.0002, HIGH: 1.0004, LOW: 0.9999, CLOSE: 1.0001, VOLUME: 52000000, QUOTE_VOLUME: 52000000 },
    { UNIT: "DAY", TIMESTAMP: 1739318400, TYPE: "267", MARKET: "cadli", INSTRUMENT: "USDT-USD", OPEN: 1.0001, HIGH: 1.0003, LOW: 0.9997, CLOSE: 0.9999, VOLUME: 48000000, QUOTE_VOLUME: 48000000 },
    { UNIT: "DAY", TIMESTAMP: 1739404800, TYPE: "267", MARKET: "cadli", INSTRUMENT: "USDT-USD", OPEN: 0.9999, HIGH: 1.0002, LOW: 0.9996, CLOSE: 1.0000, VOLUME: 55000000, QUOTE_VOLUME: 55000000 },
    { UNIT: "DAY", TIMESTAMP: 1739491200, TYPE: "267", MARKET: "cadli", INSTRUMENT: "USDT-USD", OPEN: 1.0000, HIGH: 1.0003, LOW: 0.9998, CLOSE: 1.0001, VOLUME: 51000000, QUOTE_VOLUME: 51000000 },
    { UNIT: "DAY", TIMESTAMP: 1739577600, TYPE: "267", MARKET: "cadli", INSTRUMENT: "USDT-USD", OPEN: 1.0001, HIGH: 1.0002, LOW: 0.9997, CLOSE: 1.0000, VOLUME: 53000000, QUOTE_VOLUME: 53000000 },
    { UNIT: "DAY", TIMESTAMP: 1739664000, TYPE: "267", MARKET: "cadli", INSTRUMENT: "USDT-USD", OPEN: 1.0000, HIGH: 1.0002, LOW: 0.9998, CLOSE: 1.0000, VOLUME: 49000000, QUOTE_VOLUME: 49000000 },
  ],
  XRP: [
    { UNIT: "DAY", TIMESTAMP: 1739145600, TYPE: "267", MARKET: "cadli", INSTRUMENT: "XRP-USD", OPEN: 1.42, HIGH: 1.48, LOW: 1.40, CLOSE: 1.45, VOLUME: 2000000, QUOTE_VOLUME: 2900000 },
    { UNIT: "DAY", TIMESTAMP: 1739232000, TYPE: "267", MARKET: "cadli", INSTRUMENT: "XRP-USD", OPEN: 1.45, HIGH: 1.52, LOW: 1.43, CLOSE: 1.48, VOLUME: 2200000, QUOTE_VOLUME: 3256000 },
    { UNIT: "DAY", TIMESTAMP: 1739318400, TYPE: "267", MARKET: "cadli", INSTRUMENT: "XRP-USD", OPEN: 1.48, HIGH: 1.55, LOW: 1.46, CLOSE: 1.52, VOLUME: 2500000, QUOTE_VOLUME: 3800000 },
    { UNIT: "DAY", TIMESTAMP: 1739404800, TYPE: "267", MARKET: "cadli", INSTRUMENT: "XRP-USD", OPEN: 1.52, HIGH: 1.58, LOW: 1.49, CLOSE: 1.55, VOLUME: 2800000, QUOTE_VOLUME: 4340000 },
    { UNIT: "DAY", TIMESTAMP: 1739491200, TYPE: "267", MARKET: "cadli", INSTRUMENT: "XRP-USD", OPEN: 1.55, HIGH: 1.56, LOW: 1.48, CLOSE: 1.50, VOLUME: 2100000, QUOTE_VOLUME: 3150000 },
    { UNIT: "DAY", TIMESTAMP: 1739577600, TYPE: "267", MARKET: "cadli", INSTRUMENT: "XRP-USD", OPEN: 1.50, HIGH: 1.53, LOW: 1.47, CLOSE: 1.50, VOLUME: 1900000, QUOTE_VOLUME: 2850000 },
    { UNIT: "DAY", TIMESTAMP: 1739664000, TYPE: "267", MARKET: "cadli", INSTRUMENT: "XRP-USD", OPEN: 1.50, HIGH: 1.54, LOW: 1.48, CLOSE: 1.50, VOLUME: 2000000, QUOTE_VOLUME: 3000000 },
  ],
  BNB: [
    { UNIT: "DAY", TIMESTAMP: 1739145600, TYPE: "267", MARKET: "cadli", INSTRUMENT: "BNB-USD", OPEN: 640, HIGH: 655, LOW: 635, CLOSE: 648, VOLUME: 150000, QUOTE_VOLUME: 97200000 },
    { UNIT: "DAY", TIMESTAMP: 1739232000, TYPE: "267", MARKET: "cadli", INSTRUMENT: "BNB-USD", OPEN: 648, HIGH: 660, LOW: 642, CLOSE: 652, VOLUME: 160000, QUOTE_VOLUME: 104320000 },
    { UNIT: "DAY", TIMESTAMP: 1739318400, TYPE: "267", MARKET: "cadli", INSTRUMENT: "BNB-USD", OPEN: 652, HIGH: 665, LOW: 648, CLOSE: 638, VOLUME: 145000, QUOTE_VOLUME: 92510000 },
    { UNIT: "DAY", TIMESTAMP: 1739404800, TYPE: "267", MARKET: "cadli", INSTRUMENT: "BNB-USD", OPEN: 638, HIGH: 645, LOW: 625, CLOSE: 630, VOLUME: 170000, QUOTE_VOLUME: 107100000 },
    { UNIT: "DAY", TIMESTAMP: 1739491200, TYPE: "267", MARKET: "cadli", INSTRUMENT: "BNB-USD", OPEN: 630, HIGH: 642, LOW: 622, CLOSE: 635, VOLUME: 155000, QUOTE_VOLUME: 98425000 },
    { UNIT: "DAY", TIMESTAMP: 1739577600, TYPE: "267", MARKET: "cadli", INSTRUMENT: "BNB-USD", OPEN: 635, HIGH: 640, LOW: 620, CLOSE: 628.66, VOLUME: 140000, QUOTE_VOLUME: 88012400 },
    { UNIT: "DAY", TIMESTAMP: 1739664000, TYPE: "267", MARKET: "cadli", INSTRUMENT: "BNB-USD", OPEN: 628, HIGH: 638, LOW: 625, CLOSE: 628.66, VOLUME: 148000, QUOTE_VOLUME: 93041680 },
  ],
}

// Crypto metadata with colors
const cryptoMeta: Record<string, { name: string; color: string }> = {
  BTC: { name: "Bitcoin", color: "#f7931a" },
  ETH: { name: "Ethereum", color: "#627eea" },
  USDT: { name: "Tether", color: "#26a17b" },
  XRP: { name: "XRP", color: "#00aae4" },
  BNB: { name: "BNB", color: "#f3ba2f" },
  USDC: { name: "USDC", color: "#2775ca" },
  SOL: { name: "Solana", color: "#9945ff" },
  TRX: { name: "TRON", color: "#ff0013" },
  DOGE: { name: "Dogecoin", color: "#c3a634" },
  BCH: { name: "Bitcoin Cash", color: "#8dc351" },
  WBT: { name: "WhiteBIT", color: "#0052ff" },
}

// Generate table data from latest OHLCV data
const generateTableData = () => {
  const symbols = ["BTC", "ETH", "USDT", "XRP", "BNB", "USDC", "SOL", "TRX", "DOGE", "BCH", "WBT"]
  return symbols.map((symbol, index) => {
    const data = historicalData[symbol]
    const latest = data ? data[data.length - 1] : null
    const previous = data ? data[data.length - 2] : null
    
    let price = "$0.00"
    let change = "0.00%"
    let positive = true
    let mcap = "$0"
    
    if (latest) {
      price = latest.CLOSE >= 1000 ? `$${latest.CLOSE.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 
              latest.CLOSE >= 1 ? `$${latest.CLOSE.toFixed(2)}` : `$${latest.CLOSE.toFixed(3)}`
      
      if (previous) {
        const changePercent = ((latest.CLOSE - previous.CLOSE) / previous.CLOSE) * 100
        positive = changePercent >= 0
        change = `${positive ? "+" : ""}${changePercent.toFixed(2)}%`
      }
      
      // Mock market cap based on volume
      const mcapValue = latest.QUOTE_VOLUME * 0.14
      if (mcapValue >= 1e12) mcap = `$${(mcapValue / 1e12).toFixed(2)}T`
      else if (mcapValue >= 1e9) mcap = `$${(mcapValue / 1e9).toFixed(2)}B`
      else mcap = `$${(mcapValue / 1e6).toFixed(2)}M`
    }
    
    return {
      rank: index + 1,
      symbol,
      name: cryptoMeta[symbol]?.name || symbol,
      price,
      change,
      mcap,
      positive,
      color: cryptoMeta[symbol]?.color || "#888888",
    }
  })
}

const cryptoData = generateTableData()

type FilterCategory = "Top Assets" | "Watchlists" | "Sectors" | "Ecosystems"
type FilterOption = "Top 100" | "Gainers" | "Losers"

const filterCategories: { category: FilterCategory; icon: React.ReactNode; options?: FilterOption[] }[] = [
  { category: "Top Assets", icon: <TrendingUp className="h-3.5 w-3.5" />, options: ["Top 100", "Gainers", "Losers"] },
  { category: "Watchlists", icon: <Eye className="h-3.5 w-3.5" /> },
  { category: "Sectors", icon: <Layers className="h-3.5 w-3.5" /> },
  { category: "Ecosystems", icon: <Globe className="h-3.5 w-3.5" /> },
]

// Chart tab options
type ChartTab = "Price" | "Volume" | "Mcap"

export function PricesChartCard() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>("Top 100")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedAssets, setSelectedAssets] = useState<string[]>(["ETH", "BTC"])
  const [activeChartTab, setActiveChartTab] = useState<ChartTab>("Price")
  const [chartType, setChartType] = useState<"line" | "bar">("line")
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Filter data based on search and selected filter
  const filteredData = cryptoData.filter((crypto) => {
    const matchesSearch = crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crypto.name.toLowerCase().includes(searchQuery.toLowerCase())

    if (!matchesSearch) return false

    if (selectedFilter === "Gainers") return crypto.positive
    if (selectedFilter === "Losers") return !crypto.positive
    return true // Top 100
  })

  const handleFilterSelect = (option: FilterOption) => {
    setSelectedFilter(option)
    setIsDropdownOpen(false)
  }

  const toggleAssetSelection = (symbol: string) => {
    setSelectedAssets((prev) => {
      if (prev.includes(symbol)) {
        return prev.filter((s) => s !== symbol)
      }
      return [...prev, symbol]
    })
  }

  const removeAsset = (symbol: string) => {
    setSelectedAssets((prev) => prev.filter((s) => s !== symbol))
  }

  // Prepare chart data
  const prepareChartData = () => {
    if (selectedAssets.length === 0) return []
    
    // Get all timestamps from first selected asset
    const firstAssetData = historicalData[selectedAssets[0]] || []
    
    return firstAssetData.map((item) => {
      const dataPoint: Record<string, number | string> = {
        timestamp: item.TIMESTAMP,
        date: new Date(item.TIMESTAMP * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      }
      
      selectedAssets.forEach((symbol) => {
        const assetData = historicalData[symbol]
        if (assetData) {
          const matchingData = assetData.find((d) => d.TIMESTAMP === item.TIMESTAMP)
          if (matchingData) {
            if (activeChartTab === "Price") {
              dataPoint[symbol] = matchingData.CLOSE
            } else if (activeChartTab === "Volume") {
              dataPoint[symbol] = matchingData.VOLUME
            } else {
              dataPoint[symbol] = matchingData.QUOTE_VOLUME
            }
          }
        }
      })
      
      return dataPoint
    })
  }

  const chartData = prepareChartData()

  // Calculate percentage change for chart labels
  const getAssetChange = (symbol: string) => {
    const data = historicalData[symbol]
    if (!data || data.length < 2) return { value: "0%", positive: true }
    const first = data[0].CLOSE
    const last = data[data.length - 1].CLOSE
    const change = ((last - first) / first) * 100
    return {
      value: `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`,
      positive: change >= 0,
    }
  }

  return (
    <Card className="bg-[#0f1118] border-[#1e2738] h-full py-0 flex flex-col">
      <CardHeader className="pb-2 pt-4 px-4 border-[#1e2738] bg-[#181b28] rounded-t-xl shrink-0">
        <CardTitle className="text-white text-base font-medium">Prices & Chart</CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1 flex flex-row overflow-hidden">
        <div className="w-1/3 p-0 flex flex-col overflow-hidden border-r border-[#1e2738]">
          {/* Filter bar */}
          <div className="flex items-center gap-2 px-3 py-2 border-b border-[#1e2738]">
            {/* Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#1a2332] rounded border border-[#2a3548] text-xs text-white hover:bg-[#232d3f] transition-colors"
              >
                <TrendingUp className="h-3 w-3 text-gray-400" />
                <span>{selectedFilter}</span>
                <ChevronDown className={`h-3 w-3 text-gray-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-[#1a2332] border border-[#2a3548] rounded-lg shadow-xl z-50 overflow-hidden">
                  {filterCategories.map((cat) => (
                    <div key={cat.category}>
                      <div className="flex items-center gap-2 px-3 py-2 text-xs text-gray-400 hover:bg-[#232d3f]">
                        {cat.icon}
                        <span>{cat.category}</span>
                      </div>
                      {cat.options && (
                        <div className="pl-6">
                          {cat.options.map((option) => (
                            <button
                              key={option}
                              onClick={() => handleFilterSelect(option)}
                              className={`w-full text-left px-3 py-1.5 text-xs hover:bg-[#232d3f] flex items-center gap-2 ${selectedFilter === option ? "text-blue-400" : "text-gray-300"
                                }`}
                            >
                              {selectedFilter === option && <span className="text-blue-400">✓</span>}
                              <span className={selectedFilter === option ? "" : "pl-4"}>{option}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Search bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
              <input
                type="text"
                placeholder="Search the table below"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1a2332] border border-[#2a3548] rounded pl-8 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#3a4558]"
              />
            </div>
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-[32px_1fr_70px_60px_70px] text-xs text-gray-500 px-3 py-2 border-b border-[#1e2738] shrink-0">
            <span>#</span>
            <span>Asset</span>
            <span className="text-right">Price</span>
            <span className="text-right">1W</span>
            <span className="text-right">Mcap</span>
          </div>

          {/* Scrollable Table Body */}
          <div className="flex-1 overflow-auto min-h-0">
            <div className="divide-y divide-[#1e2738]">
              {filteredData.map((crypto) => (
                <div
                  key={crypto.rank}
                  onClick={() => toggleAssetSelection(crypto.symbol)}
                  className={`grid grid-cols-[32px_1fr_70px_60px_70px] text-xs px-3 py-2.5 cursor-pointer items-center transition-colors ${
                    selectedAssets.includes(crypto.symbol)
                      ? "bg-[#1a2332] border-l-2 border-l-blue-500"
                      : "hover:bg-[#1a2332]"
                  }`}
                >
                  <span className="text-gray-500">{crypto.rank}</span>
                  <span className="text-white font-medium flex items-center gap-2">
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                      style={{ backgroundColor: crypto.color }}
                    >
                      {crypto.symbol.charAt(0)}
                    </span>
                    {crypto.symbol}
                  </span>
                  <span className="text-white text-right">{crypto.price}</span>
                  <span className={`text-right ${crypto.positive ? "text-green-400" : "text-red-400"}`}>
                    {crypto.change}
                  </span>
                  <span className="text-blue-400 text-right">{crypto.mcap}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="w-2/3 flex flex-col overflow-hidden">
          {/* Chart Toolbar */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-[#1e2738] shrink-0">
            <div className="flex items-center gap-2">
              {/* Chart type icons */}
              <button
                onClick={() => setChartType("line")}
                className={`p-1.5 rounded ${chartType === "line" ? "bg-[#2a3548]" : "hover:bg-[#1a2332]"}`}
              >
                <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 12l5-5 4 4 9-9" />
                </svg>
              </button>
              <button
                onClick={() => setChartType("bar")}
                className={`p-1.5 rounded ${chartType === "bar" ? "bg-[#2a3548]" : "hover:bg-[#1a2332]"}`}
              >
                <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="10" width="4" height="10" />
                  <rect x="10" y="5" width="4" height="15" />
                  <rect x="17" y="8" width="4" height="12" />
                </svg>
              </button>
              
              <div className="w-px h-4 bg-[#2a3548] mx-1" />
              
              {/* Chart data tabs */}
              {(["Price", "Volume", "Mcap"] as ChartTab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveChartTab(tab)}
                  className={`px-3 py-1 text-xs rounded ${
                    activeChartTab === tab
                      ? "bg-blue-600 text-white"
                      : "text-gray-400 hover:text-white hover:bg-[#1a2332]"
                  }`}
                >
                  {tab}
                </button>
              ))}
              
              <button className="px-3 py-1 text-xs text-gray-400 hover:text-white hover:bg-[#1a2332] rounded">
                Multi-Y Axis
              </button>
              <button className="px-3 py-1 text-xs text-gray-400 hover:text-white hover:bg-[#1a2332] rounded">
                %
              </button>
            </div>
          </div>

          {/* Selected Assets Tags */}
          <div className="flex items-center gap-2 px-3 py-2 border-b border-[#1e2738] shrink-0 flex-wrap">
            {selectedAssets.map((symbol) => (
              <span
                key={symbol}
                className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs text-white"
                style={{ backgroundColor: `${cryptoMeta[symbol]?.color}33`, borderLeft: `3px solid ${cryptoMeta[symbol]?.color}` }}
              >
                <span
                  className="w-2.5 h-2.5 rounded-sm"
                  style={{ backgroundColor: cryptoMeta[symbol]?.color }}
                />
                {symbol}
                <button
                  onClick={() => removeAsset(symbol)}
                  className="ml-0.5 hover:text-red-400 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            <button className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs text-gray-400 hover:text-white hover:bg-[#1a2332] border border-dashed border-[#2a3548]">
              <Plus className="w-3 h-3" />
              Add
            </button>
          </div>

          {/* Chart Area */}
          <div className="flex-1 p-4 min-h-0 relative">
            {selectedAssets.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                Select assets from the table to view chart
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 20, right: 60, left: 20, bottom: 20 }}>
                  <XAxis
                    dataKey="date"
                    stroke="#4a5568"
                    tick={{ fill: "#718096", fontSize: 11 }}
                    axisLine={{ stroke: "#2a3548" }}
                    tickLine={false}
                  />
                  <YAxis
                    yAxisId="left"
                    stroke="#4a5568"
                    tick={{ fill: "#718096", fontSize: 11 }}
                    axisLine={{ stroke: "#2a3548" }}
                    tickLine={false}
                    tickFormatter={(value) => {
                      if (value >= 1000) return `${(value / 1000).toFixed(0)}k`
                      return value.toFixed(2)
                    }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="#4a5568"
                    tick={{ fill: "#718096", fontSize: 11 }}
                    axisLine={{ stroke: "#2a3548" }}
                    tickLine={false}
                    tickFormatter={(value) => `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1a2332",
                      border: "1px solid #2a3548",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                    labelStyle={{ color: "#fff" }}
                  />
                  {selectedAssets.map((symbol, index) => (
                    <Line
                      key={symbol}
                      yAxisId={index === 0 ? "left" : "left"}
                      type="monotone"
                      dataKey={symbol}
                      stroke={cryptoMeta[symbol]?.color || "#888"}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            )}
            
            {/* Chart Labels on right side */}
            {selectedAssets.length > 0 && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-2">
                {selectedAssets.map((symbol) => {
                  const change = getAssetChange(symbol)
                  return (
                    <div
                      key={symbol}
                      className="flex items-center gap-1 px-2 py-1 rounded text-xs"
                      style={{ backgroundColor: cryptoMeta[symbol]?.color }}
                    >
                      <span className="text-white font-medium">{symbol}</span>
                      <span className={change.positive ? "text-green-200" : "text-red-200"}>
                        {change.value}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
            
            {/* Messari watermark */}
            <div className="absolute bottom-4 right-4 text-gray-600 text-sm font-medium opacity-50">
              Messari
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
