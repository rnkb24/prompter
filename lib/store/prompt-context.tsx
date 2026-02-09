"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { Category, Prompt, PromptContextType } from '@/lib/types'

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
                    const data = await promptsRes.json();
                    setPrompts(data.map((p: any) => ({
                        ...p,
                        createdAt: new Date(p.createdAt).getTime(),
                        updatedAt: new Date(p.updatedAt).getTime()
                    })));
                } else {
                    console.error('Failed to fetch prompts:', await promptsRes.text());
                }

                if (categoriesRes.ok) {
                    const data = await categoriesRes.json();
                    setCategories(data);
                } else {
                    console.error('Failed to fetch categories:', await categoriesRes.text());
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
                const newPrompt = await res.json();
                setPrompts((prev) => [{
                    ...newPrompt,
                    createdAt: new Date(newPrompt.createdAt).getTime(),
                    updatedAt: new Date(newPrompt.updatedAt).getTime()
                }, ...prev]);
            } else {
                const errorData = await res.json().catch(() => ({}));
                const errorMessage = errorData.details || errorData.error || 'Unknown error';
                console.error('Failed to add prompt:', errorMessage);
                alert('Failed to save prompt: ' + errorMessage);
            }
        } catch (error) {
            console.error('Failed to add prompt:', error);
            alert('Failed to save prompt. Please check your connection.');
        }
    }

    const updatePrompt = async (id: string, updates: Partial<Omit<Prompt, 'id' | 'createdAt'>>) => {
        // Optimistic update
        setPrompts((prev) =>
            prev.map((p) => (p.id === id ? { ...p, ...updates, updatedAt: Date.now() } : p))
        )

        try {
            const res = await fetch(`/api/prompts/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates),
            });
            if (!res.ok) {
                 const errorData = await res.json().catch(() => ({}));
                 console.error('Failed to update prompt:', errorData);
                 alert('Failed to update prompt. Changes may not be saved.');
            }
        } catch (error) {
            console.error('Failed to update prompt:', error);
            // Revert on failure would go here
            alert('Failed to update prompt. Please check your connection.');
        }
    }

    const deletePrompt = async (id: string) => {
        // Optimistic update
        setPrompts((prev) => prev.filter((p) => p.id !== id))

        try {
            const res = await fetch(`/api/prompts/${id}`, {
                method: 'DELETE',
            });
             if (!res.ok) {
                 console.error('Failed to delete prompt:', await res.text());
                 alert('Failed to delete prompt.');
            }
        } catch (error) {
            console.error('Failed to delete prompt:', error);
            alert('Failed to delete prompt. Please check your connection.');
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
                const newCategory = await res.json();
                setCategories((prev) => [...prev, newCategory]);
            } else {
                const errorData = await res.json().catch(() => ({}));
                const errorMessage = errorData.details || errorData.error || 'Unknown error';
                console.error('Failed to add category:', errorMessage);
                alert('Failed to add category: ' + errorMessage);
            }
        } catch (error) {
            console.error('Failed to add category:', error);
            alert('Failed to add category. Please check your connection.');
        }
    }

    const updateCategory = async (id: string, updates: Partial<Omit<Category, 'id'>>) => {
        setCategories((prev) =>
            prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
        )

        try {
            const res = await fetch(`/api/categories/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates),
            });
            if (!res.ok) {
                 console.error('Failed to update category:', await res.text());
                 alert('Failed to update category.');
            }
        } catch (error) {
            console.error('Failed to update category:', error);
            alert('Failed to update category. Please check your connection.');
        }
    }

    const deleteCategory = async (id: string) => {
        setCategories((prev) => prev.filter((c) => c.id !== id))
        setPrompts((prev) =>
            prev.map((p) => (p.categoryId === id ? { ...p, categoryId: "" } : p))
        )

        try {
            const res = await fetch(`/api/categories/${id}`, {
                method: 'DELETE',
            });
            if (!res.ok) {
                 console.error('Failed to delete category:', await res.text());
                 alert('Failed to delete category.');
            }
        } catch (error) {
            console.error('Failed to delete category:', error);
             alert('Failed to delete category. Please check your connection.');
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
