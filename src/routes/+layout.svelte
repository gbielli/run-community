<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import { Button } from '$lib/components/ui/button';
	import { Home, MapPin } from '@lucide/svelte';
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<!-- Navigation -->
<nav
	class="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
>
	<div class="container mx-auto px-4">
		<div class="flex h-16 items-center justify-between">
			<div class="flex items-center gap-6">
				<a href="/" class="text-xl font-bold text-foreground transition-colors hover:text-primary">
					🏃‍♂️ Running Community
				</a>

				<div class="hidden items-center gap-4 md:flex">
					<a
						href="/"
						class="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
					>
						<Home class="h-4 w-4" />
						Accueil
					</a>
					<a
						href="/runs"
						class="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
					>
						<MapPin class="h-4 w-4" />
						Runs
					</a>
				</div>
			</div>

			<div class="flex items-center gap-2">
				<Button variant="ghost" size="sm" href="/runs" class="hidden sm:inline-flex">
					Voir les runs
				</Button>
				<Button size="sm" href="/runs" class="gap-2">
					<span class="hidden sm:inline">Proposer un run</span>
					<span class="sm:hidden">+</span>
				</Button>
			</div>
		</div>
	</div>
</nav>

<!-- Mobile Navigation -->
<div class="border-b bg-background md:hidden">
	<div class="container mx-auto px-4">
		<div class="flex h-12 items-center justify-center gap-8">
			<a
				href="/"
				class="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
			>
				<Home class="h-4 w-4" />
				Accueil
			</a>
			<a
				href="/runs"
				class="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
			>
				<MapPin class="h-4 w-4" />
				Runs
			</a>
		</div>
	</div>
</div>

<main>
	{@render children?.()}
</main>
