// src/lib/utils/cookies.ts
import { browser } from '$app/environment';

/**
 * Helper pour lire un cookie côté client
 */
export function getCookie(name: string): string | null {
	if (!browser) return null;

	try {
		const value = `; ${document.cookie}`;
		const parts = value.split(`; ${name}=`);

		if (parts.length === 2) {
			const cookieValue = parts.pop()?.split(';').shift();
			return cookieValue ? decodeURIComponent(cookieValue) : null;
		}

		return null;
	} catch {
		return null;
	}
}

/**
 * Helper pour définir un cookie côté client
 */
export function setCookie(
	name: string,
	value: string,
	options: {
		expires?: Date | number;
		path?: string;
		domain?: string;
		secure?: boolean;
		sameSite?: 'strict' | 'lax' | 'none';
	} = {}
): void {
	if (!browser) return;

	try {
		let cookieString = `${name}=${encodeURIComponent(value)}`;

		if (options.expires) {
			const expires =
				options.expires instanceof Date ? options.expires : new Date(Date.now() + options.expires);
			cookieString += `; expires=${expires.toUTCString()}`;
		}

		if (options.path) cookieString += `; path=${options.path}`;
		if (options.domain) cookieString += `; domain=${options.domain}`;
		if (options.secure) cookieString += `; secure`;
		if (options.sameSite) cookieString += `; samesite=${options.sameSite}`;

		document.cookie = cookieString;
	} catch {
		// Ignore errors
	}
}

/**
 * Helper pour supprimer un cookie
 */
export function deleteCookie(name: string, path: string = '/'): void {
	if (!browser) return;
	setCookie(name, '', { expires: new Date(0), path });
}

/**
 * Helper pour obtenir tous les cookies
 */
export function getAllCookies(): Record<string, string> {
	if (!browser) return {};

	try {
		return document.cookie.split(';').reduce(
			(cookies, cookie) => {
				const [name, value] = cookie.trim().split('=');
				if (name && value) {
					cookies[name] = decodeURIComponent(value);
				}
				return cookies;
			},
			{} as Record<string, string>
		);
	} catch {
		return {};
	}
}
