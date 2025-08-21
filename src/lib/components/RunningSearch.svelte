<!-- src/lib/components/RunningSearch.svelte - Version alternative -->
<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import DatePicker from '$lib/components/ui/date-picker/date-picker.svelte';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { type DateValue } from '@internationalized/date';

	let { onSearch } = $props();

	let distance = $state('');
	let location = $state('');
	let selectedDate = $state<DateValue | undefined>(undefined);

	function dateValueToString(dateValue: DateValue | undefined) {
		if (!dateValue) return '';
		const year = dateValue.year;
		const month = String(dateValue.month).padStart(2, '0');
		const day = String(dateValue.day).padStart(2, '0');
		return `${year}-${month}-${day}`;
	}

	function handleSearch() {
		const dateString = dateValueToString(selectedDate);
		const filters = {
			distance,
			location,
			date: dateString
		};

		if (onSearch) {
			onSearch(filters);
		}
	}

	export function resetForm() {
		distance = '';
		location = '';
		selectedDate = undefined;
	}
</script>

<div class="p-8">
	<h1 class="mb-6 text-center text-3xl font-bold">Trouvez votre buddy running</h1>

	<div class="mx-auto max-w-4xl rounded-lg bg-white p-6 text-foreground shadow-xl">
		<div class="grid grid-cols-1 items-end gap-4 md:grid-cols-4">
			<div class="space-y-2">
				<Label for="distance" class="text-sm font-medium">Distance (km)</Label>
				<Input
					id="distance"
					bind:value={distance}
					placeholder="Ex: 10"
					type="number"
					min="0"
					step="0.5"
					class="w-full"
				/>
			</div>

			<div class="space-y-2">
				<Label for="location" class="text-sm font-medium">Lieu</Label>
				<Input id="location" bind:value={location} placeholder="Ex: Paris" class="w-full" />
			</div>

			<div class="space-y-2">
				<Label class="text-sm font-medium">Date</Label>
				<DatePicker bind:value={selectedDate} placeholder="Choisir une date" class="w-full" />
			</div>

			<div class="flex gap-2">
				<Button onclick={handleSearch} class="flex-1">Rechercher</Button>
			</div>
		</div>
	</div>
</div>
