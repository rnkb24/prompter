import { NextResponse } from 'next/server';
import { db } from '@/db';
import { prompts } from '@/db/schema';
import { desc } from 'drizzle-orm';

export async function GET() {
    try {
        const allPrompts = await db.select().from(prompts).orderBy(desc(prompts.createdAt));
        return NextResponse.json(allPrompts);
    } catch (error) {
        console.error('Error fetching prompts:', error);
        return NextResponse.json({ error: 'Failed to fetch prompts' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, content, categoryId, isFavorite } = body;

        const newPrompt = await db.insert(prompts).values({
            title,
            content,
            categoryId,
            isFavorite,
        }).returning();

        return NextResponse.json(newPrompt[0]);
    } catch (error) {
        console.error('Error creating prompt:', error);
        return NextResponse.json({ error: 'Failed to create prompt' }, { status: 500 });
    }
}
