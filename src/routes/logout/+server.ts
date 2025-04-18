// src/routes/logout/+server.ts
import { auth } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';

export const POST = async ({ locals, cookies }) => {
    if (locals.session) {
        await auth.invalidateSession(locals.session.id);
        const sessionCookie = auth.createBlankSessionCookie();
        cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    }
    throw redirect(302, '/login');
};
