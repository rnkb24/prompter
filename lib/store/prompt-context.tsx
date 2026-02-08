"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { Category, Prompt, PromptContextType } from '@/lib/types'

const PromptContext = createContext<PromptContextType | undefined>(undefined)

const DEFAULT_CATEGORIES: Category[] = [
    { id: '1', name: 'My Prompts', color: 'bg-yellow-100 text-yellow-700' },
    { id: '2', name: 'Brainstorming', color: 'bg-pink-100 text-pink-700' },
    { id: '3', name: 'Marketing', color: 'bg-blue-100 text-blue-700' },
    { id: '4', name: 'Coding', color: 'bg-green-100 text-green-700' },
    { id: '5', name: 'Nano Banana Pro', color: 'bg-purple-100 text-purple-700' },
]

const DEFAULT_PROMPTS: Prompt[] = [
    {
        id: 'nb-1',
        title: 'Modern Facade Update',
        content: 'Using this render of a contemporary facade, replace the facade material with weathered corten steel and integrate subtle vertical louvers of natural wood. Maintain the original lighting and perspective.',
        categoryId: '5',
        createdAt: Date.now(),
        updatedAt: Date.now(),
    },
    {
        id: 'nb-2',
        title: 'Daytime to Sunset',
        content: 'Using this daytime render of a building exterior, turn it into a sunset scene, add a few clouds to the sky, and incorporate warm artificial light spilling from the windows. Maintain the original building geometry.',
        categoryId: '5',
        createdAt: Date.now(),
        updatedAt: Date.now(),
    },
    {
        id: 'nb-3',
        title: 'Blueprint to 3D Render',
        content: 'Transform this blueprint image into a photorealistic 3D rendering of a contemporary high-rise building with a glass facade, showing realistic reflections and ambient city lighting at dusk.',
        categoryId: '5',
        createdAt: Date.now(),
        updatedAt: Date.now(),
    },
    {
        id: 'nb-4',
        title: 'Interior Morning Light',
        content: 'Transform this interior shot to show the space under soft, diffused morning light, with subtle volumetric fog filtering through the windows.',
        categoryId: '5',
        createdAt: Date.now(),
        updatedAt: Date.now(),
    },
    {
        id: 'nb-5',
        title: 'Adding Vegetation',
        content: 'From this base image of a residential building, emphasize the intricate brickwork details and add climbing ivy to one side of the facade. Add two minimalist concrete planters with tall green foliage near the entrance.',
        categoryId: '5',
        createdAt: Date.now(),
        updatedAt: Date.now(),
    },
    {
        id: 'nb-6',
        title: 'Style Transfer: Brutalist',
        content: 'Using this photograph of a historic building, reimagine it as a brutalist architecture concept, maintaining the original building\'s massing but using raw concrete finishes and repetitive modular elements.',
        categoryId: '5',
        createdAt: Date.now(),
        updatedAt: Date.now(),
    },
    {
        id: 'nb-7',
        title: 'Golden Hour Exterior',
        content: 'Modern sustainable office building exterior, featuring vertical gardens and solar panels, photographed from street level looking up, golden hour lighting with warm sunset glow, blue hour sky beginning to show, architectural photography style, sharp focus with high detail.',
        categoryId: '5',
        createdAt: Date.now(),
        updatedAt: Date.now(),
    },
]

export function PromptProvider({ children }: { children: React.ReactNode }) {
    const [prompts, setPrompts] = useState<Prompt[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [isLoaded, setIsLoaded] = useState(false)

    // Load from localStorage
    useEffect(() => {
        const storedPrompts = localStorage.getItem('prompts')
        const storedCategories = localStorage.getItem('categories')

        if (storedPrompts) {
            setPrompts(JSON.parse(storedPrompts))
        } else {
            setPrompts(DEFAULT_PROMPTS)
        }

        if (storedCategories) {
            setCategories(JSON.parse(storedCategories))
        } else {
            setCategories(DEFAULT_CATEGORIES)
        }
        setIsLoaded(true)
    }, [])

    // Save to localStorage
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('prompts', JSON.stringify(prompts))
        }
    }, [prompts, isLoaded])

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('categories', JSON.stringify(categories))
        }
    }, [categories, isLoaded])

    const addPrompt = (promptData: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>) => {
        const newPrompt: Prompt = {
            ...promptData,
            id: crypto.randomUUID(),
            createdAt: Date.now(),
            updatedAt: Date.now(),
        }
        setPrompts((prev) => [newPrompt, ...prev])
    }

    const updatePrompt = (id: string, updates: Partial<Omit<Prompt, 'id' | 'createdAt'>>) => {
        setPrompts((prev) =>
            prev.map((p) => (p.id === id ? { ...p, ...updates, updatedAt: Date.now() } : p))
        )
    }

    const deletePrompt = (id: string) => {
        setPrompts((prev) => prev.filter((p) => p.id !== id))
    }

    const addCategory = (categoryData: Omit<Category, 'id'>) => {
        const newCategory: Category = {
            ...categoryData,
            id: crypto.randomUUID(),
        }
        setCategories((prev) => [...prev, newCategory])
    }

    const updateCategory = (id: string, updates: Partial<Omit<Category, 'id'>>) => {
        setCategories((prev) =>
            prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
        )
    }

    const deleteCategory = (id: string) => {
        setCategories((prev) => prev.filter((c) => c.id !== id))
        setPrompts((prev) =>
            prev.map((p) => (p.categoryId === id ? { ...p, categoryId: "" } : p))
        )
    }

    return (
        <PromptContext.Provider
            value={{
                prompts,
                categories,
                addPrompt,
                updatePrompt,
                deletePrompt,
                addCategory,
                updateCategory,
                deleteCategory,
                isLoaded,
            }}
        >
            {children}
        </PromptContext.Provider>
    )
}

export function usePrompts() {
    const context = useContext(PromptContext)
    if (context === undefined) {
        throw new Error('usePrompts must be used within a PromptProvider')
    }
    return context
}
