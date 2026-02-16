import { useState } from "react"
import type { MultiSelectDropdownProps } from "@/types/news"

export function MultiSelectDropdown<T extends string | number>({
  label,
  options,
  selectedIds,
  onToggle,
}: MultiSelectDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false)

  const selectedCount = selectedIds.length
  const displayText = selectedCount > 0 ? `${label} (${selectedCount})` : `All ${label.toLowerCase()}`

  return (
    <div className="relative flex-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-[#050816] border border-[#1e2738] rounded-md px-2 py-1.5 text-xs text-gray-200 text-left focus:outline-none focus:ring-1 focus:ring-violet-500/60 flex items-center justify-between"
      >
        <span className="truncate">{displayText}</span>
        <span className="text-gray-500 ml-1">{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop to close dropdown */}
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />

          {/* Dropdown menu */}
          <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-[#0d1421] border border-[#1e2738] rounded-md shadow-lg max-h-48 overflow-y-auto">
            {options.length === 0 ? (
              <div className="px-3 py-2 text-xs text-gray-500 bg-accent">No options</div>
            ) : (
              options.map((option) => {
                const isSelected = selectedIds.includes(option.id)
                return (
                  <button
                    key={String(option.id)}
                    onClick={() => onToggle(option.id)}
                    title={option.label}
                    className={`w-full text-left px-3 py-2 text-xs hover:bg-[#1a2332] transition-colors flex items-center gap-2 ${
                      isSelected ? "text-violet-300 bg-violet-900/20" : "text-gray-300 "
                    }`}
                  >
                    <span
                      className={`w-3 h-3 rounded border shrink-0 flex items-center justify-center ${
                        isSelected ? "bg-violet-600 border-violet-600" : "border-gray-500"
                      }`}
                    >
                      {isSelected && <span className="text-white text-[8px]">✓</span>}
                    </span>
                    <span className="truncate">{option.label}</span>
                  </button>
                )
              })
            )}
          </div>
        </>
      )}
    </div>
  )
}
