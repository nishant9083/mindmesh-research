import { ExternalLink, User, Globe, Link2 } from "lucide-react"
import type { NewsItem } from "@/types/news"
import { formatTimeAgo, getSentimentClasses } from "@/lib/format"

interface NewsDetailPanelProps {
  selectedNews: NewsItem | null
  onClose: () => void
}

export function NewsDetailPanel({ selectedNews, onClose }: NewsDetailPanelProps) {
  if (!selectedNews) return null
  console.log(selectedNews)

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Right-side detail panel */}
      <div className="fixed inset-y-0 right-0 w-1/2 bg-[#0f111b] border-l border-[#1e2738] z-50 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Close button */}
        <button
          type="button"
          className="absolute top-4 right-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#1a2332] text-gray-400 hover:text-white hover:bg-[#2a3548]"
          onClick={onClose}
        >
          <span className="text-3xl font-bold">×</span>
        </button>

        {/* Header Content with Thumbnail */}
        <div className="px-6 py-15 border-b border-[#1e2738]">
          <div className="flex gap-4">
            {/* Thumbnail Image */}
            <div className="shrink-0">
              {selectedNews.imageUrl ? (
                <div className="w-56 h-32 rounded-lg overflow-hidden bg-[#1a2332] border border-[#2a3548]">
                  <img
                    src={selectedNews.imageUrl}
                    alt={selectedNews.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = "none"
                      target.parentElement!.innerHTML = `<div class="w-full h-full flex items-center justify-center"><svg class="h-8 w-8 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg></div>`
                    }}
                  />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-lg bg-linear-to-br from-[#1a2332] to-[#0d1421] border border-[#2a3548] flex items-center justify-center">
                  <Globe className="h-8 w-8 text-gray-600" />
                </div>
              )}
            </div>

            {/* Title and Meta */}
            <div className="flex-1 min-w-0">

              {/* Title */}
              <h2 className="text-xl font-bold leading-tight text-white line-clamp-2 mb-2">
                {selectedNews.title}
              </h2>

              {/* Meta info row */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400 mt-1">
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>{selectedNews.authors || "Unknown"}</span>
                </div>
                <span className="text-gray-600">•</span>
                <div className="flex items-center gap-1">
                  <Globe className="h-3 w-3" />
                  <span className="uppercase">{selectedNews.lang}</span>
                </div>
              </div>

              {/* Sentiment & Categories */}
              <div className="flex flex-wrap items-center gap-2 mt-4 mb-2">
                <span
                  className={`text-xs px-2.5 py-1 uppercase tracking-wide font-medium ${getSentimentClasses(
                    selectedNews.sentiment
                  )}`}
                >
                  {selectedNews.sentiment}
                </span>
                {selectedNews.categoryData?.length > 0 && (
                  <>
                    {selectedNews.categoryData.slice(0, 2).map((cat) => (
                      <span
                        key={cat.id}
                        className="px-2 py-0.5 rounded-full bg-violet-500/20 text-xs text-violet-300 border border-violet-500/30"
                      >
                        {cat.category}
                      </span>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>


          {/* Subtitle */}
          {selectedNews.subtitle && (
            <p className="text-sm text-gray-400 leading-relaxed mt-3">
              {selectedNews.subtitle}
            </p>
          )}

          {/* Engagement Stats */}
          <div className="flex items-center gap-3 mt-4 pt-3 border-t border-[#1e2738]">
            {/* <div className="text-xs text-gray-500 bg-[#1a2332] px-2 py-1 rounded">
              Score: <span className="text-white font-medium">{selectedNews.score}</span>
            </div> */}
            <span className="text-sm text-gray-200">{formatTimeAgo(selectedNews.publishedOn)}</span>
            <span className="text-gray-200">•</span>
            <a
              href={selectedNews.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-xs text-blue-400! hover:text-blue-300 transition-colors bg-blue-500/10 px-3 py-1.5 rounded-full border border-blue-400/30 hover:border-blue-400/50"
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
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <span className="w-1 h-4 bg-blue-400! rounded-full" />
              Summary
            </h3>
            {selectedNews.aiSummary ? (
              <ul className="text-sm leading-relaxed text-gray-300 space-y-1 pl-6">
                {selectedNews.aiSummary
                  .split(/\n+/)
                  .filter((line) => line.trim().startsWith('•'))
                  .map((line, idx) => (
                    <li
                      key={idx}
                      className="list-disc list-inside"
                      style={{ textIndent: '-1.2em', paddingLeft: '1.2em', whiteSpace: 'pre-line' }}
                    >
                      {line.replace(/^•\s*/, '')}
                    </li>
                  ))}
              </ul>
            ) : (
              <p className="text-sm leading-relaxed text-gray-300 whitespace-pre-line">
                {selectedNews.body}
              </p>
            )}
          </div>

          {/* Article Details */}
          {/* <div className="space-y-3">
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
          </div> */}

          {/* All Categories */}
          {selectedNews.categoryData?.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <span className="w-1 h-4 bg-blue-400! rounded-full" />
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
  )
}
