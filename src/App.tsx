import { useState } from "react"
import { Dashboard } from "@/pages/Dashboard"
import { CoinGeckoProvider } from "@/contexts"
import { Sidebar, TopBar } from "@/components/layout"

function App() {
  const [activePage, setActivePage] = useState<"home" | "research">("home")

  return (
    <CoinGeckoProvider
      initialSelectedAssets={["ethereum", "bitcoin"]}
      initialTimeRange="7D"
      autoRefreshInterval={60000} // Refresh every 60 seconds
    >
      <div className="h-screen flex flex-col bg-[#060709] overflow-hidden">
        {/* Top Bar */}
        <TopBar />
        
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <Sidebar activePage={activePage} onPageChange={setActivePage} />
          
          {/* Main Content */}
          <main className="flex-1 overflow-hidden">
            {activePage === "home" && <Dashboard />}
            {activePage === "research" && (
              <div className="h-full flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <h2 className="text-2xl font-semibold text-white mb-2">Research</h2>
                  <p>Coming soon...</p>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </CoinGeckoProvider>
  )
}

export default App