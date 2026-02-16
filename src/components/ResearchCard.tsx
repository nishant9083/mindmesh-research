import { PlaceholderCard } from "./PlaceholderCard"

interface ResearchItem {
  id: number
  title: string
  author: string
  imageUrl?: string
  featured?: boolean
}

const researchItems: ResearchItem[] = [
  { id: 1, title: "Crypto Venture Weekly: Feb. 9-13, 2026", author: "Alice Hou", featured: true },
  { id: 2, title: "Fuse: The Energy Network and TGE", author: "Matthew Nay" },
  { id: 3, title: "In The Stables: CLARITY Act Hits Wall Over Yield", author: "Alexander Beaudry" },
  { id: 4, title: "In The Stables: CLARITY Act Hits Wall Over Yield", author: "Alexander Beaudry" },
  { id: 5, title: "In The Stables: CLARITY Act Hits Wall Over Yield", author: "Alexander Beaudry" },
  { id: 6, title: "In The Stables: CLARITY Act Hits Wall Over Yield", author: "Alexander Beaudry" },
]

function ResearchItemCard({ item }: { item: ResearchItem }) {
    return (
      <div className="flex items-center gap-3 p-2 h-20 bg-[#181b28] hover:bg-[#1a2332] rounded border border-[#1e2738] cursor-pointer">
        <div className="w-25 h-full bg-[#1a2332] rounded flex items-center justify-center text-xs text-gray-500">
          {item.imageUrl ? (
            <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover rounded" />
          ) : (
            "IMG"
          )}
        </div>
        <div className="flex flex-col py-1 justify-between h-full flex-1">
          <h4 className="text-sm text-white font-bold">{item.title}</h4>
          <p className="text-xs text-gray-500">👤 {item.author}</p>
        </div>
      </div>
    )
}

export function ResearchCard() {
  return (
    <PlaceholderCard title="Research">
      <div className="space-y-3 overflow-y-auto h-full no-scrollbar">
        {researchItems.map((item) => (
          <ResearchItemCard key={item.id} item={item} />
        ))}
      </div>
    </PlaceholderCard>
  )
}
