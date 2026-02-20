import { useEffect, useState } from "react"
import { PlaceholderCard } from "./PlaceholderCard"
import { fetchLatestDailyRecap } from "@/services/daily-recap-api"

export function DailyRecapCard() {
  const [recap, setRecap] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const data = await fetchLatestDailyRecap()
        setRecap(data)
      } catch (error) {
        console.error("Failed to fetch daily recap:", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  return (
    <PlaceholderCard title="Daily Recap">
      <div className="max-h-full overflow-y-auto">
      {loading ? (
        <div className="text-gray-500 text-sm">Loading...</div>
      ) : recap ? (
        <div className="space-y-3">
        <div className="flex py-2 items-center gap-1 text-sm text-gray-300 pb-2 border-b border-gray-800">
          <span className="text-xl text-blue-300">✦</span>
          <span>{recap.recapDate}</span>
        </div>
        <ul className="space-y-2 text-sm text-gray-300">
          {recap.summary
          .split(/\n+/)
          .filter((line: string) => line.trim().startsWith('•'))
          .map((line: string, idx: number) => (
            <li className="flex gap-2" key={idx}>
            <span>•</span>
            <span>{line.replace(/^•\s*/, '')}</span>
            </li>
          ))}
        </ul>
        </div>
      ) : (
        <div className="text-gray-500 text-sm">No recap available.</div>
      )}
      </div>
    </PlaceholderCard>
  )
}