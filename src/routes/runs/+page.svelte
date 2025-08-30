<!-- src/routes/runs/+page.svelte -->

<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Card } from '$lib/components/ui/card';
	import type { Run } from '@prisma/client';
	import { onMount } from 'svelte';

	let runs = $state<Run[]>([]);
	let loading = $state(false);
	let error = $state<string | null>(null);
	let filters = $state({
		location: '',
		distance: '',
		date: ''
	});

	// Computed avec runes
	let filteredRuns = $derived(
		runs.filter((run) => {
			if (
				filters.location &&
				!run.location.toLowerCase().includes(filters.location.toLowerCase())
			) {
				return false;
			}
			if (filters.distance && Math.abs(parseInt(run.distance) - parseInt(filters.distance)) > 2) {
				return false;
			}
			if (filters.date && run.date !== filters.date) {
				return false;
			}
			return true;
		})
	);

	// Actions simples
	async function fetchRuns() {
		loading = true;
		error = null;

		try {
			const response = await fetch('/api/runs');
			if (!response.ok) throw new Error('Erreur lors de la récupération');
			runs = await response.json();
		} catch (err) {
			error = err instanceof Error ? err.message : 'Une erreur est survenue';
		} finally {
			loading = false;
		}
	}

	async function joinRun(runId: string) {
		try {
			const response = await fetch(`/api/runs/${runId}/join`, { method: 'POST' });
			if (!response.ok) throw new Error("Erreur lors de l'inscription");

			// Mise à jour locale
			const runIndex = runs.findIndex((r) => r.id === runId);
			if (runIndex !== -1) {
				runs[runIndex] = {
					...runs[runIndex],
					currentParticipants: runs[runIndex].currentParticipants + 1
				};
			}
		} catch (err) {
			error = err instanceof Error ? err.message : "Erreur lors de l'inscription";
		}
	}

	onMount(() => {
		fetchRuns();
	});
</script>

<div class="container mx-auto px-4 py-8">
	{#if loading}
		<div class="text-center">Chargement...</div>
	{:else if error}
		<div class="text-red-600">{error}</div>
	{:else}
		<div class="grid gap-4">
			{#each filteredRuns as run (run.id)}
				<Card class="p-4">
					<h3>{run.title}</h3>
					<p>{run.description}</p>
					<Button onclick={() => joinRun(run.id)}>Rejoindre</Button>
				</Card>
			{/each}
		</div>
	{/if}
</div>
