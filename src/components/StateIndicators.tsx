export function LoadingState() {
  return (
    <div className="px-4 py-8 flex items-center justify-center">
      <div className="text-xs text-gray-500">Loading news...</div>
    </div>
  )
}

export function EmptyState() {
  return (
    <div className="px-4 py-8 flex flex-col items-center justify-center gap-2">
      <div className="text-xs text-gray-500">No news found.</div>
      <div className="text-xs text-gray-600">Try adjusting your filters.</div>
    </div>
  )
}
