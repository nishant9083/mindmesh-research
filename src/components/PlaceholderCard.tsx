import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card"
import { ExternalLink, Settings, Maximize2 } from "lucide-react"

interface PlaceholderCardProps {
  title: string
  children?: React.ReactNode
  className?: string
  showExternalLink?: boolean
}

export function PlaceholderCard({
  title,
  children,
  className = "",
  showExternalLink = true,
}: PlaceholderCardProps) {
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
