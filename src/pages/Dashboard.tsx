import { useState } from "react"
import { NewsCard } from "@/components/NewsCard"
import { PricesChartCard } from "@/components/PricesChartCard"
import { MarketOverviewCard } from "@/components/MarketOverviewCard"
import { DailyRecapCard } from "@/components/DailyRecapCard"
import { ResearchCard } from "@/components/ResearchCard"
import { MindshareCard } from "@/components/MindshareCard"
import type { NewsItem } from "@/types/news"
import { ExternalLink, User, Globe, Link2, Calendar } from "lucide-react"
import { formatDate, getSentimentClasses } from "@/lib/format"

export function Dashboard() {
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null)

  return (
    <div className="h-screen bg-[#060709] p-4 overflow-hidden">
      <div className="flex h-full gap-4">
        {/* LEFT SECTION: Prices & Chart on top, Daily Recap + Research + Mindshare below */}
        <div className="flex-1 flex flex-col gap-4 h-full min-h-0">
          {/* Top: Prices & Chart (roughly 60% height of left section) */}
          <div className="h-[50%] min-h-0">
            <PricesChartCard />
          </div>

          {/* Bottom: three cards sharing remaining ~40% height */}
          <div className="h-[50%] min-h-0 flex gap-4">
            <div className="h-full flex-1 min-w-0">
              <DailyRecapCard />
            </div>
            <div className="h-full flex-1 min-w-0">
              <ResearchCard />
            </div>
            <div className="h-full flex-1 min-w-0">
              <MindshareCard />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Market Overview (20% height) + News (80% height) */}
        <div className="w-[25%] h-full min-h-0 flex flex-col gap-4">
          <div className="h-[20%] min-h-0">
            <MarketOverviewCard />
          </div>
          <div className="h-[80%] min-h-0">
            <NewsCard onNewsClick={setSelectedNews} />
          </div>
        </div>
      </div>

      {selectedNews && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={() => setSelectedNews(null)}
          />

          {/* Right-side detail panel */}
          <div className="fixed inset-y-0 right-0 w-1/2 bg-[#0d1421] border-l border-[#1e2738] z-50 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            {/* Close button */}
            <button
              type="button"
              className="absolute top-4 right-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#1a2332] text-gray-400 hover:text-white hover:bg-[#2a3548]"
              onClick={() => setSelectedNews(null)}
            >
              <span className="text-3xl font-bold">×</span>
            </button>

            {/* Hero Image */}
            {selectedNews.imageUrl ? (
              <div className="relative w-full h-56 shrink-0 overflow-hidden">
                <img
                  src={selectedNews.imageUrl}
                  alt={selectedNews.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none"
                  }}
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#0d1421] via-transparent to-transparent" />
              </div>
            ) : (
              <div className="w-full h-32 shrink-0 bg-linear-to-br from-[#1a2332] to-[#0d1421] flex items-center justify-center">
                <Globe className="h-12 w-12 text-gray-600" />
              </div>
            )}

            {/* Header Content */}
            <div className="px-6 py-4 border-b border-[#1e2738] -mt-8 relative z-10">
              {/* Sentiment & Categories */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span
                  className={`text-xs px-2.5 py-1  uppercase tracking-wide font-medium ${getSentimentClasses(
                    selectedNews.sentiment
                  )}`}
                >
                  {selectedNews.sentiment}
                </span>
                {selectedNews.categoryData?.length > 0 && (
                  <>
                    {selectedNews.categoryData.slice(0, 4).map((cat) => (
                      <span
                        key={cat.id}
                        className="px-2 py-1 rounded-full bg-violet-500/20 text-xs text-violet-300 border border-violet-500/30"
                      >
                        {cat.category}
                      </span>
                    ))}
                  </>
                )}
              </div>

              {/* Title */}
              <h2 className="text-xl font-bold leading-tight text-white mb-2">
                {selectedNews.title}
              </h2>

              {/* Subtitle */}
              {selectedNews.subtitle && (
                <p className="text-sm text-gray-400 leading-relaxed mb-3">
                  {selectedNews.subtitle}
                </p>
              )}

              {/* Meta info row */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
                <div className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" />
                  <span>{selectedNews.authors || "Unknown"}</span>
                </div>
                <span className="text-gray-600">•</span>
                <div className="flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5" />
                  <span className="uppercase">{selectedNews.lang}</span>
                </div>
              </div>

              {/* Engagement Stats */}
              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-[#1e2738]">
                <div className="text-xs text-gray-500 bg-[#1a2332] px-2 py-1 rounded">
                  Score: <span className="text-white font-medium">{selectedNews.score}</span>
                </div>
                <a
                  href={selectedNews.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 transition-colors bg-violet-500/10 px-3 py-1.5 rounded-full border border-violet-500/30 hover:border-violet-500/50"
                >
                  <Link2 className="h-3.5 w-3.5" />
                  <span>Read Full Article</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              {/* Summary Section */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <span className="w-1 h-4 bg-violet-500 rounded-full" />
                  Summary
                </h3>
                <p className="text-sm leading-relaxed text-gray-300 whitespace-pre-line">
                  {selectedNews.body}
                </p>
              </div>

              {/* Article Details */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <span className="w-1 h-4 bg-violet-500 rounded-full" />
                  Article Details
                </h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-[#1a2332] rounded-lg p-3 space-y-1">
                    <span className="text-gray-500">Article ID</span>
                    <p className="text-white font-mono">{selectedNews.id}</p>
                  </div>
                  <div className="bg-[#1a2332] rounded-lg p-3 space-y-1">
                    <span className="text-gray-500">Source ID</span>
                    <p className="text-white">{selectedNews.sourceId}</p>
                  </div>
                  <div className="bg-[#1a2332] rounded-lg p-3 space-y-1">
                    <span className="text-gray-500">Status</span>
                    <p className="text-white capitalize">{selectedNews.status}</p>
                  </div>
                  <div className="bg-[#1a2332] rounded-lg p-3 space-y-1">
                    <span className="text-gray-500 flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> Published
                    </span>
                    <p className="text-white">{formatDate(selectedNews.publishedOn)}</p>
                  </div>
                  {selectedNews.updatedOn && (
                    <div className="bg-[#1a2332] rounded-lg p-3 space-y-1 col-span-2">
                      <span className="text-gray-500 flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> Last Updated
                      </span>
                      <p className="text-white">{formatDate(selectedNews.updatedOn)}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* All Categories */}
              {selectedNews.categoryData?.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <span className="w-1 h-4 bg-violet-500 rounded-full" />
                    All Categories
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedNews.categoryData.map((cat) => (
                      <div
                        key={cat.id}
                        className="px-3 py-2 rounded-lg bg-[#1a2332] border border-[#2a3548] text-xs"
                      >
                        <span className="text-white">{cat.category}</span>
                        <span className="text-gray-500 ml-2">({cat.name})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
