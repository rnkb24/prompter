import { NextResponse } from 'next/server';
import { db } from '@/db';
import { categories } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { name, color, icon } = body;

        const updatedCategory = await db.update(categories)
            .set({
                name,
                color,
                icon,
            })
            .where(eq(categories.id, id))
            .returning();

        if (!updatedCategory.length) {
            return NextResponse.json({ error: 'Category not found' }, { status: 404 });
        }

        return NextResponse.json(updatedCategory[0]);
    } catch (error) {
        console.error('Error updating category:', error);
        return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        await db.delete(categories).where(eq(categories.id, id));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting category:', error);
        return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
    }
}
