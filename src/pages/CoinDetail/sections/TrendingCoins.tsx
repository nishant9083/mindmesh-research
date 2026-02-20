import { Card } from "@/components/ui/card"
import { formatCurrency } from "@/lib/format"
import { getTrendingSearch, type TrendingResponse } from "@/services/coingecko-api"
import { Flame, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export function TrendingCoins() {
    const navigate = useNavigate()
    const [trendingData, setTrendingData] = useState<TrendingResponse | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchTrending = async () => {
            try {
                setIsLoading(true)
                setError(null)
                const data = await getTrendingSearch()
                setTrendingData(data)
            } catch (err) {
                console.error("Error fetching trending data:", err)
                setError("Failed to load trending coins")
            } finally {
                setIsLoading(false)
            }
        }

        fetchTrending()
    }, [])

    if (isLoading) {
        return (
            <Card className="bg-[#0f1118] border-[#1e2738] p-4">
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                </div>
            </Card>
        )
    }

    if (error || !trendingData) {
        return null
    }

    return (
        <Card className="bg-[#0f1118] border-[#1e2738] p-4">
            <div className="flex items-center gap-2 mb-3">
                <Flame className="h-4 w-4 text-orange-500" />
                <h3 className="text-white font-semibold text-sm">Trending Now</h3>
                <span className="ml-auto text-gray-500 text-xs">Top 7</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {trendingData.coins.slice(0, 10).map((coinWrapper, idx) => {
                    const coin = coinWrapper.item

                    const priceChange24h =
                        coin.data?.price_change_percentage_24h?.usd || 0

                    const isPositive = priceChange24h >= 0
                    const price = coin.data?.price

                    return (
                        <button
                            key={coin.id}
                            onClick={() => navigate(`/coin/${coin.id}`)}
                            className="relative p-4 rounded-xl bg-[#131722] hover:bg-[#1a2332] transition-all duration-200 text-left"
                        >
                            {/* Rank Badge */}
                            <span className="absolute top-2 right-2 text-[10px] px-2 py-0.5 rounded-full bg-[#1e2738] text-gray-300 font-semibold">
                                #{idx + 1}
                            </span>

                            {/* Top Row */}
                            <div className="flex items-center gap-2 mb-2">
                                <img
                                    src={coin.thumb}
                                    alt={coin.name}
                                    className="w-6 h-6 rounded-full"
                                />

                                <span className="text-white text-sm font-medium truncate">
                                    {coin.name}
                                </span>
                            </div>

                            {/* Price */}
                            <div className="text-white font-semibold text-sm">
                                {formatCurrency(price, "USD", {
                                    maximumFractionDigits: 3,
                                })}
                            </div>

                            {/* Change */}
                            <div
                                className={`text-xs mt-1 font-medium ${isPositive ? "text-green-400" : "text-red-400"
                                    }`}
                            >
                                {isPositive ? "+" : "-"}
                                {Math.abs(priceChange24h).toFixed(2)}%
                            </div>
                        </button>
                    )
                })}
            </div>


            <div className="mt-3 pt-3 border-t border-[#1e2738]">
                <p className="text-gray-600 text-xs text-center">
                    Top searches in the last 24 hours
                </p>
            </div>
        </Card>
    )
}
