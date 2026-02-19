import { useState } from "react"
import { Home, FileText } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface SidebarProps {
  activePage: "home" | "research"
  onPageChange: (page: "home" | "research") => void
}

const navItems = [
  { id: "home" as const, label: "Home", icon: Home },
  { id: "research" as const, label: "Research", icon: FileText },
]

export function Sidebar({ activePage, onPageChange }: SidebarProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const navigate = useNavigate()

  const handlePageChange = (page: "home" | "research") => {
    navigate(page === "home" ? "/" : "/research")
    onPageChange(page)
  }

  return (
    <aside className="w-16 bg-[#0a0d14] border-r border-[#1e2738] flex flex-col items-center py-4 shrink-0">
      {/* Navigation */}
      <nav className="flex flex-col items-center gap-2 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activePage === item.id

          return (
            <div key={item.id} className="relative">
              <button
                onClick={() => handlePageChange(item.id)}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                className={`w-11 h-11 rounded-lg flex items-center justify-center transition-all ${isActive
                    ? "bg-[#afb6eb] text-black border"
                    : "text-gray-500 hover:text-white hover:bg-[#1a2332]"
                  }`}
              >
                <Icon className="w-5 h-5" />
              </button>

              {/* Tooltip */}
              {hoveredItem === item.id && (
                <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-[#1a2332] text-white text-xs rounded whitespace-nowrap z-50 border border-[#2a3548]">
                  {item.label}
                </div>
              )}
            </div>
          )
        })}
      </nav>
    </aside>
  )
}
