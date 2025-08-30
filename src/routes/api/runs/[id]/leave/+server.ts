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

		// Supprimer la participation
		await prisma.runParticipant.deleteMany({
			where: {
				userId,
				runId
			}
		});

		return json({ success: true });
	} catch (error) {
		console.error('Erreur lors de la désinscription du run:', error);
		return json({ error: 'Erreur lors de la désinscription' }, { status: 500 });
	}
};
