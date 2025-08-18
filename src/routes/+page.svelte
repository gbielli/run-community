<script lang="ts">
	import RunningSearch from '$lib/components/RunningSearch.svelte';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Card } from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Calendar, Clock, MapPin, Plus, Users } from '@lucide/svelte';

	interface Run {
		id: string;
		title: string;
		description: string;
		location: string;
		date: string;
		time: string;
		distance: string;
		pace: string;
		maxParticipants: number;
		currentParticipants: number;
		organizer: string;
		isJoined?: boolean;
	}

	interface SearchFilters {
		distance: string;
		location: string;
		date: string;
	}

	// États principaux
	let showCreateForm = $state(false);
	let searchFilters = $state<SearchFilters>({
		distance: '',
		location: '',
		date: ''
	});

	let newRun = $state({
		title: '',
		description: '',
		location: '',
		date: '',
		time: '',
		distance: '',
		pace: '',
		maxParticipants: 10
	});

	// Données d'exemple
	let runs: Run[] = $state([
		{
			id: '1',
			title: 'Run matinal du dimanche',
			description: 'Course tranquille autour du lac, parfait pour commencer la journée en douceur.',
			location: 'Lac de Vincennes',
			date: '2025-08-15',
			time: '08:00',
			distance: '8',
			pace: '5:30',
			maxParticipants: 15,
			currentParticipants: 8,
			organizer: 'Marie Dubois',
			difficulty: 'Modéré'
		},
		{
			id: '2',
			title: 'Séance fractionné en groupe',
			description: 'Entraînement fractionné intensif sur piste.',
			location: 'Paris 13e',
			date: '2025-08-15',
			time: '19:00',
			distance: '5',
			pace: '4:00',
			maxParticipants: 12,
			currentParticipants: 5,
			organizer: 'Thomas Martin',
			difficulty: 'Difficile'
		},
		{
			id: '3',
			title: 'Course découverte débutants',
			description: 'Parfait pour ceux qui commencent la course à pied.',
			location: 'Parc de Belleville',
			date: '2025-08-16',
			time: '18:30',
			distance: '3',
			pace: '6:30',
			maxParticipants: 20,
			currentParticipants: 12,
			organizer: 'Sophie Laurent',
			difficulty: 'Facile'
		}
	]);

	// Computed: Runs filtrés avec logique améliorée
	let filteredRuns = $derived.by(() => {
		return runs.filter((run) => {
			// Filtre par distance - plus flexible
			const matchDistance =
				!searchFilters.distance ||
				run.distance.includes(searchFilters.distance) ||
				(searchFilters.distance === '5-' && parseInt(run.distance) <= 5) ||
				(searchFilters.distance === '5+' && parseInt(run.distance) >= 5) ||
				(searchFilters.distance === '10+' && parseInt(run.distance) >= 10);

			// Filtre par lieu - recherche insensible à la casse et partielle
			const matchLocation =
				!searchFilters.location ||
				run.location.toLowerCase().includes(searchFilters.location.toLowerCase()) ||
				run.title.toLowerCase().includes(searchFilters.location.toLowerCase());

			// Filtre par date
			const matchDate = !searchFilters.date || run.date === searchFilters.date;

			// Filtre par difficulté

			return matchDistance && matchLocation && matchDate;
		});
	});

	// Computed: Indicateur si des filtres sont actifs
	let hasActiveFilters = $derived(
		Boolean(searchFilters.distance || searchFilters.location || searchFilters.date)
	);

	let runningSearchRef: RunningSearch;
	// Fonction appelée par le composant de recherche
	function handleSearch(filters: SearchFilters) {
		console.log('Filtres reçus:', filters);
		searchFilters = { ...filters };
	}

	function resetSearch() {
		searchFilters = { distance: '', location: '', date: '' };
		if (runningSearchRef) {
			runningSearchRef.resetForm();
		}
	}

	function handleCreateRun() {
		if (newRun.title && newRun.location && newRun.date && newRun.time) {
			const run: Run = {
				id: Date.now().toString(),
				...newRun,
				currentParticipants: 1,
				organizer: 'Vous'
			};
			runs = [run, ...runs];

			// Reset form
			newRun = {
				title: '',
				description: '',
				location: '',
				date: '',
				time: '',
				distance: '',
				pace: '',
				maxParticipants: 10
			};
			showCreateForm = false;
		}
	}

	function formatDate(dateString: string) {
		// Parse manuel pour éviter les problèmes de timezone
		const [year, month, day] = dateString.split('-').map(Number);
		const date = new Date(year, month - 1, day); // month - 1 car les mois JS commencent à 0

		return date.toLocaleDateString('fr-FR', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	function joinRun(runId: string) {
		runs = runs.map((run) => {
			if (run.id === runId && run.currentParticipants < run.maxParticipants) {
				return { ...run, currentParticipants: run.currentParticipants + 1, isJoined: true };
			}
			return run;
		});
	}

	let activeRuns = $derived(runs.filter((run) => run.isJoined));

	// Filtres rapides prédéfinis
	const quickFilters = [
		{ label: "Aujourd'hui", type: 'date', value: new Date().toISOString().split('T')[0] },
		{ label: 'Cette semaine', type: 'week', value: 'current' },
		{ label: 'Courses courtes (≤5km)', type: 'distance', value: '5-' },
		{ label: 'Courses longues (≥10km)', type: 'distance', value: '10+' },
		{ label: 'Débutants', type: 'difficulty', value: 'Facile' }
	];

	function applyQuickFilter(filter: (typeof quickFilters)[0]) {
		resetSearch();
		if (filter.type === 'date') {
			searchFilters.date = filter.value;
		} else if (filter.type === 'distance') {
			searchFilters.distance = filter.value;
		}
	}
</script>

<svelte:head>
	<title>Running Community</title>
</svelte:head>

<div class="min-h-screen bg-background">
	<!-- Composant de recherche -->
	<RunningSearch bind:this={runningSearchRef} onSearch={handleSearch} onReset={resetSearch} />

	<div class="container mx-auto max-w-6xl px-4 py-8">
		<!-- Header avec filtres rapides -->
		<div class="mb-8 space-y-4">
			<div class="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
				<div>
					<h1 class="text-3xl font-bold text-foreground">
						{hasActiveFilters ? 'Résultats de recherche' : 'Tous les runs disponibles'}
					</h1>
					<p class="mt-1 text-muted-foreground">
						{filteredRuns.length} run{filteredRuns.length !== 1 ? 's' : ''}
						{hasActiveFilters ? 'trouvé' : 'disponible'}{filteredRuns.length !== 1 ? 's' : ''}
					</p>
				</div>
				<div class="flex gap-2">
					{#if hasActiveFilters}
						<Button variant="outline" onclick={resetSearch}>Effacer filtres</Button>
					{/if}
					<Button onclick={() => (showCreateForm = !showCreateForm)} class="gap-2">
						<Plus class="h-4 w-4" />
						Proposer un run
					</Button>
				</div>
			</div>

			<!-- Filtres rapides -->
			{#if !hasActiveFilters}
				<div class="flex flex-wrap gap-2">
					<span class="text-sm font-medium text-muted-foreground">Filtres rapides :</span>
					{#each quickFilters as filter}
						<Button
							variant="outline"
							size="sm"
							onclick={() => applyQuickFilter(filter)}
							class="h-8"
						>
							{filter.label}
						</Button>
					{/each}
				</div>
			{/if}

			{#if activeRuns}
				<div class="flex flex-wrap gap-2">
					<span class="text-sm font-medium text-muted-foreground">Runs actifs :</span>
					{#each activeRuns as run (run.id)}
						<Badge variant="secondary" class="gap-1">
							{run.title}
							<button
								onclick={() => (activeRuns = activeRuns.filter((r) => r.id !== run.id))}
								class="ml-1 hover:bg-muted">×</button
							>
						</Badge>
					{/each}
				</div>
			{/if}

			<!-- Indicateur des filtres actifs -->
			{#if hasActiveFilters}
				<div class="flex flex-wrap gap-2">
					<span class="text-sm font-medium text-muted-foreground">Filtres actifs :</span>
					{#if searchFilters.distance}
						<Badge variant="secondary" class="gap-1">
							Distance: {searchFilters.distance === '5-'
								? '≤5km'
								: searchFilters.distance === '5+'
									? '≥5km'
									: searchFilters.distance === '10+'
										? '≥10km'
										: searchFilters.distance + 'km'}
							<button onclick={() => (searchFilters.distance = '')} class="ml-1 hover:bg-muted"
								>×</button
							>
						</Badge>
					{/if}
					{#if searchFilters.location}
						<Badge variant="secondary" class="gap-1">
							Lieu: {searchFilters.location}
							<button onclick={() => (searchFilters.location = '')} class="ml-1 hover:bg-muted"
								>×</button
							>
						</Badge>
					{/if}
					{#if searchFilters.date}
						<Badge variant="secondary" class="gap-1">
							Date: {formatDate(searchFilters.date)}
							<button onclick={() => (searchFilters.date = '')} class="ml-1 hover:bg-muted"
								>×</button
							>
						</Badge>
					{/if}
				</div>
			{/if}
		</div>

		<!-- Create Form -->
		{#if showCreateForm}
			<Card class="mb-8 p-6">
				<h2 class="mb-4 text-xl font-semibold">Créer une nouvelle proposition</h2>
				<form
					onsubmit={(e) => {
						e.preventDefault();
						handleCreateRun();
					}}
					class="space-y-4"
				>
					<div class="space-y-2">
						<Label for="title">Titre *</Label>
						<Input id="title" bind:value={newRun.title} placeholder="Ex: Run matinal" required />
					</div>

					<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div class="space-y-2">
							<Label for="location">Lieu *</Label>
							<Input
								id="location"
								bind:value={newRun.location}
								placeholder="Ex: Parc de Vincennes"
								required
							/>
						</div>
					</div>

					<div class="grid grid-cols-1 gap-4 md:grid-cols-4">
						<div class="space-y-2">
							<Label for="date">Date *</Label>
							<Input id="date" type="date" bind:value={newRun.date} required />
						</div>
						<div class="space-y-2">
							<Label for="time">Heure *</Label>
							<Input id="time" type="time" bind:value={newRun.time} required />
						</div>
						<div class="space-y-2">
							<Label for="distance">Distance (km)</Label>
							<Input id="distance" bind:value={newRun.distance} placeholder="Ex: 10" />
						</div>
						<div class="space-y-2">
							<Label for="pace">Allure</Label>
							<Input id="pace" bind:value={newRun.pace} placeholder="Ex: 5:30" />
						</div>
					</div>

					<div class="space-y-2">
						<Label for="maxParticipants">Nombre de participants max</Label>
						<Input
							id="maxParticipants"
							type="number"
							bind:value={newRun.maxParticipants}
							min="1"
							max="50"
						/>
					</div>

					<div class="space-y-2">
						<Label for="description">Description</Label>
						<Textarea
							id="description"
							bind:value={newRun.description}
							placeholder="Décrivez votre run..."
							rows={3}
						/>
					</div>

					<div class="flex gap-2 pt-4">
						<Button type="submit">Créer le run</Button>
						<Button variant="outline" onclick={() => (showCreateForm = false)}>Annuler</Button>
					</div>
				</form>
			</Card>
		{/if}

		<!-- Runs List -->
		<div class="grid gap-6">
			{#each filteredRuns as run (run.id)}
				<Card class="p-6 transition-shadow hover:shadow-md">
					<div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
						<div class="flex-1 space-y-3">
							<div class="mb-2 flex flex-wrap items-center gap-2">
								<h3 class="text-xl font-semibold">{run.title}</h3>
								{#if run.distance}
									<Badge variant="secondary">{run.distance} km</Badge>
								{/if}
								{#if run.pace}
									<Badge variant="secondary">{run.pace}/km</Badge>
								{/if}
							</div>

							{#if run.description}
								<p class="text-muted-foreground">{run.description}</p>
							{/if}

							<div class="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
								<div class="flex items-center gap-2">
									<MapPin class="h-4 w-4 text-muted-foreground" />
									<span>{run.location}</span>
								</div>
								<div class="flex items-center gap-2">
									<Calendar class="h-4 w-4 text-muted-foreground" />
									<span>{formatDate(run.date)}</span>
								</div>
								<div class="flex items-center gap-2">
									<Clock class="h-4 w-4 text-muted-foreground" />
									<span>{run.time}</span>
								</div>
							</div>

							<div class="flex items-center justify-between pt-2">
								<div class="flex items-center gap-2 text-sm text-muted-foreground">
									<Users class="h-4 w-4" />
									<span>{run.currentParticipants}/{run.maxParticipants} participants</span>
									<div class="h-2 w-20 rounded-full bg-muted">
										<div
											class="h-2 rounded-full bg-primary transition-all"
											style="width: {Math.min(
												(run.currentParticipants / run.maxParticipants) * 100,
												100
											)}%"
										></div>
									</div>
								</div>
								<div class="text-sm text-muted-foreground">
									Organisé par <span class="font-medium">{run.organizer}</span>
								</div>
							</div>
						</div>

						<div class="flex flex-col gap-2 lg:ml-4">
							<Button
								onclick={() => joinRun(run.id)}
								disabled={run.currentParticipants >= run.maxParticipants}
								class="w-full lg:w-auto"
							>
								{run.currentParticipants >= run.maxParticipants ? 'Complet' : 'Rejoindre'}
							</Button>
						</div>
					</div>
				</Card>
			{/each}
		</div>

		<!-- États vides -->
		{#if filteredRuns.length === 0 && hasActiveFilters}
			<div class="py-12 text-center">
				<div class="mb-4 text-6xl">🔍</div>
				<h3 class="mb-2 text-lg font-semibold">Aucun run trouvé</h3>
				<p class="mb-4 text-muted-foreground">
					Aucune session ne correspond à vos critères de recherche.
				</p>
				<div class="flex justify-center gap-2">
					<Button variant="outline" onclick={resetSearch}>Effacer les filtres</Button>
					<Button onclick={() => (showCreateForm = true)} class="gap-2">
						<Plus class="h-4 w-4" />
						Créer un run
					</Button>
				</div>
			</div>
		{:else if runs.length === 0}
			<div class="py-12 text-center">
				<div class="mb-4 text-6xl">🏃‍♂️</div>
				<h3 class="mb-2 text-lg font-semibold">Aucun run proposé pour le moment</h3>
				<p class="mb-4 text-muted-foreground">Soyez le premier à proposer un run !</p>
				<Button onclick={() => (showCreateForm = true)} class="gap-2">
					<Plus class="h-4 w-4" />
					Proposer le premier run
				</Button>
			</div>
		{/if}
	</div>
</div>
