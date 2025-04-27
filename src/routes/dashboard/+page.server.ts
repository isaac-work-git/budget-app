// import * as auth from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from '../$types';
import * as table from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { and, eq } from 'drizzle-orm';
import { encodeBase32LowerCase } from '@oslojs/encoding';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		return redirect(302, '/');
	}

	const [fullUser] = await db.select().from(table.user).where(eq(table.user.id, locals.user.id));
	const { passwordHash, ...safeUser } = fullUser; // remove password
	const userExpenses = await db
		.select()
		.from(table.expenses)
		.where(eq(table.expenses.userId, locals.user.id)); // if you're scoping by user
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
			id: `${month}-week-${i + 1}`,
			amount: 0,
			userId: locals.user.id
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
		expenses: userExpenses as { description: string; amount: number }[],
		groceryItems
	};
};

export const actions: Actions = {
	income: async (event) => {
		const formData = await event.request.formData();
		const rawIncome = formData.get('income') as string;
		const cleanedIncome = rawIncome.replace(/[^0-9.]/g, '');
		const parsedIncome = parseFloat(cleanedIncome);

		if (!event.locals.user) {
			return fail(401, { message: 'Unauthorized' });
		}

		try {
			await db
				.update(table.user)
				.set({ income: parsedIncome })
				.where(eq(table.user.id, event.locals.user.id));
		} catch (error) {
			return fail(500, { message: 'An error has occurred' });
		}

		return {
			success: true
		};
	},

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
					userId: event.locals.user.id
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