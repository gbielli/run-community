// src/routes/runs/$types.d.ts

// Types basés sur le modèle Prisma existant (simple)
export interface Run {
	id: string;
	title: string;
	description: string;
	location: string;
	date: string; // String comme dans ton modèle Prisma
	time: string; // String comme dans ton modèle Prisma
	distance: string;
	pace: string;
	maxParticipants: number;
	currentParticipants: number;
	organizer: string;
	isJoined?: boolean; // Ajouté côté client
}

// Type pour l'utilisateur connecté (basé sur Better Auth)
export interface AuthUser {
	id: string;
	email: string;
	name: string | null;
	emailVerified: boolean;
	image: string | null;
	createdAt: Date;
	updatedAt: Date;
}

// Type pour les données de la page
export interface PageData {
	runs: Run[];
	user: AuthUser | null;
}

// Types pour les form actions
export type CreateRunFormData = {
	title: string;
	description?: string;
	location: string;
	date: string;
	time: string;
	distance?: string;
	pace?: string;
	maxParticipants: number;
};

export type ValidationError = {
	field: string;
	message: string;
};

// Type pour les résultats des actions
export type ActionData =
	| {
			success: true;
			message: string;
			runId?: string;
	  }
	| {
			success?: false; // success peut être undefined en cas d'erreur
			error: string;
			field?: string;
			validationErrors?: ValidationError[];
			values?: Partial<CreateRunFormData>;
	  }
	| null
	| undefined; // Les form actions peuvent retourner undefined

// Types d'action spécifiques
export type CreateRunAction = {
	success: boolean;
	message?: string;
	error?: string;
	runId?: string;
	values?: Partial<CreateRunFormData>;
};

export type JoinRunAction = {
	success: boolean;
	message?: string;
	error?: string;
};

export type LeaveRunAction = {
	success: boolean;
	message?: string;
	error?: string;
};

// Utility types pour une meilleure ergonomie
export type RunWithStatus = Run & {
	isJoined?: boolean;
	isPast?: boolean;
	isFull?: boolean;
	isOrganizer?: boolean;
};

// Types pour les filtres de recherche
export interface SearchFilters {
	distance?: string;
	location?: string;
	date?: string;
}

// Helper type pour les propriétés de formulaire
export type FormFieldError = {
	[K in keyof CreateRunFormData]?: string;
};

// Types pour l'état du formulaire
export interface FormState {
	isSubmitting: boolean;
	showForm: boolean;
	errors: FormFieldError;
	values: Partial<CreateRunFormData>;
}

// Export des types SvelteKit par défaut
export type { Actions, PageServerLoad } from '@sveltejs/kit';
