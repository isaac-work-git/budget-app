// import * as auth from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from '../$types';
import * as table from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		return redirect(302, '/');
	}

	const [fullUser] = await db.select().from(table.user).where(eq(table.user.id, locals.user.id));
	const { passwordHash, ...safeUser } = fullUser; // remove password
	// Check existing expenses
	let userExpenses = await db.select().from(table.expenses).where(eq(table.expenses.userId, locals.user.id));

	return {
		user: safeUser,
		expenses: userExpenses,
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
	}
};