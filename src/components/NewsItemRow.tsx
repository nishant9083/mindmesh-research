import type { NewsItem } from "@/types/news"
import { formatTimeAgo, getSentimentClasses } from "@/lib/format"

interface NewsItemRowProps {
  news: NewsItem
  onClick?: () => void
}

export function NewsItemRow({ news, onClick }: NewsItemRowProps) {
  const primaryCategory = news.categoryData?.[0]?.category
  const sentiment = news.sentiment

  return (
    <div
      className="px-4 py-3 hover:bg-[#1a2332] cursor-pointer border-b border-[#1e2738] last:border-b-0 group"
      onClick={onClick}
    >
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm text-gray-200 leading-snug group-hover:text-white transition-colors line-clamp-2">
            {news.title}
          </h3>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className="text-xs text-gray-500">{formatTimeAgo(news.publishedOn)}</span>
            <span className="text-xs text-gray-500">·</span>
            <span className="text-xs text-gray-400">{news.sourceData.NAME}</span>
            {primaryCategory && (
              <>
                <span className="text-xs text-gray-500">·</span>
                <span className="text-xs text-violet-300">{primaryCategory}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            {news.authors && (
              <span className="text-xs text-gray-500 truncate max-w-35">{news.authors}</span>
            )}
            {sentiment && (
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full uppercase tracking-wide ${getSentimentClasses(
                  sentiment
                )}`}
              >
                {sentiment}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
