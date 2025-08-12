<!-- src/lib/components/ui/date-picker/date-picker.svelte -->
<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { cn } from '$lib/utils.js';
	import { DateFormatter, type DateValue, getLocalTimeZone } from '@internationalized/date';
	import CalendarIcon from '@lucide/svelte/icons/calendar';

	interface Props {
		value?: DateValue | undefined;
		placeholder?: string;
		class?: string;
	}

	let { value = $bindable(), placeholder = 'Choisir une date', class: className }: Props = $props();

	const df = new DateFormatter('fr-FR', {
		dateStyle: 'medium'
	});

	let contentRef = $state<HTMLElement | null>(null);
</script>

<Popover.Root>
	<Popover.Trigger
		class={cn(
			buttonVariants({
				variant: 'outline',
				class: 'w-full justify-start text-left font-normal'
			}),
			!value && '',
			className
		)}
	>
		<CalendarIcon class="mr-2 h-4 w-4" />
		{value ? df.format(value.toDate(getLocalTimeZone())) : placeholder}
	</Popover.Trigger>
	<Popover.Content bind:ref={contentRef} class="w-auto p-0">
		<Calendar type="single" bind:value />
	</Popover.Content>
</Popover.Root>
