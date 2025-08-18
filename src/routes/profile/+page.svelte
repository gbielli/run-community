<!-- src/routes/profile/+page.svelte -->
<script lang="ts">
	import Label from '$lib/components/ui/label/label.svelte';
	import type { User as UserType } from '$lib/types/user';
	import { getUserStatus, USER_STATUSES } from '$lib/types/user';
	import { Calendar, Mail, Trophy, User } from '@lucide/svelte';

	// Données utilisateur simulées - en production, cela viendrait d'une API
	let user: UserType = {
		id: '1',
		firstName: 'Marie',
		lastName: 'Dubois',
		email: 'marie.dubois@example.com',
		gender: 'female',
		runCount: 75,
		joinDate: new Date('2023-03-15'),
		avatar: undefined
	};

	let isEditingPassword = false;
	let currentPassword = '';
	let newPassword = '';
	let confirmPassword = '';
	let showCurrentPassword = false;
	let showNewPassword = false;
	let showConfirmPassword = false;
	let passwordError = '';
	let passwordSuccess = '';

	$: userStatus = getUserStatus(user.runCount);
	$: nextStatus = USER_STATUSES.find((status) => status.minRuns > user.runCount);
	$: progressToNext = nextStatus
		? ((user.runCount - userStatus.minRuns) / (nextStatus.minRuns - userStatus.minRuns)) * 100
		: 100;

	function getGenderLabel(gender: string): string {
		const labels = {
			male: 'Homme',
			female: 'Femme'
		};
		return labels[gender as keyof typeof labels] || gender;
	}

	function formatDate(date: Date): string {
		return new Intl.DateTimeFormat('fr-FR', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		}).format(date);
	}

	function handlePasswordChange() {
		passwordError = '';
		passwordSuccess = '';

		if (!currentPassword || !newPassword || !confirmPassword) {
			passwordError = 'Tous les champs sont requis';
			return;
		}

		if (newPassword !== confirmPassword) {
			passwordError = 'Les nouveaux mots de passe ne correspondent pas';
			return;
		}

		if (newPassword.length < 8) {
			passwordError = 'Le nouveau mot de passe doit contenir au moins 8 caractères';
			return;
		}

		// Simulation de la mise à jour du mot de passe
		setTimeout(() => {
			passwordSuccess = 'Mot de passe modifié avec succès !';
			currentPassword = '';
			newPassword = '';
			confirmPassword = '';
			isEditingPassword = false;
		}, 1000);
	}

	function cancelPasswordEdit() {
		isEditingPassword = false;
		currentPassword = '';
		newPassword = '';
		confirmPassword = '';
		passwordError = '';
		passwordSuccess = '';
	}
</script>

<svelte:head>
	<title>Mon Profil - Running Community</title>
</svelte:head>

<div class="container mx-auto max-w-4xl p-6">
	<h1 class="mb-8 text-3xl font-bold text-foreground">Mon Profil</h1>

	<div class="grid gap-6 md:grid-cols-1">
		<!-- Carte principale du profil -->
		<div class="rounded-lg border border-border bg-card p-6 md:col-span-2">
			<div class="flex items-start gap-6">
				<!-- Avatar -->
				<div class="relative">
					<div class="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
						{#if user.avatar}
							<img src={user.avatar} alt="Avatar" class="h-full w-full rounded-full object-cover" />
						{:else}
							<User class="h-12 w-12 text-primary" />
						{/if}
					</div>
				</div>

				<!-- Informations principales -->
				<div class="flex-1">
					<h2 class="mb-2 text-2xl font-semibold text-foreground">
						{user.firstName}
						{user.lastName}
					</h2>

					<!-- Statut -->
					<div class="mb-4 flex items-center gap-3">
						<div class="flex items-center gap-2">
							<div class="h-3 w-3 rounded-full {userStatus.color}"></div>
							<span class="font-medium text-foreground">{userStatus.title}</span>
						</div>
					</div>
					<!-- Statistiques -->
					<div class="flex items-center gap-6 text-sm">
						<div class="flex items-center gap-2">
							<Trophy class="h-4 w-4 text-primary" />
							<span class="font-medium text-foreground">{user.runCount}</span>
							<span class="text-muted-foreground">runs réalisés</span>
						</div>
						<div class="flex items-center gap-2">
							<Calendar class="h-4 w-4 text-primary" />
							<span class="text-muted-foreground">Membre depuis {formatDate(user.joinDate)}</span>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Informations personnelles -->
		<div class="rounded-lg border border-border bg-card p-6">
			<h3 class="mb-4 text-lg font-semibold text-foreground">Informations personnelles</h3>

			<div class="space-y-4">
				<div>
					<Label for="gender" class="text-sm font-medium text-muted-foreground">Genre</Label>
					<p class="text-foreground">{getGenderLabel(user.gender)}</p>
				</div>

				<div>
					<Label for="firstName" class="text-sm font-medium text-muted-foreground">Prénom</Label>
					<p class="text-foreground">{user.firstName}</p>
				</div>

				<div>
					<Label class="text-sm font-medium text-muted-foreground">Nom</Label>
					<p class="text-foreground">{user.lastName}</p>
				</div>

				<div>
					<Label class="text-sm font-medium text-muted-foreground">Email</Label>
					<div class="flex items-center gap-2">
						<Mail class="h-4 w-4 text-primary" />
						<p class="text-foreground">{user.email}</p>
					</div>
				</div>
				<div>
					<Label class="text-sm font-medium text-muted-foreground">Mot de passe actuel</Label>
					<p class="text-foreground">••••••••</p>
				</div>
			</div>
		</div>
	</div>
</div>
