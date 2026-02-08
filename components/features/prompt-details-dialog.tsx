"use client"

import { useEffect, useRef } from "react"
import { X, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Prompt, Category } from "@/lib/types"
import { cn } from "@/lib/utils/cn"

interface PromptDetailsDialogProps {
    isOpen: boolean
    onClose: () => void
    prompt: Prompt
    category?: Category
}

export function PromptDetailsDialog({ isOpen, onClose, prompt, category }: PromptDetailsDialogProps) {
    const dialogRef = useRef<HTMLDivElement>(null)

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

    const copyToClipboard = () => {
        navigator.clipboard.writeText(prompt.content)
        // Toast notification would go here
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div
                className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />
            <div
                ref={dialogRef}
                className="relative w-full max-w-2xl transform overflow-hidden rounded-lg bg-card border shadow-xl transition-all max-h-[85vh] flex flex-col"
                role="dialog"
                aria-modal="true"
            >
                <div className="flex items-center justify-between border-b p-6 pb-4">
                    <div className="space-y-1 pr-6">
                        <h3 className="text-xl font-semibold leading-none tracking-tight">{prompt.title}</h3>
                        {category ? (
                            <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium mt-2", category.color?.replace('bg-', 'bg-opacity-20 bg-') || "bg-gray-100 text-gray-800")}>
                                {category.name}
                            </span>
                        ) : (
                            <span className="text-muted-foreground text-sm mt-1 block">Uncategorized</span>
                        )}
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-4 top-4"
                        onClick={onClose}
                    >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Close</span>
                    </Button>
                </div>

                <div className="p-6 overflow-y-auto flex-1">
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                        <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                            {prompt.content}
                        </p>
                    </div>
                </div>

                <div className="border-t p-4 flex justify-end bg-muted/20">
                    <Button variant="outline" size="sm" onClick={copyToClipboard} className="gap-2">
                        <Copy className="h-4 w-4" />
                        Copy Prompt
                    </Button>
                </div>
            </div>
        </div>
    )
}
