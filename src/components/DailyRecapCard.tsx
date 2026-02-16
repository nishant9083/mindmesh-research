import { PlaceholderCard } from "./PlaceholderCard"

export function DailyRecapCard() {
  return (
    <PlaceholderCard title="Daily Recap">
      <div className="space-y-3">
      <div className="flex py-2 items-center gap-1 text-sm text-gray-300 pb-2 border-b border-gray-800">
        <span className="text-xl text-blue-300">✦</span>
        <span>5 minutes ago</span>
      </div>
      <ul className="space-y-2 text-sm text-gray-300">
        <li className="flex gap-2">
        <span>•</span>
        <span>Michael Saylor's Strategy, holding over 714,000 Bitcoin, claims it could withstand an 88% price crash to $8,000 per BTC while still covering all debt obligations, and continues its acquisition strategy with hints of a 99th Bitcoin purchase .</span>
        </li>
        <li className="flex gap-2">
        <span>•</span>
        <span>The memecoin trading ecosystem is characterized by extreme volatility and wealth ...</span>
        </li>
      </ul>
      </div>
    </PlaceholderCard>
  )
}
