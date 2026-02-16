import { PlaceholderCard } from "./PlaceholderCard"

export function DailyRecapCard() {
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
