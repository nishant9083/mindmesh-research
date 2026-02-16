import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card"
import { NewsCard } from "./NewsCard"
import type { NewsItem } from "@/types/news"
import { ExternalLink, Settings, Maximize2, User, Globe, Link2, Calendar } from "lucide-react"

// Placeholder Card Component
function PlaceholderCard({ 
  title, 
  children,
  className = "",
  showExternalLink = true 
}: { 
  title: string
  children?: React.ReactNode
  className?: string
  showExternalLink?: boolean
}) {
  return (
    <Card className={`bg-[#0d1421] border-[#1e2738] h-full py-0 ${className}`}>
      <CardHeader className="pb-3 pt-4 px-4 border-b border-[#1e2738]">
        <div className="flex items-center gap-2">
          <CardTitle className="text-white text-base font-medium">{title}</CardTitle>
          {showExternalLink && <ExternalLink className="h-3.5 w-3.5 text-gray-500" />}
        </div>
        <CardAction>
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-gray-500" />
            <Maximize2 className="h-4 w-4 text-gray-500" />
          </div>
        </CardAction>
      </CardHeader>
      <CardContent className="p-4">
        {children || (
          <div className="flex items-center justify-center h-32 text-gray-500 text-sm">
            {title} content coming soon...
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Prices & Chart Placeholder
function PricesChartCard() {
  const cryptoData = [
    { rank: 1, symbol: "BTC", name: "Bitcoin", price: "$70,041.83", change: "+4.94%", mcap: "$1.41T", positive: true },
    { rank: 2, symbol: "ETH", name: "Ethereum", price: "$2,079.37", change: "+6.85%", mcap: "$253B", positive: true },
    { rank: 3, symbol: "USDT", name: "Tether", price: "$1.000", change: "+0.02%", mcap: "$184B", positive: true },
    { rank: 4, symbol: "SOL", name: "Solana", price: "$86.55", change: "+8.89%", mcap: "$49.51B", positive: true },
    { rank: 5, symbol: "XRP", name: "XRP", price: "$1.46", change: "+7.77%", mcap: "$89.49B", positive: true },
    { rank: 6, symbol: "BNB", name: "BNB", price: "$629.34", change: "+5.47%", mcap: "$86.29B", positive: true },
    { rank: 7, symbol: "USDC", name: "USDC", price: "$1.00", change: "-0.039%", mcap: "$73.48B", positive: false },
    { rank: 8, symbol: "SOL", name: "Solana", price: "$86.55", change: "+8.89%", mcap: "$49.51B", positive: true },
  ]

  return (
    <Card className="bg-[#0d1421] border-[#1e2738] h-full py-0">
      <CardHeader className="pb-3 pt-4 px-4 border-b border-[#1e2738]">
        <CardTitle className="text-white text-base font-medium">Prices & Chart</CardTitle>
        <CardAction>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span className="px-2 py-1 bg-[#1a2332] rounded">12H</span>
            <span className="px-2 py-1 bg-[#2563eb] rounded text-white">1D</span>
            <span className="px-2 py-1 bg-[#1a2332] rounded">1W</span>
            <span className="px-2 py-1 bg-[#1a2332] rounded">1M</span>
          </div>
        </CardAction>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex">
          {/* Table */}
          <div className="w-1/2 border-r border-[#1e2738]">
            <div className="grid grid-cols-4 text-xs text-gray-500 px-3 py-2 border-b border-[#1e2738]">
              <span>#</span>
              <span>Asset</span>
              <span>Price</span>
              <span>1D</span>
            </div>
            {cryptoData.map((crypto) => (
              <div key={crypto.rank} className="grid grid-cols-4 text-xs px-3 py-2 hover:bg-[#1a2332] cursor-pointer border-b border-[#1e2738] last:border-b-0">
                <span className="text-gray-500">{crypto.rank}</span>
                <span className="text-white font-medium">{crypto.symbol}</span>
                <span className="text-white">{crypto.price}</span>
                <span className={crypto.positive ? "text-green-400" : "text-red-400"}>
                  {crypto.change}
                </span>
              </div>
            ))}
          </div>
          {/* Chart Placeholder */}
          <div className="w-1/2 p-4 flex items-center justify-center">
            <div className="text-gray-500 text-sm">Chart visualization</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Market Overview Card
function MarketOverviewCard() {
  return (
    <Card className="bg-[#0d1421] border-[#1e2738] h-full py-0">
      <CardHeader className="pb-3 pt-4 px-4 border-b border-[#1e2738]">
        <CardTitle className="text-white text-base font-medium">Market Overview 24H</CardTitle>
      </CardHeader>
      <CardContent className="p-x-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Market Cap</span>
            <div className="text-right">
              <span className="text-white font-medium">$2.55T</span>
              <span className="text-green-400 text-xs ml-2">↑4.43%</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Volume</span>
            <div className="text-right">
              <span className="text-white font-medium">$115B</span>
              <span className="text-green-400 text-xs ml-2">↑10.31%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Daily Recap Card
function DailyRecapCard() {
  return (
    <PlaceholderCard title="Daily Recap">
      <div className="space-y-3">
        <ul className="space-y-2 text-sm text-gray-300">
          <li className="flex gap-2">
            <span>•</span>
            <span>Real World Assets (RWAs) are moving from theoretical concepts to practical infrastructure...</span>
          </li>
          <li className="flex gap-2">
            <span>•</span>
            <span>The memecoin ecosystem continues to be characterized by...</span>
          </li>
        </ul>
      </div>
    </PlaceholderCard>
  )
}

// Research Card
function ResearchCard() {
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

// Mindshare Card
function MindshareCard() {
  const assets = [
    { rank: 1, symbol: "SNX", mindshare: "18.14%", change: "+6,743%", positive: true },
    { rank: 2, symbol: "OG", mindshare: "1.46%", change: "+3,743%", positive: true },
    { rank: 3, symbol: "MELANIA", mindshare: "0.56%", change: "+662.59%", positive: true },
    { rank: 4, symbol: "SKR", mindshare: "0.27%", change: "+490.53%", positive: true },
    { rank: 5, symbol: "SENT", mindshare: "0.14%", change: "+361.26%", positive: true },
  ]

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
          <div key={asset.rank} className="grid grid-cols-4 text-xs py-1.5 hover:bg-[#1a2332] cursor-pointer rounded">
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

export function Dashboard() {
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null)

  return (
    <div className="h-screen bg-[#0a0e17] p-4 overflow-hidden">
      <div className="flex h-full gap-4">
        {/* LEFT SECTION: Prices & Chart on top, Daily Recap + Research + Mindshare below */}
        <div className="flex-1 flex flex-col gap-4 h-full min-h-0">
          {/* Top: Prices & Chart (roughly 60% height of left section) */}
          <div className="h-[50%] min-h-0">
            <PricesChartCard />
          </div>

          {/* Bottom: three cards sharing remaining ~40% height */}
          <div className="h-[50%] min-h-0 flex gap-4">
            <div className="h-full flex-1 min-w-0">
              <DailyRecapCard />
            </div>
            <div className="h-full flex-1 min-w-0">
              <ResearchCard />
            </div>
            <div className="h-full flex-1 min-w-0">
              <MindshareCard />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Market Overview (20% height) + News (80% height) */}
        <div className="w-[25%] h-full min-h-0 flex flex-col gap-4">
          <div className="h-[20%] min-h-0">
            <MarketOverviewCard />
          </div>
          <div className="h-[80%] min-h-0">
            <NewsCard onNewsClick={setSelectedNews} />
          </div>
        </div>
      </div>

      {selectedNews && (
        <>
          {/* Backdrop */}
          {console.log(selectedNews)}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={() => setSelectedNews(null)}
          />

          {/* Right-side detail panel */}
          <div className="fixed inset-y-0 right-0 w-1/2 bg-[#0d1421] border-l border-[#1e2738] z-50 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            {/* Close button */}
            <button
              type="button"
              className="absolute top-4 right-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#1a2332] text-gray-400 hover:text-white hover:bg-[#2a3548]"
              onClick={() => setSelectedNews(null)}
            >
              <span className="text-3xl font-bold">×</span>
            </button>

            {/* Hero Image */}
            {selectedNews.imageUrl ? (
              <div className="relative w-full h-56 shrink-0 overflow-hidden">
                <img
                  src={selectedNews.imageUrl}
                  alt={selectedNews.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#0d1421] via-transparent to-transparent" />
              </div>
            ) : (
              <div className="w-full h-32 shrink-0 bg-linear-to-br from-[#1a2332] to-[#0d1421] flex items-center justify-center">
                <Globe className="h-12 w-12 text-gray-600" />
              </div>
            )}

            {/* Header Content */}
            <div className="px-6 py-4 border-b border-[#1e2738] -mt-8 relative z-10">
              {/* Sentiment & Categories */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span
                  className={`text-xs px-2.5 py-1  uppercase tracking-wide font-medium ${getSentimentClasses(
                    selectedNews.sentiment,
                  )}`}
                >
                  {selectedNews.sentiment}
                </span>
                {selectedNews.categoryData?.length > 0 && (
                  <>
                    {selectedNews.categoryData.slice(0, 4).map((cat) => (
                      <span
                        key={cat.id}
                        className="px-2 py-1 rounded-full bg-violet-500/20 text-xs text-violet-300 border border-violet-500/30"
                      >
                        {cat.category}
                      </span>
                    ))}
                  </>
                )}
              </div>

              {/* Title */}
              <h2 className="text-xl font-bold leading-tight text-white mb-2">
                {selectedNews.title}
              </h2>

              {/* Subtitle */}
              {selectedNews.subtitle && (
                <p className="text-sm text-gray-400 leading-relaxed mb-3">
                  {selectedNews.subtitle}
                </p>
              )}

              {/* Meta info row */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
                <div className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" />
                  <span>{selectedNews.authors || 'Unknown'}</span>
                </div>
                <span className="text-gray-600">•</span>
                <div className="flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5" />
                  <span className="uppercase">{selectedNews.lang}</span>
                </div>
              </div>

              {/* Engagement Stats */}
              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-[#1e2738]">
                <div className="text-xs text-gray-500 bg-[#1a2332] px-2 py-1 rounded">
                  Score: <span className="text-white font-medium">{selectedNews.score}</span>
                </div>
                <a
                  href={selectedNews.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 transition-colors bg-violet-500/10 px-3 py-1.5 rounded-full border border-violet-500/30 hover:border-violet-500/50"
                >
                  <Link2 className="h-3.5 w-3.5" />
                  <span>Read Full Article</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              {/* Summary Section */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <span className="w-1 h-4 bg-violet-500 rounded-full" />
                  Summary
                </h3>
                <p className="text-sm leading-relaxed text-gray-300 whitespace-pre-line">
                  {selectedNews.body}
                </p>
              </div>

              {/* Article Details */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <span className="w-1 h-4 bg-violet-500 rounded-full" />
                  Article Details
                </h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-[#1a2332] rounded-lg p-3 space-y-1">
                    <span className="text-gray-500">Article ID</span>
                    <p className="text-white font-mono">{selectedNews.id}</p>
                  </div>
                  {/* <div className="bg-[#1a2332] rounded-lg p-3 space-y-1">
                    <span className="text-gray-500">Type</span>
                    <p className="text-white uppercase">{selectedNews.type}</p>
                  </div> */}
                  <div className="bg-[#1a2332] rounded-lg p-3 space-y-1">
                    <span className="text-gray-500">Source ID</span>
                    <p className="text-white">{selectedNews.sourceId}</p>
                  </div>
                  <div className="bg-[#1a2332] rounded-lg p-3 space-y-1">
                    <span className="text-gray-500">Status</span>
                    <p className="text-white capitalize">{selectedNews.status}</p>
                  </div>
                  <div className="bg-[#1a2332] rounded-lg p-3 space-y-1">
                    <span className="text-gray-500 flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> Published
                    </span>
                    <p className="text-white">{formatDate(selectedNews.publishedOn)}</p>
                  </div>
                  {/* <div className="bg-[#1a2332] rounded-lg p-3 space-y-1">
                    <span className="text-gray-500 flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> Created
                    </span>
                    <p className="text-white">{formatDate(selectedNews.createdOn)}</p>
                  </div> */}
                  {selectedNews.updatedOn && (
                    <div className="bg-[#1a2332] rounded-lg p-3 space-y-1 col-span-2">
                      <span className="text-gray-500 flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> Last Updated
                      </span>
                      <p className="text-white">{formatDate(selectedNews.updatedOn)}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* GUID */}
              {/* <div className="bg-[#1a2332] rounded-lg p-3 space-y-1 text-xs">
                <span className="text-gray-500">GUID</span>
                <p className="text-gray-400 font-mono text-[11px] break-all">{selectedNews.guid}</p>
              </div> */}

              {/* All Categories */}
              {selectedNews.categoryData?.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <span className="w-1 h-4 bg-violet-500 rounded-full" />
                    All Categories
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedNews.categoryData.map((cat) => (
                      <div
                        key={cat.id}
                        className="px-3 py-2 rounded-lg bg-[#1a2332] border border-[#2a3548] text-xs"
                      >
                        <span className="text-white">{cat.category}</span>
                        <span className="text-gray-500 ml-2">({cat.name})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function formatDate(unixSeconds: number): string {
  return new Date(unixSeconds * 1000).toLocaleDateString()
}

function getSentimentClasses(sentiment: string): string {
  const upper = sentiment.toUpperCase()
  if (upper === "POSITIVE") return "bg-emerald-900/60 text-emerald-300 border border-emerald-500/40"
  if (upper === "NEGATIVE") return "bg-red-900/60 text-red-300 border border-red-500/40"
  if (upper === "NEUTRAL") return "bg-slate-800 text-slate-200 border border-slate-500/40"
  return "bg-slate-800 text-slate-200 border border-slate-500/40"
}
