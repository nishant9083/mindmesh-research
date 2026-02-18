import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { fetchResearchArticleById } from "@/services/news-api"
import type { ResearchItem } from "@/types/news"

export function ResearchArticlePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [article, setArticle] = useState<ResearchItem | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadArticle() {
      if (!id) return
      
      try {
        setLoading(true)
        const data = await fetchResearchArticleById(id)
        setArticle(data)
      } catch (error) {
        console.error("Failed to fetch article:", error)
      } finally {
        setLoading(false)
      }
    }

    loadArticle()
  }, [id])

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-[#060709]">
        <p className="text-gray-500 text-sm">Loading article...</p>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-[#060709] gap-4">
        <p className="text-gray-500 text-lg">Article not found</p>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
        >
          Back to Home
        </button>
      </div>
    )
  }

  // Format the published date
  const publishedDate = new Date(article.publishedAt)
  const formattedDate = publishedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  })
  const timeAgo = getTimeAgo(publishedDate)
  const readTime = "15 min read" // You can calculate this based on content length

  return (
    <div className="h-full overflow-y-auto bg-[#060709] relative">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-linear-to-br from-blue-400/20 via-transparent to-transparent pointer-events-none"></div>
      
      <div className="max-w-4xl mx-auto px-6 py-8 relative z-10">
        {/* Header Section */}
        <div className="mb-8">
          {/* Breadcrumb/Tags */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => navigate("/")}
              className="text-blue-200 hover:text-blue-400 text-sm pr-3"
            >
              ← Back
            </button>
            <span className="px-3 py-1 bg-blue-400/20 text-blue-100 text-xs rounded">
              DeFi
            </span>
            <span className="px-3 py-1 bg-blue-400/20 text-blue-100 text-xs rounded">
              Layer-1
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            {article.title}
          </h1>

          {/* Author Info */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#1a2332] flex items-center justify-center text-white font-semibold">
              {article.author.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold">{article.author}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span>{timeAgo}</span>
                <span>·</span>
                <span>{readTime}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {/* <div className="flex items-center gap-3 mt-6">
            <button className="flex items-center gap-2 px-4 py-2 bg-[#1a2332] hover:bg-[#1f2840] text-white rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m2.828-9.9a9 9 0 012.828 2.828" />
              </svg>
              <span className="text-sm">21 mins</span>
            </button>
            
            <button className="flex items-center gap-2 px-4 py-2 bg-[#1a2332] hover:bg-[#1f2840] text-white rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
            
            <button className="flex items-center gap-2 px-4 py-2 bg-[#1a2332] hover:bg-[#1f2840] text-white rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
            
            <button className="flex items-center gap-2 px-4 py-2 bg-[#1a2332] hover:bg-[#1f2840] text-white rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
          </div> */}
        </div>

        {/* Key Insights Section */}
        <div className="mb-8 bg-[#0d1117] border border-[#1e2738] rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">Key Insights</h2>
          <ul className="space-y-3 text-gray-300">
            <li className="flex gap-3">
              <span className="text-blue-500 mt-1">•</span>
              <span>
                <strong className="text-white">Flow has formalized its expansion deeper into consumer DeFi</strong> in a published strategy built around stablecoin-based consumer finance and enshrined protocols, a small set of default apps designed to concentrate liquidity and integrations.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-500 mt-1">•</span>
              <span>
                <strong className="text-white">Flow's expansion into consumer DeFi is anchored to two protocol upgrades:</strong> Crescendo makes Flow EVM a practical target for Solidity teams and existing EVM tooling, and Forte adds native, reusable automation for recurring actions.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-500 mt-1">•</span>
              <span>
                <strong className="text-white">Flow EVM supports fee sponsorship,</strong> letting apps pay transaction fees on a user's behalf, a prerequisite for consumer payment flows where users can transact without holding FLOW or managing gas.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-500 mt-1">•</span>
              <span>
                <strong className="text-white">The Flow Foundation is developing Flow Credit Market (FCM) as the first enshrined protocol,</strong> with Peak.Money positioned as the flywheel app that brings consumer usage into the shared credit layer.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-500 mt-1">•</span>
              <span>
                <strong className="text-white">PYUSD concentration creates a clear default dollar-denominated asset on Flow,</strong> which can lower go-to-market friction for apps that want to build around a PayPal-branded stablecoin and a single primary settlement asset.
              </span>
            </li>
          </ul>
        </div>

        {/* Primer Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Primer</h2>
          <div className="text-gray-300 leading-relaxed space-y-4">
            <p>{article.content}</p>
            <p>
              This article explores the strategic direction of Flow Network as it pivots from its NFT origins
              into the consumer DeFi space. We'll examine the technical upgrades, protocol design, and market
              positioning that underpin this transition.
            </p>
            <p>
              The cryptocurrency landscape in 2026 demands more than just technological innovation—it requires
              a clear go-to-market strategy that balances user experience with protocol sustainability. Flow's
              approach represents a studied response to these market dynamics.
            </p>
          </div>
        </div>

        {/* Article Content */}
        <div className="prose prose-invert max-w-none">
          <div className="text-gray-300 leading-relaxed space-y-6">
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">The Strategic Pivot</h2>
            <p>
              Flow Network's journey from NFT-focused blockchain to consumer DeFi platform reflects broader
              industry trends. The network, initially launched to support digital collectibles and gaming use
              cases, now positions itself at the intersection of traditional finance and decentralized systems.
            </p>
            
            <h3 className="text-xl font-bold text-white mt-6 mb-3">Technical Architecture</h3>
            <p>
              The Crescendo upgrade fundamentally transforms Flow's capabilities by introducing full EVM
              compatibility. This isn't merely a technical checkbox—it's a strategic enabler that allows
              Solidity developers to deploy existing DeFi protocols with minimal modifications.
            </p>
            
            <p>
              Combined with the Forte upgrade's automation primitives, Flow creates a unique value proposition:
              the familiarity of EVM development with consumer-focused features like fee sponsorship and
              programmable recurring transactions.
            </p>

            <h3 className="text-xl font-bold text-white mt-6 mb-3">The Enshrined Protocol Model</h3>
            <p>
              Flow's concept of "enshrined protocols" deserves particular attention. Rather than letting a
              thousand flowers bloom, Flow designates specific protocols as canonical infrastructure—starting
              with the Flow Credit Market (FCM). This approach concentrates liquidity and integration efforts,
              potentially accelerating ecosystem development.
            </p>

            <p>
              The trade-off is clear: reduced permissionless innovation in exchange for higher-quality,
              better-integrated core protocols. Whether this proves successful depends on execution and
              community acceptance.
            </p>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">Market Implications</h2>
            <p>
              The PYUSD partnership represents more than a stablecoin integration. It's a statement about
              Flow's target market: users who value brand recognition and regulatory clarity over pure
              decentralization maximalism.
            </p>

            <p>
              This positioning could prove prescient as regulatory frameworks crystallize in 2026. PayPal's
              backing provides both legitimacy and distribution—critical advantages in consumer-facing
              applications.
            </p>

            <h3 className="text-xl font-bold text-white mt-6 mb-3">Competitive Landscape</h3>
            <p>
              Flow enters a crowded field of consumer-focused blockchains. Solana dominates in speed and
              developer mindshare. Base and other Layer 2s offer EVM compatibility with established ecosystems.
              Flow's differentiation relies on its combination of EVM support, consumer features, and strategic
              partnerships.
            </p>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">Looking Forward</h2>
            <p>
              The success of Flow's consumer DeFi pivot hinges on several factors:
            </p>
            <ul className="list-disc list-inside space-y-2 my-4">
              <li>Peak.Money's ability to drive meaningful user adoption</li>
              <li>Developer uptake of the enshrined protocol model</li>
              <li>PYUSD's acceptance as Flow's primary stablecoin</li>
              <li>The broader market's appetite for PayPal-associated crypto products</li>
            </ul>

            <p>
              As we navigate 2026's evolving crypto landscape, Flow's approach offers a testable hypothesis:
              that focused product strategy and strategic partnerships can compete with raw technical
              performance and established network effects.
            </p>

            <p className="text-gray-400 italic mt-8">
              This analysis represents market research and should not be construed as investment advice.
              Cryptocurrency investments carry significant risk.
            </p>
          </div>
        </div>

        {/* Footer metadata */}
        <div className="mt-12 pt-6 border-t border-[#1e2738]">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div>
              <span>Source: {article.source}</span>
            </div>
            <div>
              <span>Published: {formattedDate}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper function to calculate time ago
function getTimeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffHours / 24)

  if (diffHours < 1) {
    return "just now"
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`
  } else {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }
}
