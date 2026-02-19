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

/**
 * Format currency values with appropriate decimals and symbols
 */
export function formatCurrency(
  value: number | null | undefined,
  currency: string = "USD",
  options?: {
    minimumFractionDigits?: number
    maximumFractionDigits?: number
    notation?: "standard" | "compact"
  }
): string {
  if (value === null || value === undefined || isNaN(value)) {
    return "N/A"
  }

  const {
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
    notation = "standard",
  } = options || {}

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
    notation,
  }).format(value)
}

/**
 * Format large numbers with K/M/B/T suffixes
 */
export function formatCompactNumber(
  value: number | null | undefined,
  decimals: number = 2
): string {
  if (value === null || value === undefined || isNaN(value)) {
    return "N/A"
  }

  const absValue = Math.abs(value)
  const sign = value < 0 ? "-" : ""

  if (absValue >= 1e12) {
    return `${sign}$${(absValue / 1e12).toFixed(decimals)}T`
  } else if (absValue >= 1e9) {
    return `${sign}$${(absValue / 1e9).toFixed(decimals)}B`
  } else if (absValue >= 1e6) {
    return `${sign}$${(absValue / 1e6).toFixed(decimals)}M`
  } else if (absValue >= 1e3) {
    return `${sign}$${(absValue / 1e3).toFixed(decimals)}K`
  } else {
    return `${sign}$${absValue.toFixed(decimals)}`
  }
}

/**
 * Format percentage change with + or - sign
 */
export function formatPercentage(
  value: number | null | undefined,
  decimals: number = 2,
  showSign: boolean = true
): string {
  if (value === null || value === undefined || isNaN(value)) {
    return "N/A"
  }

  const sign = showSign && value > 0 ? "+" : ""
  return `${sign}${value.toFixed(decimals)}%`
}

/**
 * Format supply numbers (without currency symbol)
 */
export function formatSupply(
  value: number | null | undefined,
  decimals: number = 0
): string {
  if (value === null || value === undefined || isNaN(value)) {
    return "N/A"
  }

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

/**
 * Format compact supply with K/M/B/T suffixes (without currency)
 */
export function formatCompactSupply(
  value: number | null | undefined,
  decimals: number = 2
): string {
  if (value === null || value === undefined || isNaN(value)) {
    return "N/A"
  }

  const absValue = Math.abs(value)

  if (absValue >= 1e12) {
    return `${(absValue / 1e12).toFixed(decimals)}T`
  } else if (absValue >= 1e9) {
    return `${(absValue / 1e9).toFixed(decimals)}B`
  } else if (absValue >= 1e6) {
    return `${(absValue / 1e6).toFixed(decimals)}M`
  } else if (absValue >= 1e3) {
    return `${(absValue / 1e3).toFixed(decimals)}K`
  } else {
    return absValue.toFixed(decimals)
  }
}

/**
 * Format a full date from ISO string or timestamp
 */
export function formatFullDate(date: string | number): string {
  if (!date) return "N/A"

  const dateObj = typeof date === "string" ? new Date(date) : new Date(date)

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(dateObj)
}

/**
 * Format a date with time
 */
export function formatDateTime(date: string | number): string {
  if (!date) return "N/A"

  const dateObj = typeof date === "string" ? new Date(date) : new Date(date)

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(dateObj)
}

/**
 * Get color classes based on positive/negative value
 */
export function getChangeColor(
  value: number | null | undefined,
  options: { neutral?: string } = {}
): string {
  const { neutral = "text-gray-400" } = options

  if (value === null || value === undefined || isNaN(value)) {
    return neutral
  }

  if (value > 0) {
    return "text-green-500"
  } else if (value < 0) {
    return "text-red-500"
  } else {
    return neutral
  }
}

/**
 * Get background color classes for percentage badges
 */
export function getChangeBgColor(
  value: number | null | undefined
): string {
  if (value === null || value === undefined || isNaN(value)) {
    return "bg-gray-500/10 text-gray-400"
  }

  if (value > 0) {
    return "bg-green-500/10 text-green-500"
  } else if (value < 0) {
    return "bg-red-500/10 text-red-500"
  } else {
    return "bg-gray-500/10 text-gray-400"
  }
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text
  return text.substring(0, maxLength) + "..."
}

/**
 * Format a number with thousands separators
 */
export function formatNumber(
  value: number | null | undefined,
  decimals: number = 0
): string {
  if (value === null || value === undefined || isNaN(value)) {
    return "N/A"
  }

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}
