import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Search, Bell, ChevronDown, User, Settings, LogOut, HelpCircle, CreditCard, TrendingUp, DollarSign, FileText, Filter, Flame, ArrowUpRight } from "lucide-react"
import { searchCoinGecko, getTrendingSearch, type SearchResponse, type TrendingResponse } from "@/services/coingecko-api"
import { ScrollArea } from "@/components/ui/scroll-area"

export function TopBar() {
  const navigate = useNavigate()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(null)
  const [trendingData, setTrendingData] = useState<TrendingResponse | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Fetch trending data on mount
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const data = await getTrendingSearch()
        setTrendingData(data)
      } catch (error) {
        console.error("Error fetching trending data:", error)
      }
    }
    fetchTrending()
  }, [])

  // Search debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults(null)
      return
    }

    const timer = setTimeout(async () => {
      try {
        setIsSearching(true)
        const results = await searchCoinGecko(searchQuery)
        setSearchResults(results)
        setIsSearchOpen(true)
      } catch (error) {
        console.error("Search error:", error)
        setSearchResults(null)
      } finally {
        setIsSearching(false)
      }
    }, 300) // 300ms debounce

    return () => clearTimeout(timer)
  }, [searchQuery])

  const handleCoinSelect = (coinId: string) => {
    navigate(`/coin/${coinId}`)
    setSearchQuery("")
    setIsSearchOpen(false)
    setSearchResults(null)
  }

  const handleSearchFocus = () => {
    // Show trending or search results when focused
    if (searchQuery.trim()) {
      setIsSearchOpen(true)
    } else if (trendingData) {
      setIsSearchOpen(true)
    }
  }

  const profileMenuItems = [
    { icon: User, label: "Profile", onClick: () => console.log("Profile clicked") },
    { icon: Settings, label: "Settings", onClick: () => console.log("Settings clicked") },
    { icon: CreditCard, label: "Billing", onClick: () => console.log("Billing clicked") },
    { icon: HelpCircle, label: "Help & Support", onClick: () => console.log("Help clicked") },
    { type: "divider" as const },
    { icon: LogOut, label: "Log out", onClick: () => console.log("Logout clicked"), danger: true },
  ]

  return (
    <header className="h-14 bg-[#0a0d14] border-b border-[#1e2738] flex items-center justify-between px-4 shrink-0">
      {/* Left: Logo & Brand */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-linear-to-br to-purple-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">O</span>
        </div>
        <span className="text-white font-semibold text-lg">One-Stop-Trading</span>
      </div>

      {/* Center: Search Bar */}
      <div className="flex-1 max-w-xl mx-8">
        <div className="relative" ref={searchRef}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search or jump to..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={handleSearchFocus}
            className="w-full bg-[#181b28] border border-[#1d2431] rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs border border-[#2a3548] px-1.5 py-0.5 rounded">
            /
          </div>

          {/* Search Results Dropdown */}
          {isSearchOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a2332] border border-[#2a3548] rounded-lg shadow-2xl z-50 overflow-hidden max-h-150">
              {isSearching ? (
                <div className="px-4 py-8 text-center text-gray-400 text-sm">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <span>Searching...</span>
                  </div>
                </div>
              ) : !searchQuery.trim() && trendingData ? (
                <ScrollArea className="max-h-140 overflow-auto">
                  <div className="py-2">
                    {/* Trending Coins Section */}
                    {trendingData.coins.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 px-4 py-2 text-xs font-medium">
                          <Flame className="h-3.5 w-3.5 text-orange-500" />
                          <span className="text-orange-400">Trending Now</span>
                          <span className="ml-auto text-gray-500">
                            Top 7 Searches
                          </span>
                        </div>
                        <div>
                          {trendingData.coins.slice(0, 7).map((data, idx) => {
                            const item = data.item;
                            const priceChange24h = item.data?.price_change_percentage_24h?.usd || 0
                            const isPositive = priceChange24h >= 0
                            
                            return (
                              <button
                                key={item.id}
                                onClick={() => handleCoinSelect(item.id)}
                                className="w-full px-4 py-2.5 hover:bg-[#232d3f] transition-colors flex items-center gap-3 group"
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className="text-orange-500 text-xs font-bold w-5">
                                    #{idx + 1}
                                  </span>
                                  <img
                                    src={item.small}
                                    alt={item.name}
                                    className="w-6 h-6 rounded-full"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).style.display = "none"
                                    }}
                                  />
                                </div>
                                <div className="flex flex-col items-start flex-1 min-w-0">
                                  <div className="flex items-center gap-2 w-full">
                                    <span className="text-white text-sm font-medium group-hover:text-blue-400 transition-colors truncate">
                                      {item.name}
                                    </span>
                                    <span className="text-gray-500 text-xs uppercase">
                                      {item.symbol}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {item.market_cap_rank && (
                                      <span className="text-gray-500 text-xs">
                                        Rank #{item.market_cap_rank}
                                      </span>
                                    )}
                                    {priceChange24h !== 0 && (
                                      <span className={`text-xs flex items-center gap-0.5 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                                        <ArrowUpRight className={`h-3 w-3 ${!isPositive && 'rotate-90'}`} />
                                        {Math.abs(priceChange24h).toFixed(2)}%
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <ChevronDown className="h-4 w-4 text-gray-500 -rotate-90 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {/* Trending NFTs */}
                    {trendingData.nfts.length > 0 && (
                      <div className="mt-2 border-t border-[#2a3548]">
                        <div className="flex items-center gap-2 px-4 py-2 text-xs text-gray-400 font-medium">
                          <FileText className="h-3.5 w-3.5" />
                          <span>Trending NFTs</span>
                        </div>
                        <div>
                          {trendingData.nfts.slice(0, 3).map((nft) => {
                            const floorChange = nft.floor_price_24h_percentage_change || 0
                            const isPositive = floorChange >= 0
                            
                            return (
                              <button
                                key={nft.id}
                                className="w-full px-4 py-2.5 hover:bg-[#232d3f] transition-colors flex items-center gap-3 group"
                              >
                                <img
                                  src={nft.thumb}
                                  alt={nft.name}
                                  className="w-6 h-6 rounded-lg"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = "none"
                                  }}
                                />
                                <div className="flex flex-col items-start flex-1 min-w-0">
                                  <span className="text-white text-sm font-medium group-hover:text-blue-400 transition-colors truncate">
                                    {nft.name}
                                  </span>
                                  <div className="flex items-center gap-2">
                                    <span className="text-gray-500 text-xs">
                                      Floor: {nft.floor_price_in_native_currency.toFixed(2)} {nft.native_currency_symbol}
                                    </span>
                                    {floorChange !== 0 && (
                                      <span className={`text-xs ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                                        {isPositive ? '+' : ''}{floorChange.toFixed(1)}%
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {/* Trending Categories */}
                    {trendingData.categories.length > 0 && (
                      <div className="mt-2 border-t border-[#2a3548]">
                        <div className="flex items-center gap-2 px-4 py-2 text-xs text-gray-400 font-medium">
                          <Filter className="h-3.5 w-3.5" />
                          <span>Trending Categories</span>
                        </div>
                        <div>
                          {trendingData.categories.slice(0, 3).map((category) => {
                            const change1h = category.market_cap_1h_change || 0
                            const isPositive = change1h >= 0
                            
                            return (
                              <button
                                key={category.id}
                                className="w-full px-4 py-2.5 hover:bg-[#232d3f] transition-colors flex items-center gap-3 group"
                              >
                                <div className="w-6 h-6 rounded-full bg-[#2a3548] flex items-center justify-center">
                                  <Filter className="h-3 w-3 text-gray-400" />
                                </div>
                                <div className="flex flex-col items-start flex-1 min-w-0">
                                  <span className="text-white text-sm font-medium group-hover:text-blue-400 transition-colors truncate">
                                    {category.name}
                                  </span>
                                  <div className="flex items-center gap-2">
                                    <span className="text-gray-500 text-xs">
                                      {category.coins_count} coins
                                    </span>
                                    {change1h !== 0 && (
                                      <span className={`text-xs ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                                        {isPositive ? '+' : ''}{change1h.toFixed(1)}% (1h)
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {/* Footer Hint */}
                    <div className="mt-2 border-t border-[#2a3548] px-4 py-3 flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-2">
                        <kbd className="px-2 py-1 bg-[#0d1421] border border-[#2a3548] rounded text-gray-400">
                          ↑↓
                        </kbd>
                        <span>navigate</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <kbd className="px-2 py-1 bg-[#0d1421] border border-[#2a3548] rounded text-gray-400">
                          ↵
                        </kbd>
                        <span>select</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <kbd className="px-2 py-1 bg-[#0d1421] border border-[#2a3548] rounded text-gray-400">
                          esc
                        </kbd>
                        <span>close</span>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              ) : searchResults && (
                <ScrollArea className="max-h-140">
                  <div className="py-2">
                    {/* Trending Assets Section */}
                    {searchResults.coins.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 px-4 py-2 text-xs text-gray-400 font-medium">
                          <TrendingUp className="h-3.5 w-3.5" />
                          <span>Assets</span>
                          <span className="ml-auto text-gray-500">
                            View All ({searchResults.coins.length})
                          </span>
                        </div>
                        <div>
                          {searchResults.coins.slice(0, 5).map((coin) => (
                            <button
                              key={coin.id}
                              onClick={() => handleCoinSelect(coin.id)}
                              className="w-full px-4 py-2.5 hover:bg-[#232d3f] transition-colors flex items-center gap-3 group"
                            >
                              <img
                                src={coin.thumb}
                                alt={coin.name}
                                className="w-6 h-6 rounded-full"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = "none"
                                }}
                              />
                              <div className="flex flex-col items-start flex-1 min-w-0">
                                <div className="flex items-center gap-2 w-full">
                                  <span className="text-white text-sm font-medium group-hover:text-blue-400 transition-colors truncate">
                                    {coin.name}
                                  </span>
                                  <span className="text-gray-500 text-xs uppercase">
                                    {coin.symbol}
                                  </span>
                                </div>
                                {coin.market_cap_rank && (
                                  <span className="text-gray-500 text-xs">
                                    Rank #{coin.market_cap_rank}
                                  </span>
                                )}
                              </div>
                              <ChevronDown className="h-4 w-4 text-gray-500 -rotate-90 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Exchanges Section */}
                    {searchResults.exchanges.length > 0 && (
                      <div className="mt-2 border-t border-[#2a3548]">
                        <div className="flex items-center gap-2 px-4 py-2 text-xs text-gray-400 font-medium">
                          <DollarSign className="h-3.5 w-3.5" />
                          <span>Exchanges</span>
                          <span className="ml-auto text-gray-500">
                            View All ({searchResults.exchanges.length})
                          </span>
                        </div>
                        <div>
                          {searchResults.exchanges.slice(0, 3).map((exchange) => (
                            <button
                              key={exchange.id}
                              className="w-full px-4 py-2.5 hover:bg-[#232d3f] transition-colors flex items-center gap-3 group"
                            >
                              <img
                                src={exchange.thumb}
                                alt={exchange.name}
                                className="w-6 h-6 rounded-full"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = "none"
                                }}
                              />
                              <div className="flex flex-col items-start flex-1 min-w-0">
                                <span className="text-white text-sm font-medium group-hover:text-blue-400 transition-colors truncate">
                                  {exchange.name}
                                </span>
                                <span className="text-gray-500 text-xs capitalize">
                                  {exchange.market_type}
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Categories Section */}
                    {searchResults.categories.length > 0 && (
                      <div className="mt-2 border-t border-[#2a3548]">
                        <div className="flex items-center gap-2 px-4 py-2 text-xs text-gray-400 font-medium">
                          <Filter className="h-3.5 w-3.5" />
                          <span>Categories</span>
                        </div>
                        <div>
                          {searchResults.categories.slice(0, 3).map((category) => (
                            <button
                              key={category.id}
                              className="w-full px-4 py-2.5 hover:bg-[#232d3f] transition-colors flex items-center gap-3 group"
                            >
                              <div className="w-6 h-6 rounded-full bg-[#2a3548] flex items-center justify-center">
                                <Filter className="h-3 w-3 text-gray-400" />
                              </div>
                              <span className="text-white text-sm font-medium group-hover:text-blue-400 transition-colors truncate">
                                {category.name}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* NFTs Section */}
                    {searchResults.nfts.length > 0 && (
                      <div className="mt-2 border-t border-[#2a3548]">
                        <div className="flex items-center gap-2 px-4 py-2 text-xs text-gray-400 font-medium">
                          <FileText className="h-3.5 w-3.5" />
                          <span>NFTs</span>
                        </div>
                        <div>
                          {searchResults.nfts.slice(0, 3).map((nft) => (
                            <button
                              key={nft.id}
                              className="w-full px-4 py-2.5 hover:bg-[#232d3f] transition-colors flex items-center gap-3 group"
                            >
                              <img
                                src={nft.thumb}
                                alt={nft.name}
                                className="w-6 h-6 rounded-lg"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = "none"
                                }}
                              />
                              <div className="flex flex-col items-start flex-1 min-w-0">
                                <span className="text-white text-sm font-medium group-hover:text-blue-400 transition-colors truncate">
                                  {nft.name}
                                </span>
                                <span className="text-gray-500 text-xs uppercase">
                                  {nft.symbol}
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* No Results */}
                    {searchResults.coins.length === 0 &&
                      searchResults.exchanges.length === 0 &&
                      searchResults.categories.length === 0 &&
                      searchResults.nfts.length === 0 && (
                        <div className="px-4 py-8 text-center text-gray-400 text-sm">
                          No results found for "{searchQuery}"
                        </div>
                      )}

                    {/* Footer Hint */}
                    <div className="mt-2 border-t border-[#2a3548] px-4 py-3 flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-2">
                        <kbd className="px-2 py-1 bg-[#0d1421] border border-[#2a3548] rounded text-gray-400">
                          ↑↓
                        </kbd>
                        <span>navigate</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <kbd className="px-2 py-1 bg-[#0d1421] border border-[#2a3548] rounded text-gray-400">
                          ↵
                        </kbd>
                        <span>select</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <kbd className="px-2 py-1 bg-[#0d1421] border border-[#2a3548] rounded text-gray-400">
                          esc
                        </kbd>
                        <span>close</span>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right: Actions & Profile */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 text-gray-400 hover:text-white hover:bg-[#1a2332] rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 p-1.5 pr-3 text-gray-400 hover:text-white hover:bg-[#1a2332] rounded-lg transition-colors"
          >
            <div className="w-8 h-8 bg-linear-to-br to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm">U</span>
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform ${isProfileOpen ? "rotate-180" : ""}`} />
          </button>

          {/* Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-[#1a2332] border border-[#2a3548] rounded-lg shadow-xl z-50 overflow-hidden py-1">
              {/* User Info */}
              <div className="px-4 py-3 border-b border-[#2a3548]">
                <p className="text-white font-medium text-sm">Akash Deep</p>
                <p className="text-gray-500 text-xs">akash@gmail.com</p>
              </div>

              {/* Menu Items */}
              {profileMenuItems.map((item, index) => {
                if (item.type === "divider") {
                  return <div key={index} className="h-px bg-[#2a3548] my-1" />
                }
                
                const Icon = item.icon
                return (
                  <button
                    key={index}
                    onClick={item.onClick}
                    className={`w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-[#232d3f] transition-colors ${
                      item.danger ? "text-red-400 hover:text-red-300" : "text-gray-300 hover:text-white"
                    }`}
                  >
                    {Icon && <Icon className="w-4 h-4" />}
                    <span>{item.label}</span>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
