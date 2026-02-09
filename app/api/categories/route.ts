import { NextResponse } from 'next/server';
import { db } from '@/db';
import { categories } from '@/db/schema';

export async function GET() {
    try {
        const allCategories = await db.select().from(categories);
        return NextResponse.json(allCategories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, color, icon } = body;

        const newCategory = await db.insert(categories).values({
            name,
            color,
            icon,
        }).returning();

        return NextResponse.json(newCategory[0]);
    } catch (error: any) {
        console.error('Error creating category:', error);
        return NextResponse.json({
            error: 'Failed to create category',
            details: error.message
        }, { status: 500 });
    }
}
