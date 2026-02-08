"use client"

import { Prompt, Category } from "@/lib/types"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { usePrompts } from "@/lib/store/prompt-context"
import { cn } from "@/lib/utils/cn"

interface PromptCardProps {
    prompt: Prompt
    category?: Category
}

export function PromptCard({ prompt, category }: PromptCardProps) {
    const { deletePrompt } = usePrompts()

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        // Toast notification would go here
    }

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <CardTitle className="text-base line-clamp-1">{prompt.title}</CardTitle>
                        <CardDescription className="text-xs">
                            {category ? (
                                <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", category.color?.replace('bg-', 'bg-opacity-20 bg-') || "bg-gray-100 text-gray-800")}>
                                    {category.name}
                                </span>
                            ) : (
                                <span className="text-muted-foreground">Uncategorized</span>
                            )}
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pb-3">
                <p className="text-sm text-muted-foreground line-clamp-3 whitespace-pre-wrap">
                    {prompt.content}
                </p>
            </CardContent>
            <CardFooter className="flex justify-end gap-2 pt-0">
                <Button variant="ghost" size="icon" onClick={() => copyToClipboard(prompt.content)} title="Copy to clipboard">
                    <Copy className="h-4 w-4" />
                </Button>
                <Link href={`/prompt/${prompt.id}`}>
                    <Button variant="ghost" size="icon" title="Edit">
                        <Edit className="h-4 w-4" />
                    </Button>
                </Link>
                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => deletePrompt(prompt.id)} title="Delete">
                    <Trash2 className="h-4 w-4" />
                </Button>
            </CardFooter>
        </Card>
    )
}
