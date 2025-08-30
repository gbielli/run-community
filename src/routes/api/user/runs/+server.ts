import { PrismaClient } from '@prisma/client';
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

const prisma = new PrismaClient();

export const GET: RequestHandler = async ({ locals }) => {
	try {
		const userId = locals.user?.id;
		if (!userId) {
			return json({ error: 'Non authentifié' }, { status: 401 });
		}

		// Runs organisés par l'utilisateur
		const organizedRuns = await prisma.run.findMany({
			where: {
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
			},
			orderBy: {
				date: 'asc'
			}
		});

		// Runs auxquels l'utilisateur participe
		const participantRuns = await prisma.run.findMany({
			where: {
				participants: {
					some: {
						userId
					}
				}
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
			},
			orderBy: {
				date: 'asc'
			}
		});

		return json({
			organizedRuns: organizedRuns.map((run) => ({
				...run,
				currentParticipants: run.participants.length,
				isUserParticipant: run.participants.some((p) => p.userId === userId),
				isUserOrganizer: true
			})),
			participantRuns: participantRuns.map((run) => ({
				...run,
				currentParticipants: run.participants.length,
				isUserParticipant: true,
				isUserOrganizer: run.organizerId === userId
			}))
		});
	} catch (error) {
		console.error('Erreur lors de la récupération des runs utilisateur:', error);
		return json({ error: 'Erreur interne du serveur' }, { status: 500 });
	}
};
