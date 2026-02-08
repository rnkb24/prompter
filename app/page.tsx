"use client"

import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { usePrompts } from "@/lib/store/prompt-context"
import { PromptCard } from "@/components/features/prompt-card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

function DashboardContent() {
  const { prompts, categories } = usePrompts()
  const searchParams = useSearchParams()
  const categoryId = searchParams.get('category')
  const [searchQuery, setSearchQuery] = useState("")

  const filteredPrompts = prompts.filter((prompt) => {
    const matchesCategory = categoryId ? prompt.categoryId === categoryId : true
    const matchesSearch =
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.content.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesCategory && matchesSearch
  })

  // Get current category name
  const currentCategory = categories.find(c => c.id === categoryId)

  return (
    <div className="h-full flex flex-col">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4 sticky top-0 z-10">
        <div className="flex items-center gap-4 max-w-5xl mx-auto w-full">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search prompts..."
              className="pl-9 w-full bg-muted/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </header>

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight">
              {categoryId ? currentCategory?.name || 'Category' : 'All Prompts'}
            </h1>
            <p className="text-muted-foreground">
              {filteredPrompts.length} {filteredPrompts.length === 1 ? 'prompt' : 'prompts'} found
            </p>
          </div>

          {filteredPrompts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPrompts.map((prompt) => (
                <PromptCard
                  key={prompt.id}
                  prompt={prompt}
                  category={categories.find(c => c.id === prompt.categoryId)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No prompts found. Create one to get started!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  )
}
