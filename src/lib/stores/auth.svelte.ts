import { browser } from '$app/environment';
import { authClient } from '$lib/auth-client';

// État global simple avec rune $state
let session = $state(null);
let user = $state(null);
let isLoading = $state(true);

// Fonction pour charger la session
async function loadSession() {
	if (!browser) return;

	try {
		isLoading = true;
		const { data } = await authClient.getSession();
		session = data?.session || null;
		user = data?.user || null;
	} catch (error) {
		console.error('Erreur lors du chargement de la session:', error);
		session = null;
		user = null;
	} finally {
		isLoading = false;
	}
}

// Charger la session au démarrage
if (browser) {
	loadSession();
}

export const auth = {
	// Getters réactifs
	get isAuthenticated() {
		return !!session;
	},

	get user() {
		return user;
	},

	get session() {
		return session;
	},

	get isLoading() {
		return isLoading;
	},

	// Méthodes
	async refresh() {
		await loadSession();
	},

	async logout() {
		try {
			await authClient.signOut();
			session = null;
			user = null;
		} catch (error) {
			console.error('Erreur lors de la déconnexion:', error);
		}
	}
};
