import { Calendar } from "lucide-react"
import type { DailyRecap } from "@/types/news"

interface DailyRecapDetailPanelProps {
    selectedRecap: DailyRecap | null
    onClose: () => void
}

export function DailyRecapDetailPanel({ selectedRecap, onClose }: DailyRecapDetailPanelProps) {
    if (!selectedRecap) return null

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
                className="fixed inset-0 bg-black/20 z-40"
                onClick={onClose}
            />

            {/* Right-side detail panel */}
            <div className="fixed inset-y-0 right-0 w-1/2 pt-10 max-w-2xl bg-[#0d1421] border-l border-[#1e2738] z-50 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
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
                        {selectedRecap.recapDate}
                    </div>

                    {/* Updated time */}
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <span className="text-blue-400">(●)</span>
                        <span>Updated {getTimeAgo(selectedRecap.updatedAt)}</span>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 mt-10">
                    {/* AI Summary Bullets */}
                    <ul className="space-y-4">
                        <ul className="text-sm leading-relaxed text-gray-300 space-y-1 pl-6">
                            {selectedRecap.summary
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

                    </ul>
                </div>
            </div>
        </>
    )
}
