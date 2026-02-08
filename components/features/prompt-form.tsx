"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { usePrompts } from "@/lib/store/prompt-context"
import { Prompt } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, Save } from "lucide-react"
import Link from "next/link"

interface PromptFormProps {
    initialData?: Prompt
    isEditing?: boolean
}

export function PromptForm({ initialData, isEditing = false }: PromptFormProps) {
    const router = useRouter()
    const { addPrompt, updatePrompt, categories } = usePrompts()

    const [title, setTitle] = useState(initialData?.title || "")
    const [content, setContent] = useState(initialData?.content || "")
    const [categoryId, setCategoryId] = useState(initialData?.categoryId || "")

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title)
            setContent(initialData.content)
            setCategoryId(initialData.categoryId)
        }
    }, [initialData])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!title.trim() || !content.trim()) return

        if (isEditing && initialData) {
            updatePrompt(initialData.id, { title, content, categoryId })
        } else {
            addPrompt({ title, content, categoryId })
        }

        router.push('/')
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-6">
                <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Back to Library
                </Link>
                <h1 className="text-3xl font-bold tracking-tight">
                    {isEditing ? 'Edit Prompt' : 'New Prompt'}
                </h1>
            </div>

            <Card>
                <CardContent className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <label htmlFor="title" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Prompt Title
                                </label>
                                <Input
                                    id="title"
                                    placeholder="e.g., Marketing Campaign for Eco-friendly Product"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="category" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Category
                                </label>
                                <select
                                    id="category"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={categoryId}
                                    onChange={(e) => setCategoryId(e.target.value)}
                                >
                                    <option value="">Select a category...</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="content" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Prompt Content
                            </label>
                            <Textarea
                                id="content"
                                placeholder="Write your prompt here..."
                                className="min-h-[400px] font-mono text-base resize-y p-4"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                            />
                        </div>

                        <div className="flex justify-end gap-4">
                            <Button type="button" variant="ghost" onClick={() => router.back()}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={!title.trim() || !content.trim()}>
                                <Save className="h-4 w-4 mr-2" />
                                Save Prompt
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
