<script lang="ts">
	import Section from '$lib/components/section.svelte';
</script>

<div class="flex flex-1 flex-col gap-4 px-4 pt-0">
	<div class="grid gap-4 md:grid-cols-3">
		<Section title="Kilomètres partagés" subtitle="Nombre de kilomètres partagés" value="152km" />
		<Section title="Runs partagés" subtitle="Nombre de runs partagés" value="22" />
		<Section title="Runs organisés" subtitle="Nombre de runs organisés" value="3" />
	</div>
	<div class="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min"></div>
</div>
