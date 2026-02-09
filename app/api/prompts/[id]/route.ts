import { NextResponse } from 'next/server';
import { db } from '@/db';
import { prompts } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { title, content, categoryId, isFavorite } = body;

        const updatedPrompt = await db.update(prompts)
            .set({
                title,
                content,
                categoryId,
                isFavorite,
                updatedAt: new Date(),
            })
            .where(eq(prompts.id, id))
            .returning();

        if (!updatedPrompt.length) {
            return NextResponse.json({ error: 'Prompt not found' }, { status: 404 });
        }

        return NextResponse.json(updatedPrompt[0]);
    } catch (error) {
        console.error('Error updating prompt:', error);
        return NextResponse.json({ error: 'Failed to update prompt' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        await db.delete(prompts).where(eq(prompts.id, id));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting prompt:', error);
        return NextResponse.json({ error: 'Failed to delete prompt' }, { status: 500 });
    }
}
