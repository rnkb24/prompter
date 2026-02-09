import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

import { db } from './index';
import { categories, prompts } from './schema';

const categoryIds = {
    myPrompts: crypto.randomUUID(),
    brainstorming: crypto.randomUUID(),
    marketing: crypto.randomUUID(),
    coding: crypto.randomUUID(),
    nano: crypto.randomUUID(),
};

const DEFAULT_CATEGORIES = [
    { id: categoryIds.myPrompts, name: 'My Prompts', color: 'bg-yellow-100 text-yellow-700' },
    { id: categoryIds.brainstorming, name: 'Brainstorming', color: 'bg-pink-100 text-pink-700' },
    { id: categoryIds.marketing, name: 'Marketing', color: 'bg-blue-100 text-blue-700' },
    { id: categoryIds.coding, name: 'Coding', color: 'bg-green-100 text-green-700' },
    { id: categoryIds.nano, name: 'Nano Banana Pro', color: 'bg-purple-100 text-purple-700' },
];

const DEFAULT_PROMPTS = [
    {
        id: crypto.randomUUID(),
        title: 'Modern Facade Update',
        content: 'Using this render of a contemporary facade, replace the facade material with weathered corten steel and integrate subtle vertical louvers of natural wood. Maintain the original lighting and perspective.',
        categoryId: categoryIds.nano,
    },
    {
        id: crypto.randomUUID(),
        title: 'Daytime to Sunset',
        content: 'Using this daytime render of a building exterior, turn it into a sunset scene, add a few clouds to the sky, and incorporate warm artificial light spilling from the windows. Maintain the original building geometry.',
        categoryId: categoryIds.nano,
    },
    {
        id: crypto.randomUUID(),
        title: 'Blueprint to 3D Render',
        content: 'Transform this blueprint image into a photorealistic 3D rendering of a contemporary high-rise building with a glass facade, showing realistic reflections and ambient city lighting at dusk.',
        categoryId: categoryIds.nano,
    },
    {
        id: crypto.randomUUID(),
        title: 'Interior Morning Light',
        content: 'Transform this interior shot to show the space under soft, diffused morning light, with subtle volumetric fog filtering through the windows.',
        categoryId: categoryIds.nano,
    },
    {
        id: crypto.randomUUID(),
        title: 'Adding Vegetation',
        content: 'From this base image of a residential building, emphasize the intricate brickwork details and add climbing ivy to one side of the facade. Add two minimalist concrete planters with tall green foliage near the entrance.',
        categoryId: categoryIds.nano,
    },
    {
        id: crypto.randomUUID(),
        title: 'Style Transfer: Brutalist',
        content: 'Using this photograph of a historic building, reimagine it as a brutalist architecture concept, maintaining the original building\'s massing but using raw concrete finishes and repetitive modular elements.',
        categoryId: categoryIds.nano,
    },
    {
        id: crypto.randomUUID(),
        title: 'Golden Hour Exterior',
        content: 'Modern sustainable office building exterior, featuring vertical gardens and solar panels, photographed from street level looking up, golden hour lighting with warm sunset glow, blue hour sky beginning to show, architectural photography style, sharp focus with high detail.',
        categoryId: categoryIds.nano,
    },
];

async function seed() {
    try {
        console.log('Starting database seeding...');

        // Check if categories already exist
        const existingCategories = await db.select().from(categories);
        if (existingCategories.length === 0) {
            console.log('Seeding categories...');
            await db.insert(categories).values(DEFAULT_CATEGORIES);
            console.log(`✓ Inserted ${DEFAULT_CATEGORIES.length} categories`);
        } else {
            console.log(`⊘ Categories already exist (${existingCategories.length} found), skipping...`);
        }

        // Check if prompts already exist
        const existingPrompts = await db.select().from(prompts);
        if (existingPrompts.length === 0) {
            console.log('Seeding prompts...');
            await db.insert(prompts).values(DEFAULT_PROMPTS);
            console.log(`✓ Inserted ${DEFAULT_PROMPTS.length} prompts`);
        } else {
            console.log(`⊘ Prompts already exist (${existingPrompts.length} found), skipping...`);
        }

        console.log('✓ Database seeding completed successfully!');
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seed();
