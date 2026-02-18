import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Dashboard, ResearchPage, ResearchArticlePage } from "@/pages"
import { CoinGeckoProvider } from "@/contexts"
import { Sidebar, TopBar } from "@/components/layout"

function App() {
  return (
    <BrowserRouter>
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
            <Sidebar />
            
            {/* Main Content */}
            <main className="flex-1 overflow-hidden">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/research" element={<ResearchPage />} />
                <Route path="/research/:id" element={<ResearchArticlePage />} />
              </Routes>
            </main>
          </div>
        </div>
      </CoinGeckoProvider>
    </BrowserRouter>
  )
}

export default App