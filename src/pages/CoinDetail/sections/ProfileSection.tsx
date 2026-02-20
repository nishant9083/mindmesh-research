import type { CoinDetail } from "@/types"
import { ExternalLink, Globe, Github, Twitter, MessageCircle, FileText } from "lucide-react"
import { truncateText } from "@/lib/format"

interface ProfileSectionProps {
  coin: CoinDetail
}

export function ProfileSection({ coin }: ProfileSectionProps) {
  const description = coin.description?.en || "No description available."
  const isLongDescription = description.length > 500
  
  // Clean HTML from description (basic sanitization)
  const cleanDescription = description
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .replace(/&nbsp;/g, " ") // Replace &nbsp;
    .replace(/&amp;/g, "&") // Replace &amp;
    .trim()

  const displayDescription = isLongDescription 
    ? truncateText(cleanDescription, 500)
    : cleanDescription

  const links = coin.links || {}
  const categories = coin.categories || []

  return (
    <div className="bg-[#0a0b0d] border border-gray-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4">About {coin.name}</h3>
      
      {/* Description */}
      <div className="text-sm text-gray-300 leading-relaxed mb-6">
        {displayDescription}
      </div>

      {/* Links */}
      {links && (
        <div className="space-y-3 mb-6">
          <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
            Official Links
          </h4>
          
          <div className="grid grid-cols-1 gap-2">
            {/* Website */}
            {links.homepage?.[0] && (
              <a
                href={links.homepage[0]}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                <Globe className="h-4 w-4" />
                Website
                <ExternalLink className="h-3 w-3" />
              </a>
            )}

            {/* Whitepaper */}
            {links.whitepaper && (
              <a
                href={links.whitepaper}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                <FileText className="h-4 w-4" />
                Whitepaper
                <ExternalLink className="h-3 w-3" />
              </a>
            )}

            {/* GitHub */}
            {links.repos_url?.github?.[0] && (
              <a
                href={links.repos_url.github[0]}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                <Github className="h-4 w-4" />
                GitHub Repository
                <ExternalLink className="h-3 w-3" />
              </a>
            )}

            {/* Twitter */}
            {links.twitter_screen_name && (
              <a
                href={`https://twitter.com/${links.twitter_screen_name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                <Twitter className="h-4 w-4" />
                Twitter
                <ExternalLink className="h-3 w-3" />
              </a>
            )}

            {/* Subreddit */}
            {links.subreddit_url && (
              <a
                href={links.subreddit_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                Reddit
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>
      )}

      {/* Categories */}
      {categories.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
            Categories
          </h4>
          <div className="flex flex-wrap gap-2">
            {categories.slice(0, 6).map((category, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-600/10 border border-blue-500/20 text-blue-400 rounded-full text-xs font-medium"
              >
                {category}
              </span>
            ))}
            {categories.length > 6 && (
              <span className="px-3 py-1 bg-gray-800 text-gray-400 rounded-full text-xs font-medium">
                +{categories.length - 6} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Genesis Date */}
      {coin.genesis_date && (
        <div className="mt-6 pt-6 border-t border-gray-800">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Launch Date</span>
            <span className="text-sm text-white font-medium">{coin.genesis_date}</span>
          </div>
        </div>
      )}
    </div>
  )
}
