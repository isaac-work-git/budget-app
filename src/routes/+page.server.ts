import { hash, verify } from '@node-rs/argon2';
import { encodeBase32LowerCase } from '@oslojs/encoding';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
    if (event.locals.user) {
        return redirect(302, '/dashboard');
    }
    return {};
};

export const actions: Actions = {
    login: async (event) => {
        const formData = await event.request.formData();
        const username = formData.get('username');
        const password = formData.get('password');

        if (!validateUsername(username)) {
            return fail(400, {
                message: 'Invalid username (min 3, max 31 characters, alphanumeric only)'
            });
        }
        if (!validatePassword(password)) {
            return fail(400, { message: 'Invalid password (min 6, max 255 characters)' });
        }

        const normalizedUsername = (username as string).toLowerCase();
        const results = await db.select().from(table.user).where(eq(table.user.username, normalizedUsername));
        const existingUser = results.at(0) as table.User;
        if (!existingUser) {
            return fail(400, { message: 'Incorrect username or password' });
        }

        const validPassword = await verify(
            existingUser.passwordHash as string,
            password as string,
            {
                memoryCost: 19456,
                timeCost: 2,
                outputLen: 32,
                parallelism: 1
            }
        );
        if (!validPassword) {
            return fail(400, { message: 'Incorrect username or password' });
        }

        const sessionToken = auth.generateSessionToken();
        const session = await auth.createSession(sessionToken, existingUser.id as string);
        auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

        return redirect(302, '/dashboard');
    },
    register: async (event) => {
        const formData = await event.request.formData();
        const username = formData.get('username');
        const password = formData.get('password');

        if (!validateUsername(username)) {
            return fail(400, { message: 'Invalid username' });
        }
        if (!validatePassword(password)) {
            return fail(400, { message: 'Invalid password' });
        }

        const normalizedUsername = (username as string).toLowerCase();
        const results = await db.select().from(table.user).where(eq(table.user.username, normalizedUsername));
        if (results.length > 0) {
            return fail(400, { message: 'Username already exists' });
        }

        const userId = generateUserId();
        const passwordHash = await hash(password, {
            // recommended minimum parameters
            memoryCost: 19456,
            timeCost: 2,
            outputLen: 32,
            parallelism: 1
        });

        try {
            await db.insert(table.user).values({ id: userId, username: normalizedUsername, displayName: username, passwordHash });

            const sessionToken = auth.generateSessionToken();
            const session = await auth.createSession(sessionToken, userId);
            auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
        } catch (error) {
            return fail(500, { message: error instanceof Error ? error.message : 'An error has occurred' });
        }
        return redirect(302, '/dashboard');
    }
};

function generateUserId() {
    // ID with 120 bits of entropy, or about the same as UUID v4.
    const bytes = crypto.getRandomValues(new Uint8Array(15));
    const id = encodeBase32LowerCase(bytes);
    return id;
}

function validateUsername(username: unknown): username is string {
    return (
        typeof username === 'string' &&
        username.length >= 3 &&
        username.length <= 31 &&
        /^[a-zA-Z0-9_-]+$/.test(username)
    );
}

function validatePassword(password: unknown): password is string {
    return typeof password === 'string' && password.length >= 6 && password.length <= 255;
}
