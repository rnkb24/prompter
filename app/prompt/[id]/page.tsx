"use client"

import { PromptForm } from "@/components/features/prompt-form"
import { usePrompts } from "@/lib/store/prompt-context"
import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState, Suspense } from "react"
import { Prompt } from "@/lib/types"

function EditPromptContent() {
    const searchParams = useSearchParams()
    const id = searchParams.get('id')

    const { prompts, isLoaded } = usePrompts()
    const router = useRouter()
    const [prompt, setPrompt] = useState<Prompt | undefined>(undefined)

    useEffect(() => {
        if (isLoaded) {
            const foundPrompt = prompts.find(p => p.id === id)
            if (foundPrompt) {
                setPrompt(foundPrompt)
            } else {
                // Handle not found
            }
        }
    }, [id, prompts, isLoaded])

    if (!isLoaded) {
        return <div className="p-8 text-center text-muted-foreground">Loading prompts...</div>
    }

    if (isLoaded && !prompt) {
        return <div className="p-8 text-center">Prompt not found</div>
    }

    return <PromptForm initialData={prompt} isEditing />
}

export default function EditPromptPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading...</div>}>
            <EditPromptContent />
        </Suspense>
    )
}
