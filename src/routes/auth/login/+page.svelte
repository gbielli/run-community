<script lang="ts">
	import LoginForm from '$lib/components/loginForm.svelte';
</script>

<svelte:head>
	<title>Connexion - Running Community</title>
	<meta name="description" content="Connectez-vous à votre compte Running Community" />
</svelte:head>

<div
	class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800"
>
	<div class="container mx-auto px-4">
		<!-- Header -->
		<div class="pt-8 pb-4 text-center">
			<h1 class="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Running Community</h1>
			<p class="text-gray-600 dark:text-gray-300">Rejoignez la plus grande communauté de runners</p>
		</div>

		<!-- Login Component -->
		<LoginForm />

		<!-- Footer -->
		<div class="py-8 text-center">
			<p class="text-sm text-gray-500 dark:text-gray-400">
				En vous connectant, vous acceptez nos
				<a href="/terms" class="underline hover:text-gray-700 dark:hover:text-gray-300">
					conditions d'utilisation
				</a>
				et notre
				<a href="/privacy" class="underline hover:text-gray-700 dark:hover:text-gray-300">
					politique de confidentialité
				</a>
			</p>
		</div>
	</div>
</div>
