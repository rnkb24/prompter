"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { Category, Prompt, PromptContextType, PromptJSON } from '@/lib/types'

const PromptContext = createContext<PromptContextType | undefined>(undefined)


export function PromptProvider({ children }: { children: React.ReactNode }) {
    const [prompts, setPrompts] = useState<Prompt[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [isLoaded, setIsLoaded] = useState(false)

    // Load from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [promptsRes, categoriesRes] = await Promise.all([
                    fetch('/api/prompts'),
                    fetch('/api/categories')
                ]);

                if (promptsRes.ok) {
                    const data: PromptJSON[] = await promptsRes.json();
                    setPrompts(data.map((p) => ({
                        ...p,
                        createdAt: new Date(p.createdAt).getTime(),
                        updatedAt: new Date(p.updatedAt).getTime()
                    })));
                }

                if (categoriesRes.ok) {
                    const data: Category[] = await categoriesRes.json();
                    setCategories(data);
                }
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setIsLoaded(true);
            }
        };

        fetchData();
    }, [])

    const addPrompt = async (promptData: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>) => {
        try {
            const res = await fetch('/api/prompts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(promptData),
            });

            if (res.ok) {
                const newPrompt: PromptJSON = await res.json();
                setPrompts((prev) => [{
                    ...newPrompt,
                    createdAt: new Date(newPrompt.createdAt).getTime(),
                    updatedAt: new Date(newPrompt.updatedAt).getTime()
                }, ...prev]);
            }
        } catch (error) {
            console.error('Failed to add prompt:', error);
        }
    }

    const updatePrompt = async (id: string, updates: Partial<Omit<Prompt, 'id' | 'createdAt'>>) => {
        // Optimistic update
        setPrompts((prev) =>
            prev.map((p) => (p.id === id ? { ...p, ...updates, updatedAt: Date.now() } : p))
        )

        try {
            await fetch(`/api/prompts/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates),
            });
        } catch (error) {
            console.error('Failed to update prompt:', error);
            // Revert on failure would go here
        }
    }

    const deletePrompt = async (id: string) => {
        // Optimistic update
        setPrompts((prev) => prev.filter((p) => p.id !== id))

        try {
            await fetch(`/api/prompts/${id}`, {
                method: 'DELETE',
            });
        } catch (error) {
            console.error('Failed to delete prompt:', error);
        }
    }

    const addCategory = async (categoryData: Omit<Category, 'id'>) => {
        try {
            const res = await fetch('/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(categoryData),
            });

            if (res.ok) {
                const newCategory: Category = await res.json();
                setCategories((prev) => [...prev, newCategory]);
            }
        } catch (error) {
            console.error('Failed to add category:', error);
        }
    }

    const updateCategory = async (id: string, updates: Partial<Omit<Category, 'id'>>) => {
        setCategories((prev) =>
            prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
        )

        try {
            await fetch(`/api/categories/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates),
            });
        } catch (error) {
            console.error('Failed to update category:', error);
        }
    }

    const deleteCategory = async (id: string) => {
        setCategories((prev) => prev.filter((c) => c.id !== id))
        setPrompts((prev) =>
            prev.map((p) => (p.categoryId === id ? { ...p, categoryId: "" } : p))
        )

        try {
            await fetch(`/api/categories/${id}`, {
                method: 'DELETE',
            });
        } catch (error) {
            console.error('Failed to delete category:', error);
        }
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
