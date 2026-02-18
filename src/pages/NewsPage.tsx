import { useCallback, useEffect, useState } from "react"
import { fetchNews, fetchSources, fetchCategories, fetchLatestNews } from "@/services/news-api"
import type { NewsItem, NewsSource, RawNewsCategory } from "@/types/news"
import { NewsDetailPanel, MultiSelectDropdown } from "@/components"
import { Search, X } from "lucide-react"

// Dummy Daily Recap data
const dailyRecaps = [
  {
    id: 1,
    date: "Today, Feb 18",
    title: "The cryptocurrency community is facing internal cultural challenges, including harassment and ONXBT...",
  },
  {
    id: 2,
    date: "Tue, Feb 17",
    title: "Strategy, formerly MicroStrategy, acquired an additional 9,460 Bitcoin, valued at approximately $748.8 million...",
  },
  {
    id: 3,
    date: "Mon, Feb 16",
    title: "Memecoin trading is experiencing extreme volatility, with some traders seeing large gains and...",
  },
  {
    id: 4,
    date: "Sun, Feb 15",
    title: "Michael Saylor's Strategy (formerly MicroStrategy), holds 714,644 Bitcoin, valued at approximately...",
  },
  {
    id: 5,
    date: "Sat, Feb 14",
    title: "Memecoins are a highly volatile segment of cryptocurrency markets where traders seek massive retur...",
  },
  {
    id: 6,
    date: "Fri, Feb 13",
    title: "Trump Media and Technology Group has filed registration statements with the SEC for two...",
  },
]

export function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [sources, setSources] = useState<NewsSource[]>([])
  const [categories, setCategories] = useState<RawNewsCategory[]>([])
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [isFiltering, setIsFiltering] = useState(false)
  
  // Filter states
  const [filters, setFilters] = useState({
    search: "",
    sourceIds: [] as number[],
    categoryIds: [] as string[],
  })

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const [newsData, sourcesData, categoriesData] = await Promise.all([
          fetchLatestNews(),
          fetchSources(),
          fetchCategories(),
        ])
        setNews(newsData)
        setSources(sourcesData)
        setCategories(categoriesData)
      } catch (error) {
        console.error("Failed to fetch news data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Filter handlers
  const handleSourceToggle = (sourceId: number) => {
    setFilters((prev) => ({
      ...prev,
      sourceIds: prev.sourceIds.includes(sourceId)
        ? prev.sourceIds.filter((id) => id !== sourceId)
        : [...prev.sourceIds, sourceId],
    }))
  }

  const handleCategoryToggle = (categoryId: string) => {
    setFilters((prev) => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(categoryId)
        ? prev.categoryIds.filter((id) => id !== categoryId)
        : [...prev.categoryIds, categoryId],
    }))
  }

  const applyFilters = useCallback(async () => {
    const hasFilters =
      filters.search.trim() !== "" ||
      filters.sourceIds.length > 0 ||
      filters.categoryIds.length > 0

    try {
      setIsFiltering(true)

      let items: NewsItem[]

      if (hasFilters) {
        const params = {
          search: filters.search.trim() || undefined,
          sourceIds: filters.sourceIds.length > 0 ? filters.sourceIds : undefined,
          categoryIds: filters.categoryIds.length > 0 ? filters.categoryIds : undefined,
          limit: 50,
        }
        items = await fetchNews(params)
      } else {
        items = await fetchLatestNews()
      }

      setNews(items)
    } catch (error) {
      console.error("Failed to fetch news with filters:", error)
    } finally {
      setIsFiltering(false)
    }
  }, [filters])

  const clearFilters = useCallback(async () => {
    setFilters({ search: "", sourceIds: [], categoryIds: [] })

    try {
      setIsFiltering(true)
      const items = await fetchLatestNews()
      setNews(items)
    } catch (error) {
      console.error("Failed to fetch news:", error)
    } finally {
      setIsFiltering(false)
    }
  }, [])

  const hasActiveFilters = filters.sourceIds.length > 0 || filters.categoryIds.length > 0

  return (
    <div className="h-full overflow-y-auto bg-[#060709]">
      <div className="max-w-400 mx-auto px-6 py-8">
        {/* Daily Recaps Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              Daily Recaps
            </h2>
            <div className="flex gap-2">
              <button 
            onClick={() => {
              const container = document.getElementById('daily-recaps-scroll');
              if (container) container.scrollBy({ left: -320, behavior: 'smooth' });
            }}
            className="w-8 h-8 rounded bg-[#1a2332] hover:bg-[#232d3f] flex items-center justify-center text-gray-400"
              >
            ‹
              </button>
              <button 
            onClick={() => {
              const container = document.getElementById('daily-recaps-scroll');
              if (container) container.scrollBy({ left: 320, behavior: 'smooth' });
            }}
            className="w-8 h-8 rounded bg-[#1a2332] hover:bg-[#232d3f] flex items-center justify-center text-gray-400"
              >
            ›
              </button>
            </div>
          </div>

          <div 
            id="daily-recaps-scroll"
            className="flex gap-4 overflow-x-auto pb-4 scroll-smooth no-scrollbar" 
          >
            {dailyRecaps.map((recap) => (
              <div
            key={recap.id}
            className="bg-[#0f1118] border border-[#1e2738] rounded-lg p-4 hover:border-[#2a3548] transition-colors cursor-pointer shrink-0 w-80"
              >
            <div className="text-xs text-blue-400 mb-2">(●) {recap.date}</div>
            <p className="text-sm text-gray-300 leading-relaxed line-clamp-3">
              {recap.title}
            </p>
              </div>
            ))}
          </div>
        </div>

        {/* Filters Section */}
        <div className="mb-6">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Search */}
            <div className="relative flex-1 min-w-75">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search News"
                value={filters.search}
                onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    applyFilters()
                  }
                }}
                className="w-full pl-10 pr-4 py-2 bg-[#0f1118] border border-[#1e2738] rounded-lg text-white text-sm focus:outline-none focus:border-[#2a3548]"
              />
            </div>

            {/* Multi-Select Filters */}
            <MultiSelectDropdown
              label="Sources"
              options={sources.map((s) => ({ id: s.id, label: s.name }))}
              selectedIds={filters.sourceIds}
              onToggle={handleSourceToggle}
            />
            
            <MultiSelectDropdown
              label="Categories"
              options={categories.map((c) => ({ id: c.categoryId, label: c.name }))}
              selectedIds={filters.categoryIds}
              onToggle={handleCategoryToggle}
            />

            {/* Action Buttons */}
            <button
              onClick={applyFilters}
              disabled={isFiltering}
              className="bg-violet-600 hover:bg-violet-700 disabled:bg-violet-800 disabled:cursor-not-allowed text-white text-sm font-medium py-2 px-6 rounded-lg transition-colors"
            >
              {isFiltering ? "Applying..." : "Apply Filters"}
            </button>
            
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                title="Clear all filters"
                className="text-gray-400 hover:text-gray-200 p-2 rounded-lg border border-[#1e2738] hover:border-gray-500 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* News Header */}
        <div className="flex items-center gap-2 mb-4">
             <div className="text-xl text-blue-400">((●))</div>
          {/* <span className="text-blue-500">📻</span> */}
          <h2 className="text-2xl font-semibold text-white">News</h2>
        </div>

        {/* News Table */}
        <div className="bg-[#0f1118] border border-[#1e2738] rounded-lg overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-[#1e2738] bg-[#0a0d14]">
            <div className="col-span-5 text-xs font-semibold text-gray-400 uppercase">News</div>
            <div className="col-span-2 text-xs font-semibold text-gray-400 uppercase">Date</div>
            <div className="col-span-2 text-xs font-semibold text-gray-400 uppercase">Source</div>
            <div className="col-span-3 text-xs font-semibold text-gray-400 uppercase">Category</div>
          </div>

          {/* Table Body */}
          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading news...</div>
          ) : news.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No news found</div>
          ) : (
            <div className="divide-y divide-[#1e2738]">
              {news.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedNews(item)}
                  className="grid grid-cols-12 gap-4 px-4 py-4 hover:bg-[#1a2332] transition-colors cursor-pointer"
                >
                  {/* News Title */}
                  <div className="col-span-5">
                    <h3 className="text-sm font-semibold text-white mb-1 line-clamp-2">
                      {item.title}
                    </h3>
                    {item.subtitle && (
                      <p className="text-xs text-gray-500 line-clamp-1">{item.subtitle}</p>
                    )}
                  </div>

                  {/* Date */}
                  <div className="col-span-2 flex items-center">
                    <span className="text-sm text-gray-400">
                      {new Date(item.publishedOn * 1000).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </span>
                  </div>

                  {/* Source */}
                  <div className="col-span-2 flex items-center">
                    <span className="text-sm text-gray-300">{item.sourceData.NAME}</span>
                  </div>

                  {/* Categories */}
                  <div className="col-span-3 flex items-center gap-2 flex-wrap">
                    {item.categoryData?.slice(0, 2).map((cat) => (
                      <span
                        key={cat.id}
                        className="px-2 py-1 rounded-full bg-violet-500/20 text-xs text-violet-300 border border-violet-500/30"
                      >
                        {cat.category}
                      </span>
                    ))}
                    {item.categoryData && item.categoryData.length > 2 && (
                      <span className="text-xs text-gray-500">
                        +{item.categoryData.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <NewsDetailPanel selectedNews={selectedNews} onClose={() => setSelectedNews(null)} />
    </div>
  )
}
