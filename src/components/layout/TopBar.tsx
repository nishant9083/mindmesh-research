import { useState, useRef, useEffect } from "react"
import { Search, Bell, ChevronDown, User, Settings, LogOut, HelpCircle, CreditCard } from "lucide-react"

export function TopBar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const profileMenuItems = [
    { icon: User, label: "Profile", onClick: () => console.log("Profile clicked") },
    { icon: Settings, label: "Settings", onClick: () => console.log("Settings clicked") },
    { icon: CreditCard, label: "Billing", onClick: () => console.log("Billing clicked") },
    { icon: HelpCircle, label: "Help & Support", onClick: () => console.log("Help clicked") },
    { type: "divider" as const },
    { icon: LogOut, label: "Log out", onClick: () => console.log("Logout clicked"), danger: true },
  ]

  return (
    <header className="h-14 bg-[#0a0d14] border-b border-[#1e2738] flex items-center justify-between px-4 shrink-0">
      {/* Left: Logo & Brand */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-linear-to-br to-blue-400 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">O</span>
        </div>
        <span className="text-white font-semibold text-lg">One-Stop-Trading</span>
      </div>

      {/* Center: Search Bar */}
      <div className="flex-1 max-w-xl mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search or jump to..."
            className="w-full bg-[#181b28] border border-[#1d2431] rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs border border-[#2a3548] px-1.5 py-0.5 rounded">
            /
          </div>
        </div>
      </div>

      {/* Right: Actions & Profile */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 text-gray-400 hover:text-white hover:bg-[#1a2332] rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 p-1.5 pr-3 text-gray-400 hover:text-white hover:bg-[#1a2332] rounded-lg transition-colors"
          >
            <div className="w-8 h-8 bg-linear-to-br to-blue-400 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm">U</span>
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform ${isProfileOpen ? "rotate-180" : ""}`} />
          </button>

          {/* Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-[#1a2332] border border-[#2a3548] rounded-lg shadow-xl z-50 overflow-hidden py-1">
              {/* User Info */}
              <div className="px-4 py-3 border-b border-[#2a3548]">
                <p className="text-white font-medium text-sm">Akash Deep</p>
                <p className="text-gray-500 text-xs">akash@gmail.com</p>
              </div>

              {/* Menu Items */}
              {profileMenuItems.map((item, index) => {
                if (item.type === "divider") {
                  return <div key={index} className="h-px bg-[#2a3548] my-1" />
                }
                
                const Icon = item.icon
                return (
                  <button
                    key={index}
                    onClick={item.onClick}
                    className={`w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-[#232d3f] transition-colors ${
                      item.danger ? "text-red-400 hover:text-red-300" : "text-gray-300 hover:text-white"
                    }`}
                  >
                    {Icon && <Icon className="w-4 h-4" />}
                    <span>{item.label}</span>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
