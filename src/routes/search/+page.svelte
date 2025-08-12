<script lang="ts">
	import { Input } from '$lib/components/ui/input';

	interface Run {
		id: number;
		distance: string;
		allure: string;
		date: string;
	}

	const paceRanges = [
		{ label: 'Toutes les allures', min: '0:00', max: '10:00', value: '' },
		{ label: '4:00 - 4:15', min: '4:00', max: '4:15', value: '4:00-4:15' },
		{ label: '4:15 - 4:30', min: '4:15', max: '4:30', value: '4:15-4:30' },
		{ label: '4:30 - 4:45', min: '4:30', max: '4:45', value: '4:30-4:45' },
		{ label: '4:45 - 5:00', min: '4:45', max: '5:00', value: '4:45-5:00' },
		{ label: '5:00 - 5:15', min: '5:00', max: '5:15', value: '5:00-5:15' },
		{ label: '5:15 - 5:30', min: '5:15', max: '5:30', value: '5:15-5:30' },
		{ label: '5:30 - 5:45', min: '5:30', max: '5:45', value: '5:30-5:45' },
		{ label: '5:45 - 6:00', min: '5:45', max: '6:00', value: '5:45-6:00' }
	];

	let distanceFilter = $state('');
	let dateFilter = $state('');
	let allureRangeFilter = $state('');

	let runs = [
		{ id: 1, distance: '10', allure: '5:45', date: '2025-01-25' },
		{ id: 2, distance: '5', allure: '4:30', date: '2025-01-12' },
		{ id: 3, distance: '15', allure: '5:15', date: '2025-01-15' },
		{ id: 4, distance: '10', allure: '4:45', date: '2025-01-20' },
		{ id: 5, distance: '8', allure: '6:00', date: '2025-01-18' },
		{ id: 6, distance: '12', allure: '5:30', date: '2025-01-22' }
	];

	function paceToSeconds(pace: string): number {
		const [minutes, seconds] = pace.split(':').map(Number);
		return minutes * 60 + seconds;
	}

	function isPaceInRange(pace: string, minPace: string, maxPace: string): boolean {
		const paceSeconds = paceToSeconds(pace);
		const minSeconds = paceToSeconds(minPace);
		const maxSeconds = paceToSeconds(maxPace);
		return paceSeconds >= minSeconds && paceSeconds <= maxSeconds;
	}

	// Calcul réactif automatique - pas besoin d'effect !
	let runsFiltered = $derived(
		runs.filter((run) => {
			const matchesDistance = distanceFilter === '' || run.distance.includes(distanceFilter);

			const matchesDate = dateFilter === '' || run.date.includes(dateFilter);

			let matchesAllure = true;
			if (allureRangeFilter !== '') {
				const selectedRange = paceRanges.find((range) => range.value === allureRangeFilter);
				if (selectedRange) {
					matchesAllure = isPaceInRange(run.allure, selectedRange.min, selectedRange.max);
				}
			}

			return matchesDistance && matchesDate && matchesAllure;
		})
	);
</script>

<div class="p-4">
	<h2 class="mb-4 text-xl font-bold">Filtrer les runs</h2>

	<div class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
		<div>
			<label class="mb-1 block text-sm font-medium">Distance (km)</label>
			<Input placeholder="Ex: 10" bind:value={distanceFilter} />
		</div>

		<div>
			<label class="mb-1 block text-sm font-medium">Date</label>
			<Input placeholder="Ex: 2025-01" bind:value={dateFilter} />
		</div>

		<div>
			<label class="mb-1 block text-sm font-medium">Allure</label>
			<select
				bind:value={allureRangeFilter}
				class="w-full rounded-md border border-gray-300 px-3 py-2"
			>
				{#each paceRanges as range}
					<option value={range.value}>{range.label}</option>
				{/each}
			</select>
		</div>
	</div>

	<p class="mb-4 text-sm text-gray-600">
		{runsFiltered.length} run{runsFiltered.length !== 1 ? 's' : ''} trouvé{runsFiltered.length !== 1
			? 's'
			: ''}
	</p>

	{#each runsFiltered as run}
		<div class="mb-2 rounded border p-3">
			<p>#{run.id} - {run.distance}km - {run.allure} - {run.date}</p>
		</div>
	{/each}
</div>
