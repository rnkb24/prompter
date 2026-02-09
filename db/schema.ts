import { pgTable, text, timestamp, boolean, uuid } from 'drizzle-orm/pg-core';

export const categories = pgTable('categories', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    color: text('color'),
    icon: text('icon'),
});

export const prompts = pgTable('prompts', {
    id: uuid('id').defaultRandom().primaryKey(),
    title: text('title').notNull(),
    content: text('content').notNull(),
    categoryId: uuid('category_id').references(() => categories.id),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    isFavorite: boolean('is_favorite').default(false),
});
