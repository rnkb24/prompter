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

        // Validate ID format
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(id)) {
            return NextResponse.json({ error: 'Invalid prompt ID' }, { status: 400 });
        }

        let body;
        try {
            body = await request.json();
        } catch (error) {
            return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
        }

        const { title, content, categoryId, isFavorite } = body;
        const errors: string[] = [];

        // Validation logic
        if (title !== undefined) {
            if (typeof title !== 'string') {
                errors.push('Title must be a string');
            } else if (title.trim() === '') {
                errors.push('Title cannot be empty');
            }
        }

        if (content !== undefined) {
            if (typeof content !== 'string') {
                errors.push('Content must be a string');
            } else if (content.trim() === '') {
                errors.push('Content cannot be empty');
            }
        }

        if (categoryId !== undefined && categoryId !== null) {
            if (typeof categoryId !== 'string' || !uuidRegex.test(categoryId)) {
                errors.push('Invalid categoryId format');
            }
        }

        if (isFavorite !== undefined && typeof isFavorite !== 'boolean') {
            errors.push('isFavorite must be a boolean');
        }

        if (errors.length > 0) {
            return NextResponse.json({ error: 'Validation failed', details: errors }, { status: 400 });
        }

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

        // Validate ID format
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(id)) {
            return NextResponse.json({ error: 'Invalid prompt ID' }, { status: 400 });
        }

        await db.delete(prompts).where(eq(prompts.id, id));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting prompt:', error);
        return NextResponse.json({ error: 'Failed to delete prompt' }, { status: 500 });
    }
}
