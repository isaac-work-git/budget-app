import { fail, redirect, type RequestEvent } from '@sveltejs/kit';
import * as auth from '$lib/server/auth';
import type { Actions } from './$types';

export const actions: Actions = {
    default: async (event: RequestEvent<Partial<Record<string, string>>, string | null>) => {
        if (!event.locals.session) {
            return fail(401);
        }
        await auth.invalidateSession(event.locals.session.id);
        auth.deleteSessionTokenCookie(event);

        throw redirect(302, '/');
    }
}