<script lang="ts">
	import { goto } from '$app/navigation';
	import { authClient } from '$lib/auth-client';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Eye, EyeOff, Loader2, Lock, Mail } from '@lucide/svelte';

	let email = $state('');
	let password = $state('');
	let isLoading = $state(false);
	let error = $state('');
	let showPassword = $state(false);
	let isSignUp = $state(false);

	// Session reactive pour redirection automatique
	const session = authClient.useSession();

	// Redirection si déjà connecté
	$effect(() => {
		if ($session.data) {
			goto('/dashboard');
		}
	});

	// Validation reactive
	const isFormValid = $derived(email.length > 0 && password.length >= 8);

	async function handleLogin() {
		if (!isFormValid) return;
		isLoading = true;
		error = '';

		try {
			let result;

			if (isSignUp) {
				result = await authClient.signUp.email({
					email,
					password,
					name: email.split('@')[0],
					callbackURL: '/dashboard'
				});
			} else {
				result = await authClient.signIn.email({
					email,
					password,
					callbackURL: '/dashboard'
				});
			}

			if (result.error) {
				error = result.error.message || "Erreur d'authentification";
			} else {
				// Succès - redirection se fera automatiquement via $effect
				console.log('Authentification réussie !');
			}
		} catch (e) {
			error = 'Erreur de connexion. Vérifiez votre connexion internet.';
			console.error('Erreur auth:', e);
		} finally {
			isLoading = false;
		}
	}

	function toggleAuthMode() {
		isSignUp = !isSignUp;
		error = '';
	}
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
	<Card class="w-full max-w-md">
		<CardHeader class="space-y-1">
			<CardTitle class="text-center text-2xl font-bold">
				{isSignUp ? 'Créer un compte' : 'Connexion'}
			</CardTitle>
			<p class="text-center text-sm text-muted-foreground">
				{isSignUp ? 'Rejoignez la communauté running' : 'Connectez-vous à votre compte'}
			</p>
		</CardHeader>

		<CardContent class="space-y-4">
			<!-- ✅ Syntaxe Svelte 5 : onsubmit avec preventDefault -->
			<form
				onsubmit={(e) => {
					e.preventDefault();
					handleLogin();
				}}
				class="space-y-4"
			>
				<!-- Email Field -->
				<div class="space-y-2">
					<Label for="email">Email</Label>
					<div class="relative">
						<Mail class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							id="email"
							type="email"
							placeholder="votre.email@exemple.com"
							bind:value={email}
							class="pl-10"
							required
						/>
					</div>
				</div>

				<!-- Password Field -->
				<div class="space-y-2">
					<Label for="password">Mot de passe</Label>
					<div class="relative">
						<Lock class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							id="password"
							type={showPassword ? 'text' : 'password'}
							placeholder={isSignUp ? 'Minimum 8 caractères' : 'Votre mot de passe'}
							bind:value={password}
							class="pr-10 pl-10"
							required
						/>
						<button
							type="button"
							onclick={() => (showPassword = !showPassword)}
							class="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
						>
							{#if showPassword}
								<EyeOff class="h-4 w-4" />
							{:else}
								<Eye class="h-4 w-4" />
							{/if}
						</button>
					</div>
					{#if password.length > 0 && password.length < 8}
						<p class="text-sm text-red-500">Le mot de passe doit contenir au moins 8 caractères</p>
					{/if}
				</div>

				<!-- Error Message -->
				{#if error}
					<div class="rounded-md border border-red-200 bg-red-50 p-3">
						<p class="text-sm text-red-800">{error}</p>
					</div>
				{/if}

				<!-- Submit Button -->
				<Button type="submit" disabled={!isFormValid || isLoading} class="w-full">
					{#if isLoading}
						<Loader2 class="mr-2 h-4 w-4 animate-spin" />
						{isSignUp ? 'Création...' : 'Connexion...'}
					{:else}
						{isSignUp ? 'Créer mon compte' : 'Se connecter'}
					{/if}
				</Button>
			</form>

			<!-- Toggle Auth Mode -->
			<div class="text-center">
				<button
					type="button"
					onclick={toggleAuthMode}
					class="text-sm text-muted-foreground underline hover:text-foreground"
				>
					{isSignUp ? 'Déjà un compte ? Se connecter' : "Pas de compte ? S'inscrire"}
				</button>
			</div>

			<!-- Forgot Password -->
			{#if !isSignUp}
				<div class="text-center">
					<button
						type="button"
						onclick={() => goto('/auth/forgot-password')}
						class="text-sm text-muted-foreground underline hover:text-foreground"
					>
						Mot de passe oublié ?
					</button>
				</div>
			{/if}
		</CardContent>
	</Card>
</div>
