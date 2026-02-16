import { PlaceholderCard } from "./PlaceholderCard"

const assets = [
  { rank: 1, symbol: "SNX", mindshare: "18.14%", change: "+6,743%", positive: true },
  { rank: 2, symbol: "OG", mindshare: "1.46%", change: "+3,743%", positive: true },
  { rank: 3, symbol: "MELANIA", mindshare: "0.56%", change: "+662.59%", positive: true },
  { rank: 4, symbol: "SKR", mindshare: "0.27%", change: "+490.53%", positive: true },
  { rank: 5, symbol: "SENT", mindshare: "0.14%", change: "+361.26%", positive: true },
]

export function MindshareCard() {
  return (
    <PlaceholderCard title="Mindshare">
      <div className="space-y-1">
        <div className="flex gap-2 mb-3">
          <span className="text-xs bg-[#1a2332] px-2 py-1 rounded text-white">Assets</span>
          <span className="text-xs text-gray-500 px-2 py-1">Sectors</span>
          <span className="text-xs text-gray-500 px-2 py-1">KOLs</span>
        </div>
        <div className="grid grid-cols-4 text-xs text-gray-500 py-1">
          <span></span>
          <span>Asset</span>
          <span>Mindshare %</span>
          <span>1M</span>
        </div>
        {assets.map((asset) => (
          <div
            key={asset.rank}
            className="grid grid-cols-4 text-xs py-1.5 hover:bg-[#1a2332] cursor-pointer rounded"
          >
            <span className="text-gray-500">{asset.rank}</span>
            <span className="text-white">{asset.symbol}</span>
            <span className="text-white">{asset.mindshare}</span>
            <span className="text-green-400">{asset.change}</span>
          </div>
        ))}
      </div>
    </PlaceholderCard>
  )
}
