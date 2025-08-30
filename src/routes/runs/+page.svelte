<!-- src/routes/runs/+page.svelte -->
<script lang="ts">
	import { enhance } from '$app/forms';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Card } from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import {
		AlertCircle,
		Calendar,
		CheckCircle,
		Clock,
		MapPin,
		Plus,
		Trash2,
		Users
	} from '@lucide/svelte';
	import type { ActionData, PageData } from './$types';

	interface Props {
		data: PageData;
		form: ActionData;
	}

	let { data, form }: Props = $props();

	let filters = $state({
		location: '',
		distance: '',
		date: ''
	});

	let showCreateForm = $state(false);
	let isSubmitting = $state(false);

	// Données réactives dérivées (remplace les appels API)
	const runs = $derived(data.runs || []);
	const user = $derived(data.user);

	// Runs filtrés avec logique améliorée
	const filteredRuns = $derived(
		runs.filter((run) => {
			// Filtre par lieu - recherche partielle insensible à la casse
			const matchLocation =
				!filters.location ||
				run.location.toLowerCase().includes(filters.location.toLowerCase()) ||
				run.title.toLowerCase().includes(filters.location.toLowerCase());

			// Filtre par distance
			const runDistanceNum = parseInt(run.distance) || 0;
			const filterDistanceNum = parseInt(filters.distance) || 0;
			const matchDistance = !filters.distance || Math.abs(runDistanceNum - filterDistanceNum) <= 2;

			// Filtre par date
			const matchDate = !filters.date || run.date === filters.date;

			return matchLocation && matchDistance && matchDate;
		})
	);

	// Gestion des messages de succès/erreur
	const successMessage = $derived(form?.success ? form.message : null);
	const errorMessage = $derived(form?.error || null);

	// Indicateur de filtres actifs
	const hasActiveFilters = $derived(Boolean(filters.location || filters.distance || filters.date));

	// Fonction pour formater les dates
	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString('fr-FR', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	function isRunPast(date: string, time: string): boolean {
		const runDateTime = new Date(`${date}T${time}`);
		return runDateTime <= new Date();
	}

	function isRunFull(run: (typeof runs)[0]): boolean {
		return run.currentParticipants >= run.maxParticipants;
	}

	function isUserOrganizer(run: (typeof runs)[0]): boolean {
		if (!user) return false;
		const userIdentifier = user.name || user.email;
		return run.organizer === userIdentifier;
	}

	function clearFilters() {
		filters = {
			location: '',
			distance: '',
			date: ''
		};
	}

	// Effect pour fermer le formulaire après succès (remplace onMount)
	$effect(() => {
		if (form?.success) {
			showCreateForm = false;
		}
	});

	// Obtenir la date minimum (aujourd'hui)
	const minDate = $derived(() => {
		const today = new Date();
		return today.toISOString().split('T')[0];
	});
</script>

<svelte:head>
	<title>Propositions de Runs - Runbuds</title>
</svelte:head>

<div class="container mx-auto min-h-screen bg-background">
	<div class="container mx-auto max-w-6xl px-4 py-8">
		<!-- Header -->
		<div class="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
			<div>
				<h1 class="text-3xl font-bold text-foreground">Vos activités</h1>
				<p class="mt-1 text-muted-foreground">Retrouvez toutes vos activités à venir</p>
			</div>
			{#if user}
				<Button onclick={() => (showCreateForm = !showCreateForm)} class="gap-2">
					<Plus class="h-4 w-4" />
					Proposer un run
				</Button>
			{:else}
				<Button href="/auth/login" class="gap-2">
					<Plus class="h-4 w-4" />
					Connectez-vous pour proposer un run
				</Button>
			{/if}
		</div>

		<!-- Messages de feedback -->
		{#if successMessage}
			<div class="mb-6 flex items-center gap-2 rounded-lg bg-green-50 p-4 text-green-800">
				<CheckCircle class="h-5 w-5" />
				<span>{successMessage}</span>
			</div>
		{/if}

		{#if errorMessage}
			<div class="mb-6 flex items-center gap-2 rounded-lg bg-red-50 p-4 text-red-800">
				<AlertCircle class="h-5 w-5" />
				<span>{errorMessage}</span>
			</div>
		{/if}

		<!-- Formulaire de création avec form action -->
		{#if showCreateForm && user}
			<Card class="mb-8 p-6">
				<h2 class="mb-4 text-xl font-semibold">Créer une nouvelle proposition</h2>

				<form
					method="POST"
					action="?/createRun"
					use:enhance={() => {
						isSubmitting = true;
						return async ({ result, update }) => {
							await update();
							isSubmitting = false;
						};
					}}
					class="space-y-4"
				>
					<div class="space-y-2">
						<Label for="title">Titre *</Label>
						<Input
							id="title"
							name="title"
							value={form?.values?.title || ''}
							placeholder="Ex: Run matinal du dimanche"
							required
							class={form?.field === 'title' ? 'border-red-500' : ''}
						/>
					</div>

					<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div class="space-y-2">
							<Label for="location">Lieu *</Label>
							<Input
								id="location"
								name="location"
								value={form?.values?.location || ''}
								placeholder="Ex: Parc de Vincennes"
								required
								class={form?.field === 'location' ? 'border-red-500' : ''}
							/>
						</div>
					</div>

					<div class="grid grid-cols-1 gap-4 md:grid-cols-4">
						<div class="space-y-2">
							<Label for="date">Date *</Label>
							<Input
								id="date"
								name="date"
								type="date"
								value={form?.values?.date || ''}
								min={minDate()}
								required
								class={form?.field === 'date' ? 'border-red-500' : ''}
							/>
						</div>
						<div class="space-y-2">
							<Label for="time">Heure *</Label>
							<Input
								id="time"
								name="time"
								type="time"
								value={form?.values?.time || ''}
								required
								class={form?.field === 'time' ? 'border-red-500' : ''}
							/>
						</div>
						<div class="space-y-2">
							<Label for="distance">Distance (km)</Label>
							<Input
								id="distance"
								name="distance"
								value={form?.values?.distance || ''}
								placeholder="Ex: 10"
							/>
						</div>
						<div class="space-y-2">
							<Label for="pace">Allure</Label>
							<Input
								id="pace"
								name="pace"
								value={form?.values?.pace || ''}
								placeholder="Ex: 5:30/km"
							/>
						</div>
					</div>

					<div class="space-y-2">
						<Label for="maxParticipants">Nombre de participants max</Label>
						<Input
							id="maxParticipants"
							name="maxParticipants"
							type="number"
							value={form?.values?.maxParticipants || 10}
							min="1"
							max="50"
							class={form?.field === 'maxParticipants' ? 'border-red-500' : ''}
						/>
					</div>

					<div class="space-y-2">
						<Label for="description">Description</Label>
						<Textarea
							id="description"
							name="description"
							value={form?.values?.description || ''}
							placeholder="Décrivez votre run, le niveau requis, les points de rendez-vous..."
							rows={3}
						/>
					</div>

					<div class="flex gap-2 pt-4">
						<Button type="submit" disabled={isSubmitting}>
							{#if isSubmitting}
								Création...
							{:else}
								Créer le run
							{/if}
						</Button>
						<Button
							type="button"
							variant="outline"
							onclick={() => (showCreateForm = false)}
							disabled={isSubmitting}
						>
							Annuler
						</Button>
					</div>
				</form>
			</Card>
		{/if}

		<!-- Liste des runs -->
		<div class="grid gap-6">
			{#each filteredRuns as run (run.id)}
				{@const isPast = isRunPast(run.date, run.time)}
				{@const isFull = isRunFull(run)}
				{@const isOrganizer = isUserOrganizer(run)}

				<Card class="p-6 transition-shadow hover:shadow-md">
					<div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
						<div class="flex-1 space-y-3">
							<div class="mb-2 flex flex-wrap items-center gap-2">
								<h3 class="text-xl font-semibold">{run.title}</h3>
								{#if run.distance}
									<Badge variant="secondary">{run.distance} km</Badge>
								{/if}
								{#if run.pace}
									<Badge variant="secondary">{run.pace}</Badge>
								{/if}
								{#if isPast}
									<Badge variant="outline" class="text-gray-500">Terminé</Badge>
								{/if}
							</div>

							{#if run.description}
								<p class="text-muted-foreground">{run.description}</p>
							{/if}

							<div class="flex flex-wrap gap-4 text-sm text-muted-foreground">
								<div class="flex items-center gap-1">
									<Calendar class="h-4 w-4" />
									<span>{formatDate(run.date)}</span>
								</div>
								<div class="flex items-center gap-1">
									<Clock class="h-4 w-4" />
									<span>{run.time}</span>
								</div>
								<div class="flex items-center gap-1">
									<MapPin class="h-4 w-4" />
									<span>{run.location}</span>
								</div>
								<div class="flex items-center gap-1">
									<Users class="h-4 w-4" />
									<span>{run.currentParticipants}/{run.maxParticipants}</span>
								</div>
							</div>

							<p class="text-sm text-muted-foreground">
								Organisé par <span class="font-medium">{run.organizer}</span>
							</p>
						</div>

						<!-- Actions pour les utilisateurs connectés -->
						{#if user && !isPast}
							<div class="flex flex-col gap-2 lg:flex-shrink-0">
								{#if isOrganizer}
									<div class="flex gap-2">
										<Badge variant="outline" class="justify-center px-3 py-1">Votre run</Badge>
										<form method="POST" action="?/deleteRun" use:enhance>
											<input type="hidden" name="runId" value={run.id} />
											<Button
												type="submit"
												variant="destructive"
												size="sm"
												class="gap-1"
												onclick="return confirm('Êtes-vous sûr de vouloir supprimer ce run ?')"
											>
												<Trash2 class="h-3 w-3" />
												Supprimer
											</Button>
										</form>
									</div>
								{:else if isFull}
									<Button disabled class="w-full lg:w-auto">Complet</Button>
								{:else if run.isJoined}
									<form method="POST" action="?/joinRun" use:enhance>
										<input type="hidden" name="runId" value={run.id} />
										<Button type="submit" class="w-full lg:w-auto">Voir le run</Button>
									</form>
								{:else}
									<Button disabled class="w-full lg:w-auto">Rejoindre</Button>
								{/if}
							</div>
						{:else if !user && !isPast}
							<div class="lg:flex-shrink-0">
								<Button href="/auth/login" variant="outline" class="w-full lg:w-auto">
									Se connecter pour rejoindre
								</Button>
							</div>
						{/if}
					</div>
				</Card>
			{/each}
		</div>

		<!-- État vide -->
		{#if filteredRuns.length === 0 && runs.length > 0}
			<div class="py-12 text-center">
				<div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
					<Calendar class="h-6 w-6 text-muted-foreground" />
				</div>
				<h3 class="mb-2 text-lg font-medium">Aucun run trouvé</h3>
				<p class="mb-4 text-muted-foreground">Essayez de modifier vos critères de recherche</p>
				<Button onclick={clearFilters} variant="outline">Effacer les filtres</Button>
			</div>
		{:else if runs.length === 0}
			<div class="py-12 text-center">
				<div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
					<Calendar class="h-6 w-6 text-muted-foreground" />
				</div>
				<h3 class="mb-2 text-lg font-medium">Aucun run prévu</h3>
				<p class="mb-4 text-muted-foreground">Soyez le premier à proposer une sortie running !</p>
				{#if user}
					<Button onclick={() => (showCreateForm = true)} class="gap-2">
						<Plus class="h-4 w-4" />
						Créer le premier run
					</Button>
				{:else}
					<Button href="/auth/login" class="gap-2">
						<Plus class="h-4 w-4" />
						Se connecter pour créer un run
					</Button>
				{/if}
			</div>
		{/if}
	</div>
</div>
