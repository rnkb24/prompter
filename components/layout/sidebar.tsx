"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { usePrompts } from "@/lib/store/prompt-context"
import { cn } from "@/lib/utils/cn"
import { Button } from "@/components/ui/button"
import {
    Library,
    Plus,
    Folder,
    LayoutGrid,
    Search,
    Settings,
    Trash2
} from "lucide-react"

export function Sidebar({ className }: { className?: string }) {
    const { categories, addCategory, deleteCategory } = usePrompts()
    const searchParams = useSearchParams()
    const currentCategory = searchParams.get('category')

    // Define main navigation items
    const mainNav = [
        { id: 'all', name: 'All Prompts', icon: LayoutGrid, href: '/' },
        // { id: 'favorites', name: 'Favorites', icon: Heart, href: '/?filter=favorites' }, // Future
        { id: 'trash', name: 'Trash', icon: Trash2, href: '/?filter=trash' },
    ]

    return (
        <div className={cn("pb-12 w-64 border-r bg-gray-50/40 dark:bg-gray-800/40 h-screen flex flex-col", className)}>
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <div className="flex items-center justify-between mb-4 px-4">
                        <h2 className="text-lg font-semibold tracking-tight">
                            Prompts Library
                        </h2>
                    </div>
                    <div className="space-y-1">
                        <Link href="/new">
                            <Button className="w-full justify-start gap-2 mb-4" variant="default">
                                <Plus className="h-4 w-4" />
                                New Prompt
                            </Button>
                        </Link>

                        {mainNav.map((item) => (
                            <Link key={item.id} href={item.href}>
                                <Button variant={currentCategory === null && item.id === 'all' ? "secondary" : "ghost"} className="w-full justify-start gap-2">
                                    <item.icon className="h-4 w-4" />
                                    {item.name}
                                </Button>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="py-2">
                    <h2 className="relative px-7 text-xs font-semibold tracking-tight text-muted-foreground uppercase mb-2">
                        Categories
                    </h2>
                    <div className="space-y-1 px-3">
                        {categories.map((category) => (
                            <div key={category.id} className="group flex items-center gap-1">
                                <Link href={`/?category=${category.id}`} className="flex-1 min-w-0">
                                    <Button
                                        variant={currentCategory === category.id ? "secondary" : "ghost"}
                                        className="w-full justify-start gap-2 font-normal"
                                    >
                                        <Folder className={cn("h-4 w-4 shrink-0", category.color?.replace('bg-', 'text-').replace('-100', '-500') || "text-blue-500")} />
                                        <span className="truncate">{category.name}</span>
                                    </Button>
                                </Link>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        if (window.confirm(`Are you sure you want to delete "${category.name}"? Prompts will be uncategorized.`)) {
                                            deleteCategory(category.id)
                                            // Optional: redirect if on the deleted category page
                                            if (currentCategory === category.id) {
                                                // window.location.href = '/' // Simple redirect or use router.push('/') if available
                                            }
                                        }
                                    }}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}

                        <Button
                            variant="ghost"
                            className="w-full justify-start gap-2 text-muted-foreground"
                            onClick={() => {
                                const name = prompt("Enter category name:")
                                if (name) addCategory({ name, color: 'bg-gray-100 text-gray-700' })
                            }}
                        >
                            <Plus className="h-4 w-4" />
                            Add Category
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
