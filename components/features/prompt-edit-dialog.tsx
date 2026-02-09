"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { usePrompts } from "@/lib/store/prompt-context"
import { Prompt, Category } from "@/lib/types"
import { cn } from "@/lib/utils/cn"

interface PromptEditDialogProps {
    isOpen: boolean
    onClose: () => void
    prompt: Prompt
}

export function PromptEditDialog({ isOpen, onClose, prompt }: PromptEditDialogProps) {
    const { updatePrompt, categories } = usePrompts()
    const [title, setTitle] = useState(prompt.title)
    const [content, setContent] = useState(prompt.content)
    const [categoryId, setCategoryId] = useState(prompt.categoryId)
    const [isSaving, setIsSaving] = useState(false)

    // Reset form when prompt changes or dialog opens
    useEffect(() => {
        if (isOpen) {
            setTitle(prompt.title)
            setContent(prompt.content)
            setCategoryId(prompt.categoryId)
        }
    }, [isOpen, prompt])

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose()
        }

        if (isOpen) {
            document.body.style.overflow = "hidden"
            window.addEventListener("keydown", handleEscape)
        }

        return () => {
            document.body.style.overflow = "unset"
            window.removeEventListener("keydown", handleEscape)
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)

        // Simulate a small delay for better UX or actual async operation
        await new Promise(resolve => setTimeout(resolve, 300))

        updatePrompt(prompt.id, {
            title,
            content,
            categoryId
        })

        setIsSaving(false)
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div
                className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />
            <div
                className="relative w-full max-w-2xl transform overflow-hidden rounded-lg bg-card border shadow-xl transition-all max-h-[85vh] flex flex-col"
                role="dialog"
                aria-modal="true"
            >
                <form onSubmit={handleSave} className="flex flex-col h-full">
                    <div className="flex items-center justify-between border-b p-6 pb-4">
                        <h3 className="text-xl font-semibold leading-none tracking-tight">Edit Prompt</h3>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-4 top-4"
                            onClick={onClose}
                        >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Close</span>
                        </Button>
                    </div>

                    <div className="p-6 space-y-4 overflow-y-auto flex-1">
                        <div className="space-y-2">
                            <label htmlFor="title" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Title
                            </label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Prompt title"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="category" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Category
                            </label>
                            <select
                                id="category"
                                value={categoryId ?? ""}
                                onChange={(e) => setCategoryId(e.target.value || null)}
                                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="">Uncategorized</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2 flex-1 flex flex-col">
                            <label htmlFor="content" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Content
                            </label>
                            <Textarea
                                id="content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Write your prompt here..."
                                className="min-h-[200px] flex-1 resize-none font-mono text-sm leading-relaxed"
                                required
                            />
                        </div>
                    </div>

                    <div className="border-t p-4 flex justify-end gap-2 bg-muted/20">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSaving}>
                            {isSaving ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
