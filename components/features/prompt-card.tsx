"use client"

import { useState } from "react"
import { Prompt, Category } from "@/lib/types"
import { PromptDetailsDialog } from "./prompt-details-dialog"
import { PromptEditDialog } from "./prompt-edit-dialog"
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
    const [isDetailsOpen, setIsDetailsOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)

    const copyToClipboard = (e: React.MouseEvent, text: string) => {
        e.stopPropagation()
        navigator.clipboard.writeText(text)
        // Toast notification would go here
    }

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation()
        deletePrompt(prompt.id)
    }

    return (
        <>
            <Card
                className="hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col"
                onClick={() => setIsDetailsOpen(true)}
            >
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
                <CardContent className="pb-3 flex-grow">
                    <p className="text-sm text-muted-foreground line-clamp-3 whitespace-pre-wrap">
                        {prompt.content}
                    </p>
                </CardContent>
                <CardFooter className="flex justify-end gap-2 pt-0 mt-auto">
                    <Button variant="ghost" size="icon" onClick={(e) => copyToClipboard(e, prompt.content)} title="Copy to clipboard">
                        <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" title="Edit" onClick={(e) => {
                        e.stopPropagation()
                        setIsEditOpen(true)
                    }}>
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={handleDelete} title="Delete">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </CardFooter>
            </Card>

            <PromptDetailsDialog
                isOpen={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
                prompt={prompt}
                category={category}
            />

            <PromptEditDialog
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                prompt={prompt}
            />
        </>
    )
}
