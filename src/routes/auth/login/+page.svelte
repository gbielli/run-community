<script lang="ts">
	import LoginForm from '$lib/components/loginForm.svelte';
</script>

<svelte:head>
	<title>Connexion - Running Community</title>
	<meta name="description" content="Connectez-vous à votre compte Running Community" />
</svelte:head>

<div class="min-h-screen bg-gray-50 dark:from-gray-900 dark:to-gray-800">
	<div class="container mx-auto px-4">
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
