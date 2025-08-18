// src/lib/types/user.ts
export interface User {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	gender: 'male' | 'female' | 'other' | 'prefer-not-to-say';
	runCount: number;
	joinDate: Date;
	avatar?: string;
}

export interface UserStatus {
	level: 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'elite';
	title: string;
	description: string;
	color: string;
	minRuns: number;
}

export const USER_STATUSES: UserStatus[] = [
	{
		level: 'beginner',
		title: 'Débutant',
		description: 'Commence ton aventure running',
		color: 'bg-gray-500',
		minRuns: 0
	},
	{
		level: 'intermediate',
		title: 'Coureur Régulier',
		description: 'Tu prends le rythme !',
		color: 'bg-blue-500',
		minRuns: 10
	},
	{
		level: 'advanced',
		title: 'Coureur Confirmé',
		description: 'Tu maîtrises ton art',
		color: 'bg-green-500',
		minRuns: 50
	},
	{
		level: 'expert',
		title: 'Expert Runner',
		description: 'Impressionnant !',
		color: 'bg-purple-500',
		minRuns: 100
	},
	{
		level: 'elite',
		title: 'Elite Runner',
		description: 'Tu es une légende !',
		color: 'bg-yellow-500',
		minRuns: 200
	}
];

export function getUserStatus(runCount: number): UserStatus {
	const statuses = [...USER_STATUSES].reverse();
	return statuses.find((status) => runCount >= status.minRuns) || USER_STATUSES[0];
}
