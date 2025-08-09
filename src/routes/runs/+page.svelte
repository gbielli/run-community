<script lang="ts">
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
		difficulty: 'Facile' | 'Modéré' | 'Difficile';
	}

	let showCreateForm = $state(false);
	let newRun = $state({
		title: '',
		description: '',
		location: '',
		date: '',
		time: '',
		distance: '',
		pace: '',
		maxParticipants: 10,
		difficulty: 'Modéré' as const
	});

	// Données d'exemple
	let runs: Run[] = $state([
		{
			id: '1',
			title: 'Run matinal du dimanche',
			description:
				'Course tranquille autour du lac, parfait pour commencer la journée en douceur. Tous niveaux bienvenus !',
			location: 'Lac de Vincennes',
			date: '2025-01-15',
			time: '08:00',
			distance: '8 km',
			pace: '5:30/km',
			maxParticipants: 15,
			currentParticipants: 8,
			organizer: 'Marie Dubois',
			difficulty: 'Modéré'
		},
		{
			id: '2',
			title: 'Séance fractionné en groupe',
			description:
				'Entraînement fractionné intensif sur piste. Prévoir des chaussures de running adaptées.',
			location: 'Stade Charléty',
			date: '2025-01-16',
			time: '19:00',
			distance: '5 km',
			pace: '4:00/km',
			maxParticipants: 12,
			currentParticipants: 5,
			organizer: 'Thomas Martin',
			difficulty: 'Difficile'
		},
		{
			id: '3',
			title: 'Course découverte débutants',
			description:
				'Parfait pour ceux qui commencent la course à pied. Rythme détendu et conseils inclus.',
			location: 'Parc de Belleville',
			date: '2025-01-17',
			time: '18:30',
			distance: '3 km',
			pace: '6:30/km',
			maxParticipants: 20,
			currentParticipants: 12,
			organizer: 'Sophie Laurent',
			difficulty: 'Facile'
		}
	]);

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
				maxParticipants: 10,
				difficulty: 'Modéré'
			};
			showCreateForm = false;
		}
	}

	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString('fr-FR', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	function joinRun(runId: string) {
		runs = runs.map((run) => {
			if (run.id === runId && run.currentParticipants < run.maxParticipants) {
				return { ...run, currentParticipants: run.currentParticipants + 1 };
			}
			return run;
		});
	}
</script>

<svelte:head>
	<title>Propositions de Runs - Running Community</title>
</svelte:head>

<div class="min-h-screen bg-background">
	<div class="container mx-auto max-w-6xl px-4 py-8">
		<!-- Header -->
		<div class="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
			<div>
				<h1 class="text-3xl font-bold text-foreground">Propositions de Runs</h1>
				<p class="mt-1 text-muted-foreground">
					Trouvez votre prochaine course ou proposez la vôtre
				</p>
			</div>
			<Button onclick={() => (showCreateForm = !showCreateForm)} class="gap-2">
				<Plus class="h-4 w-4" />
				Proposer un run
			</Button>
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
					<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div class="space-y-2">
							<Label for="title">Titre du run *</Label>
							<Input
								id="title"
								bind:value={newRun.title}
								placeholder="ex: Run matinal au parc"
								required
							/>
						</div>
						<div class="space-y-2">
							<Label for="location">Lieu *</Label>
							<Input
								id="location"
								bind:value={newRun.location}
								placeholder="ex: Parc de Vincennes"
								required
							/>
						</div>
					</div>

					<div class="space-y-2">
						<Label for="description">Description</Label>
						<Textarea
							id="description"
							bind:value={newRun.description}
							placeholder="Décrivez votre run, le niveau requis, les points de rendez-vous..."
							rows={3}
						/>
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
							<Label for="distance">Distance</Label>
							<Input id="distance" bind:value={newRun.distance} placeholder="ex: 10 km" />
						</div>
						<div class="space-y-2">
							<Label for="pace">Allure prévue</Label>
							<Input id="pace" bind:value={newRun.pace} placeholder="ex: 5:30/km" />
						</div>
					</div>

					<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div class="space-y-2">
							<Label for="maxParticipants">Participants max</Label>
							<Input
								id="maxParticipants"
								type="number"
								bind:value={newRun.maxParticipants}
								min="2"
								max="50"
							/>
						</div>
						<div class="space-y-2">
							<Label for="difficulty">Difficulté</Label>
							<select
								id="difficulty"
								bind:value={newRun.difficulty}
								class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
							>
								<option value="Facile">Facile</option>
								<option value="Modéré">Modéré</option>
								<option value="Difficile">Difficile</option>
							</select>
						</div>
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
			{#each runs as run (run.id)}
				<Card class="p-6 transition-shadow hover:shadow-md">
					<div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
						<div class="flex-1 space-y-3">
							<div class="flex flex-wrap items-center gap-2">
								<h3 class="text-xl font-semibold">{run.title}</h3>
								<Badge>{run.distance}</Badge>
							</div>

							{#if run.description}
								<p class="text-muted-foreground">{run.description}</p>
							{/if}

							<div class="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
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
								<div class="flex items-center gap-2">
									<Users class="h-4 w-4 text-muted-foreground" />
									<span>{run.currentParticipants}/{run.maxParticipants} participants</span>
								</div>
							</div>

							{#if run.distance || run.pace}
								<div class="flex flex-wrap gap-4 text-sm">
									{#if run.distance}
										<span class="font-medium">Distance: {run.distance}</span>
									{/if}
									{#if run.pace}
										<span class="font-medium">Allure: {run.pace}</span>
									{/if}
								</div>
							{/if}

							<div class="text-sm text-muted-foreground">
								Organisé par <span class="font-medium">{run.organizer}</span>
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
							<div class="text-center text-xs text-muted-foreground lg:text-right">
								{run.maxParticipants - run.currentParticipants} places restantes
							</div>
						</div>
					</div>
				</Card>
			{/each}
		</div>

		{#if runs.length === 0}
			<div class="py-12 text-center">
				<div class="mb-4 text-6xl">🏃‍♂️</div>
				<h3 class="mb-2 text-lg font-semibold">Aucun run proposé pour le moment</h3>
				<p class="mb-4 text-muted-foreground">
					Soyez le premier à proposer un run à la communauté !
				</p>
				<Button onclick={() => (showCreateForm = true)} class="gap-2">
					<Plus class="h-4 w-4" />
					Proposer le premier run
				</Button>
			</div>
		{/if}
	</div>
</div>
