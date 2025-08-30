<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import UserNav from '$lib/components/UserNav.svelte';
	import { Home, MapPin, MessageCircleMore, Search } from '@lucide/svelte';
	import '../app.css';

	let { children, data } = $props();
	let isAuthenticated = $derived(!!data.session);
	let userData = $derived(data.user);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{#if isAuthenticated}
	<nav
		class="sticky top-0 z-50 border-b bg-background/95 p-3 backdrop-blur supports-[backdrop-filter]:bg-background/60"
	>
		<div class="container mx-auto px-4">
			<div class="flex h-16 items-center justify-between">
				<div class="flex items-center gap-6">
					<a
						href="/"
						class="text-xl font-bold text-foreground transition-colors hover:text-primary"
					>
						🏃‍♂️ Runbuds
					</a>
				</div>
				<div class="hidden items-center gap-10 md:flex">
					<a
						href="/dashboard"
						class="grid grid-cols-1 justify-items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
					>
						<Home class="grid h-8 w-8 stroke-1" />
						Accueil
					</a>
					<a
						href="/runs"
						class="grid grid-cols-1 justify-items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
					>
						<MapPin class="grid h-8 w-8 stroke-1" />
						Activités
					</a>
					<a
						href="/"
						class="grid grid-cols-1 justify-items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
					>
						<Search class="grid h-8 w-8 stroke-1" />
						Explorer
					</a>
					<a
						href="/messages"
						class="grid grid-cols-1 justify-items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
					>
						<MessageCircleMore class="grid h-8 w-8 stroke-1" />
						Messages
					</a>
				</div>

				<div class="flex items-center gap-2">
					<UserNav {isAuthenticated} {userData} />
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
					Recherche
				</a>
			</div>
			<UserNav {isAuthenticated} {userData} />
		</div>
	</div>

	<main>
		{@render children?.()}
	</main>
{:else}
	<nav
		class="sticky top-0 z-50 border-b bg-background/95 p-3 backdrop-blur supports-[backdrop-filter]:bg-background/60"
	>
		<div class="container mx-auto px-4">
			<div class="flex h-16 items-center justify-between">
				<div class="flex items-center gap-6">
					<a
						href="/"
						class="text-xl font-bold text-foreground transition-colors hover:text-primary"
					>
						🏃‍♂️ Runbuds
					</a>
				</div>

				<div class="flex items-center gap-2">
					<UserNav {isAuthenticated} {userData} />
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
					Recherche
				</a>
			</div>
			<UserNav {isAuthenticated} {userData} />
		</div>
	</div>

	<main>
		{@render children?.()}
	</main>
{/if}
<!-- Navigation -->
