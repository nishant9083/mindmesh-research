import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCoin } from "@/contexts"

export function MarketOverviewCard() {

  const data = useCoin("bitcoin")
  return (
    <Card className="bg-[#0f1118] border-[#1e2738] h-full py-0">
      <CardHeader className="pb-2 pt-4 px-4 border-[#1e2738] bg-[#181b28] rounded-t-xl">
        <CardTitle className="text-white text-base font-medium"><span className="font-bold">
          Market Overview</span> 24H</CardTitle>
      </CardHeader>
      <CardContent className="px-4 py-2">
        <div className="flex flex-row justify-start gap-5">
          <div className="flex flex-col gap-0.5">
            <span className="text-gray-200 text-xs">Marketcap</span>
            <span className="text-white font-bold">{data?.market_cap ? `$${(data.market_cap / 1e12).toFixed(2)}T` : "$0.00T"}</span>
            <span className="text-red-400 text-xs">{data?.market_cap_change_percentage_24h ? `${data.market_cap_change_percentage_24h > 0 ? '+' : ''}${data.market_cap_change_percentage_24h.toFixed(2)}%` : "0.00%"}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-gray-200 text-xs">Volume</span>
            <span className="text-white font-bold">{data?.total_volume ? `$${(data.total_volume / 1e9).toFixed(2)}B` : "$0.00B"}</span>
            {/* <span className="text-red-400 text-xs">{data?.volume_change_percentage_24h ? `${data.volume_change_percentage_24h > 0 ? '+' : ''}${data.volume_change_percentage_24h.toFixed(2)}%` : "0.00%"}</span> */}
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-gray-200 text-xs">Dominance</span>
            <div className="flex items-center gap-1">
              {/* data.image span */}
              <span className="w-4 h-4 rounded-full bg-gray-500 flex items-center justify-center text-[8px] text-white">
                {data?.image ? <img src={data.image} alt={data.name} className="w-full h-full object-cover rounded-full" /> : "?"}
              </span>                    
              <span className="text-white font-bold">{data?.market_cap_rank ? `#${data.market_cap_rank}` : "#"}</span>
            </div>
            
          </div>
          
        </div>
      </CardContent>
    </Card>
  )
}
