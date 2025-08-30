// src/routes/runs/+page.server.ts - Version avec relations
import { auth } from '$lib/server/auth';
import { prisma } from '$lib/server/prisma';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ request }) => {
	const session = await auth.api.getSession({
		headers: request.headers
	});

	try {
		// Récupérer tous les runs avec relations
		const runs = await prisma.run.findMany({
			include: {
				organizer: {
					select: {
						id: true,
						name: true,
						email: true
					}
				},
				participants: {
					include: {
						user: {
							select: {
								id: true,
								name: true
							}
						}
					}
				},
				_count: {
					select: {
						participants: true
					}
				}
			},
			orderBy: [{ date: 'asc' }, { time: 'asc' }]
		});

		// Transformer pour le frontend
		const transformedRuns = runs.map((run) => ({
			id: run.id,
			title: run.title,
			description: run.description || '',
			location: run.location,
			date: run.date,
			time: run.time,
			distance: run.distance || '',
			pace: run.pace || '',
			maxParticipants: run.maxParticipants,
			currentParticipants: run._count.participants,
			organizer: run.organizer.name || run.organizer.email,
			organizerId: run.organizer.id,
			isJoined: session?.user ? run.participants.some((p) => p.userId === session.user.id) : false
		}));

		return {
			runs: transformedRuns,
			user: session?.user || null
		};
	} catch (error) {
		console.error('Erreur lors du chargement des runs:', error);
		return {
			runs: [],
			user: session?.user || null
		};
	}
};

export const actions = {
	createRun: async ({ request }) => {
		const session = await auth.api.getSession({
			headers: request.headers
		});

		if (!session?.user) {
			return redirect(302, '/auth/login');
		}

		const data = await request.formData();
		const title = data.get('title') as string;
		const description = data.get('description') as string;
		const location = data.get('location') as string;
		const date = data.get('date') as string;
		const time = data.get('time') as string;
		const distance = data.get('distance') as string;
		const pace = data.get('pace') as string;
		const maxParticipants = parseInt(data.get('maxParticipants') as string) || 10;

		// Validation (même logique)
		const validationErrors = [];

		if (!title?.trim()) {
			validationErrors.push({ field: 'title', message: 'Le titre est requis' });
		}

		if (!location?.trim()) {
			validationErrors.push({ field: 'location', message: 'Le lieu est requis' });
		}

		if (!date) {
			validationErrors.push({ field: 'date', message: 'La date est requise' });
		}

		if (!time) {
			validationErrors.push({ field: 'time', message: "L'heure est requise" });
		}

		if (date && time) {
			const runDateTime = new Date(`${date}T${time}`);
			const now = new Date();

			if (runDateTime <= now) {
				validationErrors.push({
					field: 'date',
					message: "La date et l'heure doivent être dans le futur"
				});
			}
		}

		if (maxParticipants < 1 || maxParticipants > 50) {
			validationErrors.push({
				field: 'maxParticipants',
				message: 'Le nombre de participants doit être entre 1 et 50'
			});
		}

		if (validationErrors.length > 0) {
			return fail(400, {
				error: validationErrors[0].message,
				field: validationErrors[0].field,
				validationErrors,
				values: {
					title,
					description,
					location,
					date,
					time,
					distance,
					pace,
					maxParticipants
				}
			});
		}

		try {
			// Créer le run avec relation organisateur
			const newRun = await prisma.run.create({
				data: {
					title: title.trim(),
					description: description?.trim(),
					location: location.trim(),
					date: date,
					time: time,
					distance: distance?.trim(),
					pace: pace?.trim(),
					maxParticipants,
					organizerId: session.user.id // Utilise l'ID utilisateur
				}
			});

			// Ajouter l'organisateur comme participant
			await prisma.runParticipant.create({
				data: {
					userId: session.user.id,
					runId: newRun.id
				}
			});

			return {
				success: true,
				message: 'Run créé avec succès !',
				runId: newRun.id
			};
		} catch (error) {
			console.error('Erreur lors de la création du run:', error);
			return fail(500, {
				error: 'Une erreur est survenue lors de la création du run. Veuillez réessayer.',
				values: {
					title,
					description,
					location,
					date,
					time,
					distance,
					pace,
					maxParticipants
				}
			});
		}
	},

	joinRun: async ({ request }) => {
		const session = await auth.api.getSession({
			headers: request.headers
		});

		if (!session?.user) {
			return redirect(302, '/auth/login');
		}

		const data = await request.formData();
		const runId = data.get('runId') as string;

		if (!runId) {
			return fail(400, { error: 'ID du run manquant' });
		}

		try {
			// Vérifier que le run existe
			const run = await prisma.run.findUnique({
				where: { id: runId },
				include: {
					_count: {
						select: {
							participants: true
						}
					}
				}
			});

			if (!run) {
				return fail(404, { error: 'Run introuvable' });
			}

			// Vérifications (complet, déjà inscrit, etc.)
			if (run._count.participants >= run.maxParticipants) {
				return fail(400, { error: 'Ce run est complet' });
			}

			const existingParticipation = await prisma.runParticipant.findUnique({
				where: {
					userId_runId: {
						userId: session.user.id,
						runId: runId
					}
				}
			});

			if (existingParticipation) {
				return fail(400, { error: 'Vous êtes déjà inscrit à ce run' });
			}

			const runDateTime = new Date(`${run.date}T${run.time}`);
			if (runDateTime <= new Date()) {
				return fail(400, { error: 'Impossible de rejoindre un run passé' });
			}

			// Ajouter la participation
			await prisma.runParticipant.create({
				data: {
					userId: session.user.id,
					runId: runId
				}
			});

			return {
				success: true,
				message: 'Vous avez rejoint le run avec succès !'
			};
		} catch (error) {
			console.error("Erreur lors de l'inscription au run:", error);
			return fail(500, {
				error: "Une erreur est survenue lors de l'inscription. Veuillez réessayer."
			});
		}
	}
} satisfies Actions;
