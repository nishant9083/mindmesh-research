import { fetchResearchArticleById } from "@/services/research-api"
import type { ResearchItem } from "@/types/news"
import { ArrowLeftIcon } from "lucide-react"
import { useEffect, useState } from "react"
import type { Components } from "react-markdown"
import ReactMarkdown from "react-markdown"
import { useNavigate, useParams } from "react-router-dom"
import remarkGfm from "remark-gfm"

// Markdown component map for rich, blog-quality rendering
const mdComponents: Components = {
  h1: ({ children }) => (
    <h1 className="text-xl md:text-2xl font-bold text-white mt-8 mb-4 leading-tight tracking-tight">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-lg md:text-xl font-bold text-white mt-6 mb-3 leading-snug border-b border-white/10 pb-2">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-base md:text-lg font-semibold text-white/90 mt-5 mb-2 leading-snug">
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="text-sm md:text-base font-semibold text-white/80 mt-4 mb-2">{children}</h4>
  ),
  p: ({ children }) => (
    <p className="text-gray-300 leading-[1.85] text-sm md:text-base mb-4">{children}</p>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-400 underline underline-offset-2 decoration-blue-400/40 hover:text-blue-300 hover:decoration-blue-300/60 transition-colors"
    >
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-4 pl-4 border-l-4 border-blue-500/60 bg-blue-500/5 rounded-r-lg py-2 pr-3 italic text-gray-400 text-sm">
      {children}
    </blockquote>
  ),
  code: ({ children, className }) => {
    const isBlock = className?.includes("language-")
    return isBlock ? (
      <code className="block bg-[#0d1117] border border-white/10 rounded-lg p-3 text-xs text-green-300 font-mono overflow-x-auto my-4 leading-relaxed">
        {children}
      </code>
    ) : (
      <code className="bg-white/10 text-blue-300 font-mono text-[0.8em] px-1.5 py-0.5 rounded">
        {children}
      </code>
    )
  },
  pre: ({ children }) => (
    <pre className="bg-[#0d1117] border border-white/10 rounded-lg p-3 overflow-x-auto my-4 text-xs font-mono leading-relaxed">
      {children}
    </pre>
  ),
  hr: () => <hr className="my-6 border-white/10" />,
  strong: ({ children }) => (
    <strong className="font-semibold text-white">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="italic text-gray-300">{children}</em>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto my-4">
      <table className="w-full text-xs border-collapse border border-white/10 rounded-lg overflow-hidden">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-white/5 text-white font-semibold">{children}</thead>
  ),
  tbody: ({ children }) => (
    <tbody className="divide-y divide-white/5">{children}</tbody>
  ),
  tr: ({ children }) => <tr className="hover:bg-white/3 transition-colors">{children}</tr>,
  th: ({ children }) => (
    <th className="px-3 py-2 text-left text-gray-200 border-b border-white/10">{children}</th>
  ),
  td: ({ children }) => (
    <td className="px-3 py-2 text-gray-400">{children}</td>
  ),
}

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
        const article = await fetchResearchArticleById(id)
        setArticle(article)
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
  const publishedDate = article.publishedAt ? new Date(article.publishedAt) : new Date(article.createdAt)
  const formattedDate = publishedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  })
  const timeAgo = getTimeAgo(publishedDate)
  const authorName = article.author || 'Unknown Author'

  return (
    <div className="h-full overflow-y-auto bg-[#060709] relative">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-linear-to-br from-blue-400/20 via-transparent to-transparent pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-6 py-4 relative z-10">
        {/* Header Section */}
        <div className="mb-8">
          {/* Breadcrumb/Tags */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => navigate("/")}
              className="flex gap-2 items-center text-blue-200 hover:text-blue-400 text-sm pr-3"
            >
              <ArrowLeftIcon className="w-4 h-4" /> Back
            </button>
            {Array.isArray(article.tags) && article.tags.length > 0 && article.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-blue-400/20 text-blue-100 text-xs rounded"
              >
                {tag.charAt(0).toUpperCase() + tag.slice(1)}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-2xl lg:text-3xl font-bold text-white mb-6 leading-tight">
            {article.title}
          </h1>

          {/* Author Info */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#1a2332] flex items-center justify-center text-white font-semibold">
              {authorName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold">{authorName}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span>{timeAgo}</span>
                {/* <span>·</span> */}
                {/* <span>{readTime}</span> */}
              </div>
            </div>
            {/* Read Original Button */}
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white! text-sm rounded-lg transition-colors"
            >
              Read Original
            </a>
          </div>

          {/* Tags */}
          {typeof article.tags === "string" && article.tags.trim() && (
            <div className="flex flex-wrap gap-2 mt-4">
              {article.tags.split(',').map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-[#1a2332] text-gray-300 text-xs rounded"
                >
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* AI Summary Section */}
        {article.aiSummary && (
          <div className="mb-8 prose prose-invert max-w-none bg-[#0d1117] border border-blue-500/30 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-blue-400">✨</span> AI Summary
            </h2>
            <div className="text-gray-400 leading-relaxed space-y-4 font-serif">
              <ReactMarkdown
              components={mdComponents}
              remarkPlugins={[remarkGfm]}
              >{article.aiSummary}</ReactMarkdown>
            </div>
          </div>
        )}

        {/* Content Section */}
        {article.content && (
          <div className="mb-8 prose prose-invert max-w-none ">
            {/* <h2 className="text-2xl font-bold text-white mb-4">Content</h2> */}
            <div className="text-gray-400 leading-relaxed space-y-4 font-serif">
              <ReactMarkdown
              components={mdComponents}
              remarkPlugins={[remarkGfm]}
              >{article.content}</ReactMarkdown>
            </div>
            {/* <ReactMarkdown>{article.content}</ReactMarkdown> */}
          </div>
        )}

        {/* Description Section */}
        {article.description && !article.content && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Overview</h2>
            <div className="text-gray-400 leading-relaxed space-y-4">
              <p>{article.description}</p>
            </div>
          </div>
        )}

        {/* Article Content */}
        {/* <div className="prose prose-invert max-w-none">
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
        </div> */}

        {/* Footer metadata */}
        <div className="mt-12 pt-6 border-t border-[#1e2738]">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div>
              <span>Source: {article.source ? article.source.charAt(0).toUpperCase() + article.source.slice(1) : ""}</span>
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

// Helper function to calculate time ago from ISO string or Date
function getTimeAgo(dateInput: string | Date): string {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput
  if (isNaN(date.getTime())) return "Invalid date"

  const now = new Date()
  const diffMs = now.getTime() - date.getTime()

  const diffSeconds = Math.floor(diffMs / 1000)
  const diffMinutes = Math.floor(diffSeconds / 60)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSeconds < 60) {
    return "just now"
  } else if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes !== 1 ? "s" : ""} ago`
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`
  } else {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }
}
