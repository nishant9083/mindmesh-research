import { ResearchCard } from "@/components"

export function ResearchPage() {
  return (
    <div className="h-full overflow-y-auto bg-[#060709] p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Research Articles</h1>
        <div className="max-w-2xl">
          <ResearchCard />
        </div>
      </div>
    </div>
  )
}
