import { real } from 'drizzle-orm/gel-core';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
	id: text('id').primaryKey(),
	income: real('income'),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull()
});

export const session = sqliteTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
});

export const expenses = sqliteTable('expenses', {
	id: text('id').primaryKey(),
	description: text('description').notNull(),
	amount: real('amount').notNull(),
	actualAmount: real('actual_amount').notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id)
});

export const grocery = sqliteTable('grocery', {
	id: text('id').primaryKey(),
	amount: real('amount').notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id)
});

export type Session = typeof session.$inferSelect;

export type User = typeof user.$inferSelect;

export type Expense = typeof expenses.$inferSelect;

export type Grocery = typeof grocery.$inferSelect;
