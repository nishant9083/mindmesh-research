import { NewsDetailPanel } from "@/components"
import { DailyRecapCard } from "@/components/DailyRecapCard"
import { MarketOverviewCard } from "@/components/MarketOverviewCard"
import { NewsCard } from "@/components/NewsCard"
import { PricesChartCard } from "@/components/PricesChartCard"
import { ResearchCard } from "@/components/ResearchCard"
import { memo, useState } from "react"
// import { MindshareCard } from "@/components/MindshareCard"
import type { NewsItem } from "@/types/news"

function DashboardComponent() {
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null)

  return (
    <div className="h-full bg-[#060709] p-2 overflow-auto">
      <div className="flex flex-col lg:flex-row h-full gap-2 lg:gap-4">
        {/* LEFT SECTION: Prices & Chart on top, Daily Recap + Research below */}
        <div className="flex-1 flex flex-col gap-2 min-h-full">
          {/* Top: Prices & Chart */}
          <div className="flex-1 min-h-50 lg:min-h-75">
            <PricesChartCard />
          </div>

          {/* Bottom: two/three cards sharing remaining space */}
          <div className="flex-1 min-h-37.5 lg:min-h-50 flex gap-2 lg:gap-4 flex-wrap lg:flex-nowrap">
            <div className="h-full flex-1 min-w-50 lg:min-w-0">
              <DailyRecapCard />
            </div>
            <div className="h-full flex-1 min-w-50 lg:min-w-0">
              <ResearchCard />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Market Overview + News */}
        <div className="w-full lg:w-80 flex flex-col gap-2 lg:gap-4 min-h-0">
          <div className="shrink-0 min-h-37.5">
            <MarketOverviewCard />
          </div>
          <div className="flex-1 min-h-50 lg:min-h-0">
            <NewsCard onNewsClick={setSelectedNews} />
          </div>
        </div>
      </div>

      <NewsDetailPanel selectedNews={selectedNews} onClose={() => setSelectedNews(null)} />
    </div>
  )
}

// Export memoized component to prevent unnecessary re-renders
export const Dashboard = memo(DashboardComponent)
