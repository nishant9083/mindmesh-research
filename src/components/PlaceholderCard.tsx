import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink} from "lucide-react"

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
  showExternalLink = false,
}: PlaceholderCardProps) {
  return (
    <Card className={`bg-[#0f1118] border-[#1e2738] h-full py-0 flex flex-col ${className} gap-0`}>
      <CardHeader className="py-2 px-4 border-[#1e2738] bg-[#181b28] shrink-0 rounded-t-xl">
        <div className="flex items-center gap-2">
          <CardTitle className="text-white text-base font-medium">{title}</CardTitle>
          {showExternalLink && <ExternalLink className="h-3.5 w-3.5 text-gray-500" />}
        </div>
        {/* <CardAction>
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-gray-500" />
            <Maximize2 className="h-4 w-4 text-gray-500" />
          </div>
        </CardAction> */}
      </CardHeader>
      <CardContent className="p-2 flex-1 overflow-hidden">
        {children || (
          <div className="flex items-center justify-center h-32 text-gray-500 text-sm">
            {title} content coming soon...
          </div>
        )}
      </CardContent>
    </Card>
  )
}
