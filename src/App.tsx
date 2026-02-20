import { BrowserRouter, Routes, Route, useParams, Navigate } from "react-router-dom"
import { Dashboard, CoinDetailPage, ResearchPage, ResearchArticlePage, NewsPage } from "@/pages"
import { CoinGeckoProvider } from "@/contexts"
import { Sidebar, TopBar } from "@/components/layout"

// Wrapper for coin detail page that extracts coinId from URL
function CoinDetailWrapper() {
  const { coinId } = useParams<{ coinId: string }>()

  if (!coinId) {
    return <Navigate to="/" replace />
  }

  return <CoinDetailPage coinId={coinId} />
}

// function AppContent() {
//   const [activePage, setActivePage] = useState<"home" | "research">("home")

//   return (
//     <div className="h-screen flex flex-col bg-[#060709] overflow-hidden">
//       {/* Top Bar */}
//       <TopBar />

//       <div className="flex flex-1 overflow-hidden">
//         {/* Sidebar */}
//         <Sidebar activePage={activePage} onPageChange={setActivePage} />

//         {/* Main Content */}
//         <main className="flex-1 overflow-hidden">
//           <Routes>
//             <Route path="/" element={<Dashboard />} />
//             <Route path="/coin/:coinId" element={<CoinDetailWrapper />} />
//             <Route path="/research" element={
//               <div className="h-full flex items-center justify-center text-gray-500">
//                 <div className="text-center">
//                   <h2 className="text-2xl font-semibold text-white mb-2">Research</h2>
//                   <p>Coming soon...</p>
//                 </div>
//               </div>
//             } />
//             <Route path="*" element={<Navigate to="/" replace />} />
//           </Routes>
//         </main>
//       </div>
//     </div>
//   )
// }

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
                <Route path="/news" element={<NewsPage />} />
                <Route path="/coin/:coinId" element={<CoinDetailWrapper />} />
              </Routes>
            </main>
          </div>
        </div>
        {/* <AppContent /> */}
      </CoinGeckoProvider>
    </BrowserRouter>
  )
}

export default App