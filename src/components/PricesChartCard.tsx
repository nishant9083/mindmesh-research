import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card"

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

export function PricesChartCard() {
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
              <div
                key={crypto.rank}
                className="grid grid-cols-4 text-xs px-3 py-2 hover:bg-[#1a2332] cursor-pointer border-b border-[#1e2738] last:border-b-0"
              >
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
