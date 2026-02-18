import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { fetchResearchArticles, fetchNews } from "@/services/news-api"
import type { ResearchItem, NewsItem } from "@/types/news"
import { ChevronRight } from "lucide-react"

// Dummy spotlight data
const spotlightData = {
    category: "DeAI",
    date: "Dec 2, 2025",
    title: "State of AI",
    author: "Messari",
    imageUrl: "/api/placeholder/400/300" // You can replace with actual image
}

// Dummy trending assets data
const trendingAssets = [
    { name: "Kalshi", description: "Polymarket's Best Growth Path", category: "Prediction Markets", author: "Austin Weiler", date: "Jan 16, 2026", color: "#10b981" },
    { name: "TRON", description: "State of TRON Q4 2025", category: "Layer-1", author: "Jeremy Koch", date: "Jan 20, 2026", color: "#ef4444" },
    { name: "Aave", description: "Fear, Uncertainty, and DAOS: $AAVE DAO vs. Aave Labs", category: "Enterprise", subcategory: "Note", authors: "Chris Davis, Sam Ruskin", date: "Dec 27, 2025", color: "#8b5cf6" },
]

export function ResearchPage() {
    const navigate = useNavigate()
    const [latestReports, setLatestReports] = useState<ResearchItem[]>([])
    const [newsletters, setNewsletters] = useState<NewsItem[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true)
                const [reports, news] = await Promise.all([
                    fetchResearchArticles(),
                    fetchNews({})
                ])
                setLatestReports(reports.slice(0, 6)) // Get first 6 reports
                setNewsletters(news.slice(0, 8)) // Get first 8 news items
            } catch (error) {
                console.error("Failed to fetch research data:", error)
            } finally {
                setLoading(false)
            }
        }

        loadData()
    }, [])

    return (
        <div className="h-full overflow-y-auto bg-[#060709]">
            <div className="mx-auto px-8 py-8">
                {/* Header */}
                <div className="mb-8 pb-4 border-b-2 border-gray-900">
                    <h2 className="text-3xl font-bold text-white">Messari Research</h2>
                </div>

                {/* Four Column Section */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12">
                    {/* Research Spotlight */}
                    <div className="space-y-4">
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
                            {/* Image placeholder with blue gradient pattern */}
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
                    </div>

                    {/* Latest Reports - Spans 2 columns */}
                    <div className="space-y-4 lg:col-span-2">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Latest Reports
                            </h2>
                            <button className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
                                View All <ChevronRight className="w-4 h-4" />
                            </button>
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
                                        <div className="w-32 h-full bg-[#1a2332] rounded flex items-center justify-center text-xs text-gray-500">
                                            IMG
                                        </div>
                                        <div className="flex flex-col py-1 justify-between h-full flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs text-gray-500">
                                                    {new Date(report.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
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
                            <button className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
                                View All <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-3">
                            {trendingAssets.map((asset, index) => (
                                <div
                                    key={index}
                                    className="bg-[#0f1118] border border-[#1e2738] rounded-lg p-4 hover:border-[#2a3548] transition-colors cursor-pointer"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-2">
                                                {/* Asset icon */}
                                                <div
                                                    className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-xs text-white font-bold"
                                                    style={{ backgroundColor: asset.color }}
                                                >
                                                    {asset.name.substring(0, 1)}
                                                </div>
                                                <span className="text-xs text-gray-500">{asset.name}</span>
                                                <span className="text-xs text-gray-600">•</span>
                                                <span className="text-xs text-gray-500">{asset.date}</span>
                                            </div>
                                            <h3 className="text-sm font-semibold text-white mb-1 line-clamp-2">{asset.description}</h3>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="text-xs text-gray-400">{asset.category}</span>
                                                {asset.subcategory && (
                                                    <>
                                                        <span className="text-xs text-gray-600">•</span>
                                                        <span className="text-xs text-gray-400">{asset.subcategory}</span>
                                                    </>
                                                )}
                                                <span className="text-xs text-gray-600">•</span>
                                                <span className="text-xs text-gray-400">📝 {asset.authors || asset.author}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
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
                            <button className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
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
            </div>
        </div>
    )
}
