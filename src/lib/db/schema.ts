import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const budgets = sqliteTable('budgets', {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull(),
    name: text('name').notNull(),
    amount: integer('amount').notNull(),
});
