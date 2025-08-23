import { building } from '$app/environment';
import { auth } from '$lib/server/auth';
import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { svelteKitHandler } from 'better-auth/svelte-kit';

// Configuration des routes protégées
const PROTECTED_ROUTES = ['/dashboard', '/profile'];

export const handle: Handle = async ({ event, resolve }) => {
	// Fetch current session from Better Auth
	const session = await auth.api.getSession({
		headers: event.request.headers
	});

	// Make session and user available on server
	if (session) {
		event.locals.session = session.session;
		event.locals.user = session.user;
	}

	if (!session) {
		if (PROTECTED_ROUTES.includes(event.url.pathname)) {
			return redirect(302, '/auth/login');
		}
	}

	return svelteKitHandler({ event, resolve, auth, building });
};
