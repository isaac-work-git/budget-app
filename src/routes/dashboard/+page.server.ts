// import * as auth from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from '../$types';
import * as table from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { eq, and } from 'drizzle-orm';
// import { encodeBase32LowerCase } from '@oslojs/encoding';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		return redirect(302, '/');
	}

	const currentMonth = new Date().getMonth() + 1;
	const currentYear = new Date().getFullYear();	
	const [fullUser] = await db.select().from(table.user).where(eq(table.user.id, locals.user.id));
	
	const budget = await db
		.select()
		.from(table.monthlyBudget)
		.where(
			and(
				eq(table.monthlyBudget.userId, locals.user.id),
				eq(table.monthlyBudget.month, currentMonth),
				eq(table.monthlyBudget.year, currentYear)
			)
		);
	// Check existing expenses
	const userExpenses = await db.select().from(table.expenses).where(eq(table.expenses.userId, locals.user.id));
	const safeUser = {
		id: locals.user.id,
		username: locals.user.username,
		displayName: fullUser.displayName || locals.user.username,
	};

	return {
		user: safeUser,
		expenses: userExpenses,
		budget: budget,
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
				.update(table.monthlyBudget)
				.set({ income: parsedIncome })
				.where(eq(table.monthlyBudget.userId, event.locals.user.id));
		} catch (error) {
            return fail(500, { message: error instanceof Error ? error.message : 'An error has occurred' });
        }
		return {
			success: true
		};
	}
};

// function generateId() {
// 	const bytes = crypto.getRandomValues(new Uint8Array(15));
// 	const id = encodeBase32LowerCase(bytes);
// 	return id;
// }