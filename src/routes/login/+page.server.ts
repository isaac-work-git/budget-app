import { fail, redirect } from '@sveltejs/kit';
import { generateSessionToken, createSession, validateSessionToken } from '../../lib/server/session';  // Import your session logic
import { db, userTable } from '../../lib/server/db';  // Your Drizzle setup (adjust path as needed)
import { eq } from 'drizzle-orm';

export const actions = {
    login: async ({ request, cookies }) => {
        const formData = new URLSearchParams(await request.text());
        const username = formData.get('username') ?? '';
        const password = formData.get('password') ?? '';  // You will hash and verify this on the backend

        // 1. Verify username and password (make sure to hash and compare securely)
        const user = await db.select().from(userTable).where(eq(userTable.username, username)).first();
        if (!user || !verifyPassword(password, user.password)) {
            // Handle incorrect credentials
            return fail(400, { message: 'Invalid username or password' });
        }

        // 2. Generate session token
        const token = generateSessionToken();
        const session = await createSession(token, user.id);

        // 3. Store the token in the HTTP-only cookie
        cookies.set('session', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 30, // 30 days
            path: '/',
        });

        // 4. Redirect to the dashboard or any authenticated page
        throw redirect(303, '/dashboard');
    },

    // For the registration part, you would need to:
    // - Validate the user doesn’t already exist.
    // - Hash the password before storing it(e.g., bcrypt).
    // - Generate a session token and store it in the cookie.
    register: async ({ request, cookies }) => {
        // Similar to login, handle registration logic here
        // 1. Get form data and create user
        // 2. Generate session token
        // 3. Store session in cookie
        // 4. Redirect
    },
};

// Helper to verify password (adjust based on your hashing method)
function verifyPassword(plainPassword: string, hashedPassword: string): boolean {
    // Compare plain password with stored hash using a hashing library like bcrypt
    // return bcrypt.compareSync(plainPassword, hashedPassword);
    return plainPassword === hashedPassword;  // Simplified for demo purposes
}
