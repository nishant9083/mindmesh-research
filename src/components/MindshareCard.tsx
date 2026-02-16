import { PlaceholderCard } from "./PlaceholderCard"
import { useState } from "react"

const assets = [
  { rank: 1, symbol: "SNX", mindshare: "20.13%", change: "↑6,345%", positive: true, icon: "⚡" },
  { rank: 2, symbol: "0G", mindshare: "1.63%", change: "↑4,584%", positive: true, icon: "∞" },
  { rank: 3, symbol: "MELANIA", mindshare: "0.58%", change: "↑1,217%", positive: true, icon: "👤" },
  { rank: 4, symbol: "SKR", mindshare: "0.27%", change: "↑427.95%", positive: true, icon: "S" },
  { rank: 5, symbol: "RENDER", mindshare: "0.14%", change: "↑344.94%", positive: true, icon: "◉" },
  { rank: 6, symbol: "SENT", mindshare: "0.13%", change: "↑302.02%", positive: true, icon: "⚡" },
  { rank: 7, symbol: "HTX", mindshare: "0.12%", change: "↑94.59%", positive: true, icon: "🔥" },
  { rank: 8, symbol: "RIVER", mindshare: "0.29%", change: "↑90.92%", positive: true, icon: "S" },
  { rank: 9, symbol: "ZRO", mindshare: "0.13%", change: "↑64.72%", positive: true, icon: "0" },
  { rank: 10, symbol: "WIF", mindshare: "0.13%", change: "↑62.30%", positive: true, icon: "🐕" },
]

const sectors = [
  { rank: 1, name: "DeFi", mindshare: "29.8%", change: "↑187.77%", positive: true },
  { rank: 2, name: "Blockchain Services", mindshare: "0.12%", change: "↑70.31%", positive: true },
  { rank: 3, name: "Meme", mindshare: "3.59%", change: "↑18.61%", positive: true },
  { rank: 4, name: "DePIN", mindshare: "1.25%", change: "↑9.18%", positive: true },
  { rank: 5, name: "Networks", mindshare: "28.16%", change: "↓13.50%", positive: false },
  { rank: 6, name: "NFTs", mindshare: "2.01%", change: "↓16.02%", positive: false },
  { rank: 7, name: "CeFi", mindshare: "4.78%", change: "↓16.34%", positive: false },
  { rank: 8, name: "Stablecoins", mindshare: "5.21%", change: "↓19.73%", positive: false },
  { rank: 9, name: "AI", mindshare: "5.91%", change: "↓27.30%", positive: false },
  { rank: 10, name: "Gaming", mindshare: "0.95%", change: "↓30.08%", positive: false },
]

const kols = [
  { rank: 1, name: "CZ 🔶 BNB", handle: "@cz_binance", mindshare: "0.03%", change: "↓22.42%", positive: false },
  { rank: 2, name: "Ferre", handle: "@FerreWeb3", mindshare: "0.03%", change: "↓24.30%", positive: false },
  { rank: 3, name: "wale.moca 🐋", handle: "@waleswoosh", mindshare: "0.03%", change: "↓23.81%", positive: false },
  { rank: 4, name: "THΞGABO🙏", handle: "@thegaboeth", mindshare: "0.03%", change: "↓24.71%", positive: false },
  { rank: 5, name: "Saul", handle: "@SaulWomi", mindshare: "0.03%", change: "↓22.09%", positive: false },
]

type TabType = "Assets" | "Sectors" | "KOLs"

export function MindshareCard() {
  const [activeTab, setActiveTab] = useState<TabType>("Assets")

  const getRankIcon = (rank: number) => {
    if (rank === 1) return "🥇"
    if (rank === 2) return "🥈"
    if (rank === 3) return "🥉"
    return rank.toString()
  }

  return (
    <PlaceholderCard title="Mindshare">
      <div className="space-y-1">
        <div className="flex gap-2 mb-3">
          {(["Assets", "Sectors", "KOLs"] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-xs px-3 py-1.5 rounded border ${
                activeTab === tab
                  ? "bg-[#1a2332] text-white border-gray-600"
                  : "text-gray-500 border-transparent hover:text-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "Assets" && (
          <>
            <div className="grid grid-cols-4 text-xs text-gray-500 py-1 border-b border-gray-700">
              <span>#</span>
              <span>Asset</span>
              <span>Mindshare %</span>
              <span>1M</span>
            </div>
            {assets.map((asset) => (
              <div
                key={asset.rank}
                className="grid grid-cols-4 text-xs py-1.5 hover:bg-[#1a2332] cursor-pointer rounded items-center"
              >
                <span className="text-yellow-500">{getRankIcon(asset.rank)}</span>
                <span className="text-white flex items-center gap-1">
                  <span>{asset.icon}</span> {asset.symbol}
                </span>
                <span className="text-white">{asset.mindshare}</span>
                <span className="text-green-400">{asset.change}</span>
              </div>
            ))}
          </>
        )}

        {activeTab === "Sectors" && (
          <>
            <div className="grid grid-cols-4 text-xs text-gray-500 py-1 border-b border-gray-700">
              <span>#</span>
              <span>Sector</span>
              <span>Mindshare %</span>
              <span>1M</span>
            </div>
            {sectors.map((sector) => (
              <div
                key={sector.rank}
                className="grid grid-cols-4 text-xs py-1.5 hover:bg-[#1a2332] cursor-pointer rounded items-center"
              >
                <span className="text-yellow-500">{getRankIcon(sector.rank)}</span>
                <span className="text-white">{sector.name}</span>
                <span className="text-white">{sector.mindshare}</span>
                <span className={sector.positive ? "text-green-400" : "text-red-400"}>
                  {sector.change}
                </span>
              </div>
            ))}
          </>
        )}

        {activeTab === "KOLs" && (
          <>
            <div className="grid grid-cols-3 text-xs text-gray-500 py-1 border-b border-gray-700">
              <span></span>
              <span>Mindshare</span>
              <span></span>
            </div>
            {kols.map((kol) => (
              <div
                key={kol.rank}
                className="grid grid-cols-3 text-xs py-2 hover:bg-[#1a2332] cursor-pointer rounded items-center"
              >
                <span className="text-yellow-500">{getRankIcon(kol.rank)}</span>
                <div className="flex flex-col">
                  <span className="text-white font-medium">{kol.name}</span>
                  <span className="text-gray-500 text-[10px]">{kol.handle}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-white">{kol.mindshare}</span>
                  <span className={kol.positive ? "text-green-400" : "text-red-400"}>
                    {kol.change}
                  </span>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </PlaceholderCard>
  )
}
