import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { PlaceholderCard } from "./PlaceholderCard"
import { fetchResearchArticles } from "@/services/news-api"
import type { ResearchItem } from "@/types/news"

function ResearchItemCard({ item }: { item: ResearchItem }) {
    const navigate = useNavigate()
    
    return (
      <div 
        onClick={() => navigate(`/research/${item.id}`)}
        className="flex items-center gap-3 p-2 h-20 bg-[#181b28] hover:bg-[#1a2332] rounded border border-[#1e2738] cursor-pointer transition-colors"
      >
        <div className="w-25 h-full bg-[#1a2332] rounded flex items-center justify-center text-xs text-gray-500">
          IMG
        </div>
        <div className="flex flex-col py-1 justify-between h-full flex-1">
          <h4 className="text-sm text-white font-bold">{item.title}</h4>
          <p className="text-xs text-gray-500">👤 {item.author}</p>
        </div>
      </div>
    )
}

export function ResearchCard() {
  const [researchItems, setResearchItems] = useState<ResearchItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadResearch() {
      try {
        setLoading(true)
        const data = await fetchResearchArticles()
        setResearchItems(data)
      } catch (error) {
        console.error("Failed to fetch research articles:", error)
      } finally {
        setLoading(false)
      }
    }

    loadResearch()
  }, [])

  return (
    <PlaceholderCard title="Research">
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500 text-sm">Loading research articles...</p>
        </div>
      ) : (
        <div className="space-y-3 overflow-y-auto h-full no-scrollbar">
          {researchItems.map((item, index) => (
            <ResearchItemCard key={index} item={item} />
          ))}
        </div>
      )}
    </PlaceholderCard>
  )
}
