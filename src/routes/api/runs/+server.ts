// src/routes/api/runs/+server.ts

import { json } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';
import type { RequestHandler } from '@sveltejs/kit';

const prisma = new PrismaClient();

// GET /api/runs - Récupérer tous les runs
export const GET: RequestHandler = async ({ url, locals }) => {
	try {
		const userId = locals.user?.id; // Supposons que l'user est dans locals après auth

		const runs = await prisma.run.findMany({
			include: {
				organizer: {
					select: {
						id: true,
						name: true,
						email: true,
						image: true
					}
				},
				participants: {
					include: {
						user: {
							select: {
								id: true,
								name: true,
								email: true,
								image: true
							}
						}
					}
				}
			},
			orderBy: {
				date: 'asc'
			}
		});

		// Enrichir avec les infos utilisateur
		const enrichedRuns = runs.map((run) => ({
			...run,
			currentParticipants: run.participants.length,
			isUserParticipant: userId ? run.participants.some((p) => p.userId === userId) : false,
			isUserOrganizer: userId ? run.organizerId === userId : false
		}));

		return json(enrichedRuns);
	} catch (error) {
		console.error('Erreur lors de la récupération des runs:', error);
		return json({ error: 'Erreur interne du serveur' }, { status: 500 });
	}
};

// POST /api/runs - Créer un nouveau run
export const POST: RequestHandler = async ({ request, locals }) => {
	try {
		const userId = locals.user?.id;
		if (!userId) {
			return json({ error: 'Non authentifié' }, { status: 401 });
		}

		const data = await request.json();

		const newRun = await prisma.run.create({
			data: {
				title: data.title,
				description: data.description,
				location: data.location,
				date: data.date,
				time: data.time,
				distance: data.distance,
				pace: data.pace,
				maxParticipants: data.maxParticipants,
				difficulty: data.difficulty,
				organizerId: userId
			},
			include: {
				organizer: {
					select: {
						id: true,
						name: true,
						email: true,
						image: true
					}
				},
				participants: {
					include: {
						user: {
							select: {
								id: true,
								name: true,
								email: true,
								image: true
							}
						}
					}
				}
			}
		});

		return json({
			...newRun,
			currentParticipants: 0,
			isUserParticipant: false,
			isUserOrganizer: true
		});
	} catch (error) {
		console.error('Erreur lors de la création du run:', error);
		return json({ error: 'Erreur lors de la création du run' }, { status: 500 });
	}
};
