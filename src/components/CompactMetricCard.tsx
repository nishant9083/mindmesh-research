import { cn } from "@/lib/utils"

interface CompactMetricCardProps {
  label: string
  value: string | number
  subValue?: string
  change?: number
  icon?: React.ReactNode
  tooltip?: string
  className?: string
}

export function CompactMetricCard({
  label,
  value,
  subValue,
  change,
  icon,
  tooltip,
  className
}: CompactMetricCardProps) {
  return (
    <div 
      className={cn(
        "flex items-center justify-between py-2.5 border-b border-gray-800/50 last:border-b-0",
        className
      )}
      title={tooltip}
    >
      <div className="flex items-center gap-2 min-w-0">
        {icon && <div className="text-gray-400 flex-shrink-0">{icon}</div>}
        <span className="text-xs text-gray-400 truncate">{label}</span>
      </div>
      
      <div className="flex flex-col items-end gap-0.5 ml-2">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-semibold text-white whitespace-nowrap">
            {value}
          </span>
          {change !== undefined && (
            <span
              className={cn(
                "text-xs font-medium",
                change >= 0 ? "text-green-500" : "text-red-500"
              )}
            >
              {change >= 0 ? "+" : ""}{change.toFixed(2)}%
            </span>
          )}
        </div>
        {subValue && (
          <span className="text-xs text-gray-500">{subValue}</span>
        )}
      </div>
    </div>
  )
}
