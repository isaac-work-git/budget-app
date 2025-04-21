import * as auth from '$lib/server/auth';
import { fail, redirect, type RequestEvent } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from '../$types';
import * as table from '$lib/server/db/schema';
import { db } from '$lib/server/db';

export const load: PageServerLoad = async (event: { locals: { user: any; }; }) => {
	if (!event.locals.user) {
		return redirect(302, '/');
	}
	return { user: event.locals.user };
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

	format: async ({ request }) => {
		const formData = await request.formData();
		const income = formData.get('income') as string;

		// Format on server
		const parsed = parseFloat(income.replace(/[^\d.-]/g, ''));
		const formattedIncome = new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			maximumFractionDigits: 2,
			minimumFractionDigits: 2
		}).format(parsed);

		// Save to DB or pass to the page as form output
		try {
			await db.insert(table.user).values({ id: income });
		} catch (error) {
			return fail(500, { message: 'An error has occurred' });
		}
		return {
			success: true,
			formattedIncome
		};
	},
};