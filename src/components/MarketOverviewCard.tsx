import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function MarketOverviewCard() {
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
