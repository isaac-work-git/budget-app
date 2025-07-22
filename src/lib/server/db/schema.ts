import { real } from 'drizzle-orm/gel-core';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
	id: text('id').primaryKey(),
	income: real('income'),
	username: text('username').notNull().unique(),
	displayName: text('display_name').notNull().unique(),
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

export const investments = sqliteTable('investments', {
	id: text('id').primaryKey(),
	description: text('description').notNull(),
	amount: real('amount').notNull(),
	actualAmount: real('actual_amount').notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id)
});

export const housing = sqliteTable('housing', {
	id: text('id').primaryKey(),
	description: text('description').notNull(),
	amount: real('amount').notNull(),
	actualAmount: real('actual_amount').notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id)
});

export const car = sqliteTable('car', {
	id: text('id').primaryKey(),
	description: text('description').notNull(),
	amount: real('amount').notNull(),
	actualAmount: real('actual_amount').notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id)
});

export const loans = sqliteTable('loans', {
	id: text('id').primaryKey(),
	description: text('description').notNull(),
	amount: real('amount').notNull(),
	actualAmount: real('actual_amount').notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id)
});

export const fun = sqliteTable('fun', {
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

export type Investment = typeof investments.$inferSelect;

export type Housing = typeof housing.$inferSelect;

export type Car = typeof car.$inferSelect;

export type Loan = typeof loans.$inferSelect;

export type Fun = typeof fun.$inferSelect;

export type Grocery = typeof grocery.$inferSelect;
