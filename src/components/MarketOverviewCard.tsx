import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function MarketOverviewCard() {
  return (
    <Card className="bg-[#0f1118] border-[#1e2738] h-full py-0">
      <CardHeader className="pb-2 pt-4 px-4 border-[#1e2738] bg-[#181b28]">
        <CardTitle className="text-white text-base font-medium">Market Overview 24H</CardTitle>
      </CardHeader>
      <CardContent className="px-4 py-2">
        <div className="flex flex-row justify-start gap-5">
          <div className="flex flex-col gap-0.5">
            <span className="text-gray-200 text-xs">Marketcap</span>
            <span className="text-white font-medium">$2.42T</span>
            <span className="text-red-400 text-xs">↓2.73%</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-gray-400 text-xs">Volume</span>
            <span className="text-white font-medium">$110B</span>
            <span className="text-red-400 text-xs">↓6.04%</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-gray-400 text-xs">Dominance</span>
            <div className="flex items-center gap-1">
              <span className="w-4 h-4 rounded-full bg-orange-500 flex items-center justify-center text-[8px] text-white">₿</span>
              <span className="text-white font-medium">56.86%</span>
            </div>
            <span className="text-green-400 text-xs">↑0.05%</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-gray-400 text-xs invisible">.</span>
            <div className="flex items-center gap-1">
              <span className="w-4 h-4 rounded-full bg-gray-500 flex items-center justify-center text-[8px] text-white">Ξ</span>
              <span className="text-white font-medium">9.87%</span>
            </div>
            <span className="text-green-400 text-xs">↑0.69%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
