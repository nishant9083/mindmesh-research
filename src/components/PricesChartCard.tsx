import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useRef, useEffect } from "react"
import { ChevronDown, Search, TrendingUp, Eye, Layers, Globe } from "lucide-react"

const cryptoData = [
  { rank: 1, symbol: "BTC", name: "Bitcoin", price: "$69,310.96", change: "-0.91%", mcap: "$1.38T", positive: false, color: "#f7931a" },
  { rank: 2, symbol: "ETH", name: "Ethereum", price: "$1,991.38", change: "-5.26%", mcap: "$238B", positive: false, color: "#627eea" },
  { rank: 3, symbol: "USDT", name: "Tether", price: "$1.000", change: "-0.04%", mcap: "$184B", positive: false, color: "#26a17b" },
  { rank: 4, symbol: "XRP", name: "XRP", price: "$1.50", change: "+4.32%", mcap: "$90.40B", positive: true, color: "#00aae4" },
  { rank: 5, symbol: "BNB", name: "BNB", price: "$623.94", change: "-2.00%", mcap: "$84.37B", positive: false, color: "#f3ba2f" },
  { rank: 6, symbol: "USDC", name: "USDC", price: "$1.000", change: "-0.03%", mcap: "$73.60B", positive: false, color: "#2775ca" },
  { rank: 7, symbol: "SOL", name: "Solana", price: "$86.01", change: "-0.57%", mcap: "$48.60B", positive: false, color: "#9945ff" },
  { rank: 8, symbol: "TRX", name: "TRON", price: "$0.281", change: "+0.59%", mcap: "$26.57B", positive: true, color: "#ff0013" },
  { rank: 9, symbol: "DOGE", name: "Dogecoin", price: "$0.102", change: "+6.95%", mcap: "$17.17B", positive: true, color: "#c3a634" },
  { rank: 10, symbol: "BCH", name: "Bitcoin Cash", price: "$562.67", change: "+5.65%", mcap: "$11.16B", positive: true, color: "#8dc351" },
  { rank: 11, symbol: "WBT", name: "WhiteBIT", price: "$51.51", change: "-2.11%", mcap: "$10.94B", positive: false, color: "#0052ff" },
]

type FilterCategory = "Top Assets" | "Watchlists" | "Sectors" | "Ecosystems"
type FilterOption = "Top 100" | "Gainers" | "Losers"

const filterCategories: { category: FilterCategory; icon: React.ReactNode; options?: FilterOption[] }[] = [
  { category: "Top Assets", icon: <TrendingUp className="h-3.5 w-3.5" />, options: ["Top 100", "Gainers", "Losers"] },
  { category: "Watchlists", icon: <Eye className="h-3.5 w-3.5" /> },
  { category: "Sectors", icon: <Layers className="h-3.5 w-3.5" /> },
  { category: "Ecosystems", icon: <Globe className="h-3.5 w-3.5" /> },
]

export function PricesChartCard() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>("Top 100")
  const [searchQuery, setSearchQuery] = useState("")
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

  return (
    <Card className="bg-[#0f1118] border-[#1e2738] h-full py-0 flex flex-col">
      <CardHeader className="pb-2 pt-4 px-4 border-[#1e2738] bg-[#181b28] rounded-t-xl shrink-0">
        <CardTitle className="text-white text-base font-medium">Prices & Chart</CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1 flex flex-row overflow-hidden">
        <div className="w-1/3 p-0 flex flex-col overflow-hidden">
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
          <div className="grid grid-cols-[32px_1fr_90px_70px_80px] text-xs text-gray-500 px-3 py-2 border-b border-[#1e2738] shrink-0">
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
                  className="grid grid-cols-[32px_1fr_90px_70px_80px] text-xs px-3 py-2.5 hover:bg-[#1a2332] cursor-pointer items-center"
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
        {/* Chart Placeholder */}
        <div className="w-2/3 p-4 flex items-center justify-center">
          <div className="text-gray-500 text-sm">Chart visualization</div>
        </div>

      </CardContent>
    </Card>
  )
}
