import { NewsDetailPanel } from "@/components"
import { getTrendingSearch } from "@/services/coingecko-api"
import { fetchNews } from "@/services/news-api"
import { fetchResearchArticles } from "@/services/research-api"
import type { TrendingResponse } from "@/types"
import type { NewsItem, ResearchItem } from "@/types/news"
import { ArrowUpRight, ChevronDown, ChevronRight } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"



export function ResearchPage() {
    const navigate = useNavigate()
    const [trendingData, setTrendingData] = useState<TrendingResponse | null>(null)
    const [latestReports, setLatestReports] = useState<ResearchItem[]>([])
    const [allReports, setAllReports] = useState<ResearchItem[]>([])
    const [newsletters, setNewsletters] = useState<NewsItem[]>([])
    const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null)
    const [loading, setLoading] = useState(true)
    const placeholder = import.meta.env.VITE_API_IMAGE_PLACEHOLDER

    const handleCoinSelect = (coinId: string) => {
        navigate(`/coin/${coinId}`)
    }

    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true)
                const [reports, news] = await Promise.all([
                    fetchResearchArticles(),
                    fetchNews({})
                ])
                setLatestReports(reports.slice(0, 6)) // Get first 6 reports
                setAllReports(reports);
                setNewsletters(news.slice(0, 8)) // Get first 8 news items
            } catch (error) {
                console.error("Failed to fetch research data:", error)
            } finally {
                setLoading(false)
            }
        }

        loadData()
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

    return (
        <div className="h-full overflow-y-auto bg-[#060709]">
            <div className="mx-auto px-4 py-2">
                {/* Header */}
                <div className="pb-4 border-b-2 border-gray-900">
                    <h2 className="text-3xl font-bold text-white">Research</h2>
                </div>

                {/* Four Column Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 py-2 gap-6">
                    {/* Research Spotlight */}
                    {/* <div className="space-y-4">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Research Spotlight
                            </h2>
                            <div className="flex gap-2">
                                <button className="w-8 h-8 rounded bg-[#1a2332] hover:bg-[#232d3f] flex items-center justify-center text-gray-400">
                                    ‹
                                </button>
                                <button className="w-8 h-8 rounded bg-[#1a2332] hover:bg-[#232d3f] flex items-center justify-center text-gray-400">
                                    ›
                                </button>
                            </div>
                        </div>

                        <div className="bg-[#0f1118] border border-[#1e2738] rounded-lg overflow-hidden cursor-pointer hover:border-[#2a3548] transition-colors">
                            
                            <div className="h-64 bg-linear-to-br from-blue-600 via-blue-800 to-blue-900 flex items-center justify-center relative overflow-hidden">
                                <div className="absolute inset-0 opacity-20">
                                    <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                                    <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/10 rounded-full translate-x-1/3 translate-y-1/3"></div>
                                </div>
                                <div className="text-center z-10 p-6">
                                    <div className="text-6xl font-bold text-white mb-2">State of AI</div>
                                    <div className="text-xl text-blue-200">Dec 2025</div>
                                </div>
                            </div>

                            <div className="p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xs text-gray-500">{spotlightData.category}</span>
                                    <span className="text-xs text-gray-600">•</span>
                                    <span className="text-xs text-gray-500">{spotlightData.date}</span>
                                </div>
                                <h3 className="text-white font-semibold mb-2">{spotlightData.title}</h3>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-400">Ⓜ {spotlightData.author}</span>
                                </div>
                            </div>
                        </div>
                    </div> */}

                    {/* Latest Reports - Spans 2 columns */}
                    <div className="space-y-4 lg:col-span-2">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Latest Research
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {loading ? (
                                <div className="text-gray-500 text-sm text-center py-8 col-span-2">Loading reports...</div>
                            ) : (
                                latestReports.map((report) => (
                                    <div
                                        key={report.id}
                                        onClick={() => navigate(`/research/${report.id}`)}
                                        className="flex items-center gap-3 p-2 bg-[#181b28] hover:bg-[#1a2332] rounded border border-[#1e2738] cursor-pointer transition-colors"
                                    >
                                        <div className="w-32 h-20 bg-[#1a2332] rounded overflow-hidden shrink-0">
                                            <img
                                                src={report.imageUrl || `${placeholder}/300x200?text=Crypto`}
                                                alt={report.title}
                                                className=" object-contain"
                                            />
                                        </div>
                                        <div className="flex flex-col py-1 justify-between h-full flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs text-gray-500">
                                                    {report.publishedAt
                                                        ? new Date(report.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                                        : new Date(report.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </span>
                                            </div>
                                            <h4 className="text-sm text-white font-bold line-clamp-2">{report.title}</h4>
                                            <p className="text-xs text-gray-500 pt-2">👤 {report.author}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Trending Assets */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Trending Assets
                            </h2>
                            {/* <button className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 border-none!">
                                View All <ChevronRight className="w-4 h-4" />
                            </button> */}
                        </div>

                        <div className="space-y-3 overflow-y-auto h-90">
                            {trendingData?.coins.map((data, idx) => {
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
                </div>

                {/* Newsletter Section */}
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Newsletter
                        </h2>
                        <div className="flex items-center gap-4">
                            <button
                                className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 border-none!"
                                onClick={() => navigate('/news')}
                            >
                                View All <ChevronRight className="w-4 h-4" />
                            </button>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        const container = document.getElementById('newsletter-scroll');
                                        if (container) container.scrollLeft -= 280;
                                    }}
                                    className="w-8 h-8 rounded bg-[#1a2332] hover:bg-[#232d3f] flex items-center justify-center text-gray-400"
                                >
                                    ‹
                                </button>
                                <button
                                    onClick={() => {
                                        const container = document.getElementById('newsletter-scroll');
                                        if (container) container.scrollLeft += 280;
                                    }}
                                    className="w-8 h-8 rounded bg-[#1a2332] hover:bg-[#232d3f] flex items-center justify-center text-gray-400"
                                >
                                    ›
                                </button>
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-gray-500 text-center py-8">Loading newsletters...</div>
                    ) : (
                        <div className="relative">
                            <div
                                id="newsletter-scroll"
                                className="flex gap-4 overflow-x-auto pb-4 scroll-smooth"
                                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                            >
                                {newsletters.map((newsletter) => (
                                    <div
                                        key={newsletter.id}
                                        onClick={() => setSelectedNews(newsletter)}
                                        className="bg-[#0f1118] border border-[#1e2738] rounded-lg overflow-hidden hover:border-[#2a3548] transition-colors cursor-pointer shrink-0 w-64"
                                    >
                                        <div className="p-4">
                                            <div className="text-xs text-gray-500 mb-2">
                                                {new Date(newsletter.publishedOn * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </div>
                                            <h3 className="text-white font-semibold text-sm mb-3 line-clamp-3 min-h-14">
                                                {newsletter.title}
                                            </h3>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <style>{`
                                #newsletter-scroll::-webkit-scrollbar {
                                    display: none;
                                }
                            `}</style>
                        </div>
                    )}
                </div>


                {/* Research Table Section */}
                <div className="mt-12">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="text-xl text-blue-400">((●))</div>
                        <h2 className="text-2xl font-semibold text-white">Research</h2>
                    </div>
                    <div className="bg-[#0f1118] border border-[#1e2738] rounded-lg overflow-hidden">
                        {/* Table Header */}
                        <div className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-[#1e2738] bg-[#0a0d14]">
                            <div className="col-span-5 text-xs font-semibold text-gray-400 uppercase">Title</div>
                            <div className="col-span-2 text-xs font-semibold text-gray-400 uppercase">Author</div>
                            <div className="col-span-2 text-xs font-semibold text-gray-400 uppercase">Published</div>
                            <div className="col-span-3 text-xs font-semibold text-gray-400 uppercase">Tags</div>
                        </div>
                        {/* Table Body */}
                        {loading ? (
                            <div className="text-center py-12 text-gray-500">Loading research...</div>
                        ) : latestReports.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">No research found</div>
                        ) : (
                            <div className="divide-y divide-[#1e2738]">
                                {allReports.map((item) => (
                                    <div
                                        key={item.id}
                                        className="grid grid-cols-12 gap-4 px-4 py-4 hover:bg-[#1a2332] transition-colors cursor-pointer"
                                        onClick={() => window.open(`/research/${item.id}`, '_blank')}
                                    >
                                        {/* Title */}
                                        <div className="col-span-5">
                                            <h3 className="text-sm font-semibold text-white mb-1 line-clamp-2">
                                                {item.title}
                                            </h3>
                                        </div>
                                        {/* Author */}
                                        <div className="col-span-2 flex items-center">
                                            <span className="text-sm text-gray-300">{item.author || 'Unknown'}</span>
                                        </div>
                                        {/* Published */}
                                        <div className="col-span-2 flex items-center">
                                            <span className="text-sm text-gray-400">
                                                {item.publishedAt
                                                    ? new Date(item.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                                    : new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                        </div>
                                        {/* Tags */}
                                        <div className="col-span-3 flex items-center gap-2 flex-wrap">
                                            {Array.isArray(item.tags) && item.tags.length > 0 ? (
                                                item.tags.map((tag: string, idx: number) => (
                                                    <span
                                                        key={idx}
                                                        className="px-2 py-1 rounded-full bg-violet-500/20 text-xs text-violet-300 border border-violet-500/30"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))
                                            ) : typeof item.tags === 'string' && item.tags.trim() ? (
                                                item.tags.split(',').map((tag, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="px-2 py-1 rounded-full bg-violet-500/20 text-xs text-violet-300 border border-violet-500/30"
                                                    >
                                                        {tag.trim()}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-xs text-gray-500">-</span>
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
        </div>
    )
}
