<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { ChevronDown, LogOut, Settings, User } from '@lucide/svelte';

	let { data } = $props();

	const isAuthenticated = $derived(!!data.session);
	const userInitials = $derived(data?.user?.name);
</script>

{#if isAuthenticated}
	<!-- Avatar + Dropdown -->
	<DropdownMenu.Root>
		<DropdownMenu.Trigger>
			<Button variant="ghost" size="sm" class="flex h-9 items-center gap-2 px-2">
				<!-- Avatar circle -->
				<div
					class="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground"
				>
					<Avatar.Root>
						<Avatar.Image src="https://github.com/shadcn.png" alt="@shadcnnnn" />
						<Avatar.Fallback>GB</Avatar.Fallback>
					</Avatar.Root>
				</div>

				<!-- Nom (caché sur mobile) -->
				<span class="hidden text-sm font-medium sm:inline">
					{userInitials}
				</span>

				<!-- Chevron -->
				<ChevronDown class="h-3 w-3 opacity-50" />
			</Button>
		</DropdownMenu.Trigger>

		<DropdownMenu.Content class="w-56" align="end">
			<!-- En-tête utilisateur -->
			<DropdownMenu.Label>
				<div class="flex flex-col space-y-1">
					<p class="text-sm font-medium">
						{data.user.name || 'Utilisateur'}
					</p>
					<p class="text-xs text-muted-foreground">
						{data.user.email}
					</p>
				</div>
			</DropdownMenu.Label>

			<DropdownMenu.Separator />

			<!-- Menu items -->
			<DropdownMenu.Item>
				<a href="/profile" class="flex items-center gap-2">
					<User class="h-4 w-4" />
					Mon profil
				</a>
			</DropdownMenu.Item>

			<DropdownMenu.Item>
				<a href="/settings" class="flex items-center gap-2">
					<Settings class="h-4 w-4" />
					Paramètres
				</a>
			</DropdownMenu.Item>

			<DropdownMenu.Separator />

			<DropdownMenu.Item class="flex items-center gap-2 text-red-600 focus:text-red-600">
				<LogOut class="h-4 w-4" />
				<button
					onclick={async () => {
						await authClient.signOut();
						window.location.reload();
					}}>Se déconnecter</button
				>
			</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
{:else}
	<!-- Non connecté -->
	<Button variant="default" size="sm" href="/auth/login">Connexion</Button>
{/if}
