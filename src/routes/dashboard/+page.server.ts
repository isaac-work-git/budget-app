import * as auth from '$lib/server/auth';
import { fail, redirect, type RequestEvent } from '@sveltejs/kit';
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

	const userExpenses = await db
		.select()
		.from(table.expenses)
		.where(eq(table.expenses.userId, locals.user.id)); // if you're scoping by user

	return {
		user: safeUser,
		expenses: userExpenses
	};
};

export const actions: Actions = {
	logout: async (event: RequestEvent<Partial<Record<string, string>>, string | null>) => {
		if (!event.locals.session) {
			return fail(401);
		}
		await auth.invalidateSession(event.locals.session.id);
		auth.deleteSessionTokenCookie(event);

		return redirect(302, '/');
	},

	income: async (event) => {
		const formData = await event.request.formData();
		const income = formData.get('income') as string;

		if (!event.locals.user) {
			return fail(401, { message: 'Unauthorized' });
		}

		try {
			await db
				.update(table.user)
				.set({ income: income })
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
		const description = formData.get('description') as string;
		const amount = formData.get('amount') as string;

		if (!event.locals.user) {
			return fail(401, { message: 'Unauthorized' });
		}

		try {
			await db.insert(table.expenses).values({
				description: description,
				amount: parseFloat(amount),
				userId: event.locals.user.id
			});
		} catch (error) {
			return fail(500, { message: 'An error has occurred' });
		}

		return {
			success: true
		};
	}

	// delete_expense: async (event) => {
	// 	const formData = await event.request.formData();
	// 	const id = formData.get('id') as string;

	// 	if (!event.locals.user) {
	// 		return fail(401, { message: 'Unauthorized' });
	// 	}

	// 	try {
	// 		await db.delete(table.expenses).where(eq(table.expenses.id, id));
	// 	} catch (error) {
	// 		return fail(500, { message: 'An error has occurred' });
	// 	}

	// 	return {
	// 		success: true
	// 	};
	// }
};
