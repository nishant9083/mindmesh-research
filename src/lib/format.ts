/**
 * Date and sentiment utility functions
 */

export function formatDate(unixSeconds: number): string {
  return new Date(unixSeconds * 1000).toLocaleDateString()
}

export function formatTimeAgo(unixSeconds: number): string {
  const now = Date.now()
  const date = unixSeconds * 1000
  const diffMs = Math.max(0, now - date)
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  if (diffHours < 1) return "Now"
  if (diffHours < 24) return `${diffHours}h`
  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays}d`
}

export function getSentimentClasses(sentiment: string): string {
  const upper = sentiment.toUpperCase()
  if (upper === "POSITIVE") return "bg-emerald-900/60 text-emerald-300 border border-emerald-500/40"
  if (upper === "NEGATIVE") return "bg-red-900/60 text-red-300 border border-red-500/40"
  if (upper === "NEUTRAL") return "bg-slate-800 text-slate-200 border border-slate-500/40"
  return "bg-slate-800 text-slate-200 border border-slate-500/40"
}
