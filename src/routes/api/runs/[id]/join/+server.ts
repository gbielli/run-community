import { json } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';
import type { RequestHandler } from '@sveltejs/kit';

const prisma = new PrismaClient();

export const POST: RequestHandler = async ({ params, locals }) => {
	try {
		const userId = locals.user?.id;
		if (!userId) {
			return json({ error: 'Non authentifié' }, { status: 401 });
		}

		const runId = params.id;

		// Vérifier que le run existe et qu'il y a de la place
		const run = await prisma.run.findUnique({
			where: { id: runId },
			include: {
				participants: true
			}
		});

		if (!run) {
			return json({ error: 'Run non trouvé' }, { status: 404 });
		}

		if (run.participants.length >= run.maxParticipants) {
			return json({ error: 'Run complet' }, { status: 400 });
		}

		// Vérifier que l'utilisateur n'est pas déjà inscrit
		const existingParticipation = await prisma.runParticipant.findUnique({
			where: {
				userId_runId: {
					userId,
					runId
				}
			}
		});

		if (existingParticipation) {
			return json({ error: 'Déjà inscrit à ce run' }, { status: 400 });
		}

		// Créer la participation
		await prisma.runParticipant.create({
			data: {
				userId,
				runId
			}
		});

		return json({ success: true });
	} catch (error) {
		console.error("Erreur lors de l'inscription au run:", error);
		return json({ error: "Erreur lors de l'inscription" }, { status: 500 });
	}
};
