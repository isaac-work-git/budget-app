import type { Handle } from '@sveltejs/kit';
import * as auth from '$lib/server/auth.js';

export const handle: Handle = async ({ event, resolve }) => {
	const session = await auth.validateRequest(event.request);
	event.locals.user = session.user;
	event.locals.session = session.session;

	return resolve(event);
};