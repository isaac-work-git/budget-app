import type { Actions, PageServerLoad } from '../$types';
import { fail, redirect } from '@sveltejs/kit';
import * as table from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { and, eq } from 'drizzle-orm';
import { encodeBase32LowerCase } from '@oslojs/encoding';

const DEFAULT_EXPENSES = [
	{ description: 'Rent/Mortgage' },
	{ description: 'Tithing' },
	{ description: 'Electricity Bill' },
	{ description: 'Groceries' },
	{ description: 'Dining Out' },
	{ description: 'Car Payment' },
	{ description: 'Insurance' },
	{ description: 'Gas' },
	{ description: '529 Plan' },
	{ description: 'Toiletries' },
	{ description: 'Ashtyn Fun' },
	{ description: 'Isaac Fun' },
	{ description: 'Wells Fun' },
	{ description: 'Savings Deposit' },
	{ description: 'Other' }
];

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		return redirect(302, '/');
	}

	// locals.user is guaranteed to be non-null after the above check
	const [fullUser] = await db.select().from(table.user).where(eq(table.user.id, locals.user.id));
	const { passwordHash, ...safeUser } = fullUser; // remove password
	// Check existing expenses
	let userExpenses = await db.select().from(table.expenses).where(eq(table.expenses.userId, locals.user.id));

    // ✅ Auto-create default expenses if user has none
    if (userExpenses.length === 0) {
        console.log('No expenses found. Creating default expenses...');
        await db.insert(table.expenses).values(
            DEFAULT_EXPENSES.map((exp) => ({
                id: generateId(),
                description: exp.description,
                amount: 0,
                actualAmount: 0,
				userId: locals.user!.id
            }))
        );

        // ✅ Fetch again after inserting
        userExpenses = await db.select().from(table.expenses).where(eq(table.expenses.userId, locals.user.id));
    }

    // Fetch existing groceries
    let groceryItems = await db
        .select()
        .from(table.grocery)
        .where(eq(table.grocery.userId, locals.user.id));

    // If empty, create default weeks
    if (groceryItems.length === 0) {
        const now = new Date();
        const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

        const newGroceryItems = Array.from({ length: 5 }, (_, i) => ({
			id: `${locals.user!.id}-${month}-week-${i + 1}`,
            amount: 0,
			userId: locals.user!.id
        }));

        await db.insert(table.grocery).values(newGroceryItems);

        // Fetch again after inserting
        groceryItems = await db
            .select()
            .from(table.grocery)
            .where(eq(table.grocery.userId, locals.user.id));
    }

    return {
        user: safeUser,
        expenses: userExpenses,
        groceryItems
    };
};

export const actions: Actions = {
add_expense: async (event) => {
		const formData = await event.request.formData();
		const rawExpenses = formData.get('expenses') as string;

		if (!event.locals.user) {
			return fail(401, { message: 'Unauthorized' });
		}

		try {
			const expenses = JSON.parse(rawExpenses);
			await db.delete(table.expenses).where(eq(table.expenses.userId, event.locals.user.id));

			await db.insert(table.expenses).values(
				expenses.map((item: any) => ({
					id: generateId(),
					description: item.description,
					amount: parseFloat(item.amount),
					userId: event.locals.user!.id
				}))
			);
		} catch (error) {
			console.error(error);
			return fail(500, { message: 'An error has occurred' });
		}

		return {
			success: true
		};
	},

	update_expense: async ({ request, locals }) => {
		if (!locals.user) {
			return fail(401, { message: 'Unauthorized' });
		}

		const formData = await request.formData();
		const rawExpense = formData.get('expense');

		if (typeof rawExpense !== 'string') {
			return fail(400, { message: 'Invalid data' });
		}

		try {
			const expense = JSON.parse(rawExpense);

			if (!expense.description) {
				return fail(400, { message: 'Missing expense description' });
			}

			// Update expense based on description + userId
			await db.update(table.expenses)
				.set({
					amount: expense.estimatedAmount,
					actualAmount: expense.actualAmount
				})
				.where(
					and(
						eq(table.expenses.userId, locals.user.id),
						eq(table.expenses.description, String(expense.description))
					)
				);

			// Optional: if you want to also store actualAmount separately, you can expand the schema later
		} catch (err) {
			console.error('Failed to update expense', err);
			return fail(500, { message: 'Internal Server Error' });
		}

		return { success: true };
	},

	update_grocery: async (event) => {
		const formData = await event.request.formData();
		const rawGroceryItem = formData.get('groceryItem') as string;

		if (!event.locals.user) {
			return fail(401, { message: 'Unauthorized' });
		}

		try {
			const groceryItem = JSON.parse(rawGroceryItem);
			const amount = parseFloat(groceryItem.amount);
			if (isNaN(amount)) {
				console.error('Invalid amount value:', groceryItem.amount);
				return fail(400, { message: 'Invalid amount value' });
			}

			await db
				.update(table.grocery)
				.set({ amount })
				.where(
					and(
						eq(table.grocery.userId, event.locals.user.id),
						eq(table.grocery.id, groceryItem.id)
					)
				);

		} catch (error) {
			console.error('Failed to update grocery item:', error);
			return fail(500, { message: 'Server error updating grocery' });
		}

		return { success: true };
	}
};

function generateId() {
    const bytes = crypto.getRandomValues(new Uint8Array(15));
    const id = encodeBase32LowerCase(bytes);
    return id;
}