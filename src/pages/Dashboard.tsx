import { useState, memo } from "react"
import { NewsCard } from "@/components/NewsCard"
import { NewsDetailPanel } from "@/components"
import { PricesChartCard } from "@/components/PricesChartCard"
import { MarketOverviewCard } from "@/components/MarketOverviewCard"
import { DailyRecapCard } from "@/components/DailyRecapCard"
import { ResearchCard } from "@/components/ResearchCard"
// import { MindshareCard } from "@/components/MindshareCard"
import type { NewsItem } from "@/types/news"

function DashboardComponent() {
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null)

  return (
    <div className="h-full bg-[#060709] p-4 overflow-auto">
      <div className="flex h-full gap-4 min-w-300">
        {/* LEFT SECTION: Prices & Chart on top, Daily Recap + Research + Mindshare below */}
        <div className="flex-1 flex flex-col gap-4 min-h-0 min-w-0">
          {/* Top: Prices & Chart */}
          <div className="flex-1 min-h-75">
            <PricesChartCard />
          </div>

          {/* Bottom: three cards sharing remaining space */}
          <div className="flex-1 min-h-62.5 flex gap-4">
            <div className="h-full flex-1 min-w-0">
              <DailyRecapCard />
            </div>
            <div className="h-full flex-1 min-w-0">
              <ResearchCard />
            </div>
            {/* <div className="h-full flex-1 min-w-0">
              <MindshareCard />
            </div> */}
          </div>
        </div>

        {/* RIGHT COLUMN: Market Overview + News */}
        <div className="w-100 shrink-0 min-h-0 flex flex-col gap-4">
          <div className="shrink-0">
            <MarketOverviewCard />
          </div>
          <div className="flex-1 min-h-0">
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
