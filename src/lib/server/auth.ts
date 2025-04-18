// src/lib/server/auth.ts
import { lucia } from 'lucia';
import { libsql } from '@lucia-auth/adapter-drizzle';
import { db } from '$lib/server';
import * as schema from '$lib/server/db';

export const auth = lucia({
	adapter: libsql(db, schema),
	env: import.meta.env.DEV ? 'DEV' : 'PROD',
	sessionCookie: {
		name: 'auth_session',
		attributes: {
			secure: !import.meta.env.DEV
		}
	}
});

export type Auth = typeof auth;
