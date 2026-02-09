export interface Category {
    id: string;
    name: string;
    color?: string; // Hex code or tailwind class
    icon?: string; // Name of Lucide icon
}

export interface Prompt {
    id: string;
    title: string;
    content: string;
    categoryId: string | null;
    createdAt: number;
    updatedAt: number;
    isFavorite?: boolean;
}

export type PromptContextType = {
    prompts: Prompt[];
    categories: Category[];
    addPrompt: (prompt: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>) => void;
    updatePrompt: (id: string, updates: Partial<Omit<Prompt, 'id' | 'createdAt'>>) => void;
    deletePrompt: (id: string) => void;
    addCategory: (category: Omit<Category, 'id'>) => void;
    updateCategory: (id: string, updates: Partial<Omit<Category, 'id'>>) => void;
    deleteCategory: (id: string) => void;
    isLoaded: boolean;
}
