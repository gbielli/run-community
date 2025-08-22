<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';

	interface SectionProps {
		title: string;
		subtitle: string;
		value: string;
	}

	let { title, subtitle, value }: SectionProps = $props();
</script>

<div
	class="grid grid-cols-1 gap-2 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card"
>
	<Card.Root class="@container/card">
		<Card.Header>
			<Card.Description>{title}</Card.Description>
			<Card.Title class="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
				{value}
			</Card.Title>
		</Card.Header>
		<Card.Footer class="flex-col items-start gap-1.5 text-sm">
			<div class="text-muted-foreground">{subtitle}</div>
		</Card.Footer>
	</Card.Root>
</div>
