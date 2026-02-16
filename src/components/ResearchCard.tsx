import { PlaceholderCard } from "./PlaceholderCard"

export function ResearchCard() {
  return (
    <PlaceholderCard title="Research">
      <div className="space-y-3">
        <div className="flex items-center gap-3 p-2 hover:bg-[#1a2332] rounded cursor-pointer">
          <div className="w-12 h-12 bg-[#1a2332] rounded flex items-center justify-center text-xs text-gray-500">
            IMG
          </div>
          <div className="flex-1">
            <h4 className="text-sm text-white">Crypto Venture Weekly: Feb. 9-13, 2026</h4>
            <p className="text-xs text-gray-500 mt-1">👤 Alice Hou</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-2 hover:bg-[#1a2332] rounded cursor-pointer">
          <div className="w-12 h-12 bg-[#1a2332] rounded flex items-center justify-center text-xs text-gray-500">
            IMG
          </div>
          <div className="flex-1">
            <h4 className="text-sm text-white">Fuse: The Energy Network and TGE</h4>
            <p className="text-xs text-gray-500 mt-1">👤 Matthew Nay</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-2 hover:bg-[#1a2332] rounded cursor-pointer">
          <div className="w-12 h-12 bg-[#1a2332] rounded flex items-center justify-center text-xs text-gray-500">
            IMG
          </div>
          <div className="flex-1">
            <h4 className="text-sm text-white">In The Stables: CLARITY Act Hits Wall Over Yield</h4>
            <p className="text-xs text-gray-500 mt-1">👤 Alexander Beaudry</p>
          </div>
        </div>
      </div>
    </PlaceholderCard>
  )
}
