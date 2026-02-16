import { Dashboard } from "@/pages/Dashboard"
import { CoinGeckoProvider } from "@/contexts"

function App() {
  return (
    <CoinGeckoProvider
      initialSelectedAssets={["ethereum", "bitcoin"]}
      initialTimeRange="7D"
      autoRefreshInterval={60000} // Refresh every 60 seconds
    >
      <Dashboard />
    </CoinGeckoProvider>
  )
}

export default App