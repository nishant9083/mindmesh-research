import { ExternalLink, Calendar, Sparkles, ThumbsUp, ThumbsDown, ChevronDown, ChevronUp } from "lucide-react"
import type { DailyRecap } from "@/types/news"
import { useState } from "react"

interface DailyRecapDetailPanelProps {
  selectedRecap: DailyRecap | null
  onClose: () => void
}

export function DailyRecapDetailPanel({ selectedRecap, onClose }: DailyRecapDetailPanelProps) {
  const [expandedSources, setExpandedSources] = useState<number[]>([])

  if (!selectedRecap) return null

  const toggleSources = (index: number) => {
    setExpandedSources(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  // Format the updated time as "X minutes ago"
  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} minutes ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours} hours ago`
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays} days ago`
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Right-side detail panel */}
      <div className="fixed inset-y-0 right-0 w-1/2 max-w-xl bg-[#0d1421] border-l border-[#1e2738] z-50 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Close button */}
        <button
          type="button"
          className="absolute top-4 right-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#1a2332] text-gray-400 hover:text-white hover:bg-[#2a3548]"
          onClick={onClose}
        >
          <span className="text-3xl font-bold">×</span>
        </button>

        {/* Header */}
        <div className="px-6 py-6 border-b border-[#1e2738]">
          <h2 className="text-xl font-bold text-white mb-2">Daily News Recap</h2>
          
          {/* Date Display */}
          <div className="flex items-center gap-2 text-2xl font-semibold text-white mb-3">
            <Calendar className="h-5 w-5 text-blue-400" />
            {selectedRecap.displayDate}
          </div>

          {/* Updated time */}
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span className="text-blue-400">(●)</span>
            <span>Updated {getTimeAgo(selectedRecap.updatedAt)}</span>
          </div>

          {/* Powered by */}
          {/* <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
            <span>Powered by</span>
            <span className="flex items-center gap-1 text-blue-400">
              <Sparkles className="h-3 w-3" />
              MessariAI
            </span>
          </div> */}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {/* AI Summary Bullets */}
          <ul className="space-y-4">
            {selectedRecap.bullets.map((bullet, index) => (
              <li key={index} className="space-y-2">
                <div className="flex gap-3">
                  <span className="text-blue-400 mt-1 shrink-0">•</span>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {bullet.text}
                    {bullet.sources.length > 0 && (
                      <span className="text-blue-400 ml-1">{bullet.sources.length}</span>
                    )}
                  </p>
                </div>
                
                {/* Expandable Sources */}
                {bullet.sources.length > 0 && (
                  <div className="ml-6">
                    <button
                      onClick={() => toggleSources(index)}
                      className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 transition-colors"
                    >
                      {expandedSources.includes(index) ? (
                        <ChevronUp className="h-3 w-3" />
                      ) : (
                        <ChevronDown className="h-3 w-3" />
                      )}
                      {bullet.sources.length} Sources
                    </button>
                    
                    {expandedSources.includes(index) && (
                      <div className="mt-2 space-y-2">
                        {bullet.sources.map((source, srcIndex) => (
                          <a
                            key={srcIndex}
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-xs text-gray-400 hover:text-blue-400 transition-colors"
                          >
                            <ExternalLink className="h-3 w-3 shrink-0" />
                            <span className="truncate">{source.title}</span>
                            <span className="text-gray-600 shrink-0">— {source.sourceName}</span>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>

          {/* Update Notice */}
          <div className="mt-6 p-4 bg-[#1a2332] rounded-lg border border-[#2a3548]">
            <p className="text-sm text-gray-400 text-center">
              This daily recap will be updated throughout the day
            </p>
          </div>
        </div>

        {/* Footer - Feedback */}
        <div className="px-6 py-4 border-t border-[#1e2738]">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">How was this summary?</span>
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-[#1a2332] rounded-lg transition-colors">
                <ThumbsUp className="h-5 w-5 text-gray-400 hover:text-green-400" />
              </button>
              <button className="p-2 hover:bg-[#1a2332] rounded-lg transition-colors">
                <ThumbsDown className="h-5 w-5 text-gray-400 hover:text-red-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
