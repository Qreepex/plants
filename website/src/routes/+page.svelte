<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import Icon from '$lib/components/ui/Icon.svelte';

	onMount(() => {
		// Detect user's preferred language
		let userLang = 'en';

		if (typeof window !== 'undefined') {
			const browserLang = navigator.language.split('-')[0];
			if (browserLang === 'de') {
				userLang = 'de';
			} else if (browserLang === 'es') {
				userLang = 'es';
			}
		}

		// Redirect to language-specific page
		goto(resolve(`/${userLang as 'en' | 'de' | 'es'}`), { replaceState: true });
	});
</script>

<svelte:head>
	<title>Water Me - Redirecting...</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-canvas">
	<div class="text-center">
		<div
			class="mx-auto mb-4 flex h-16 w-16 animate-bounce items-center justify-center rounded-3xl bg-brand text-onbrand shadow-[0_4px_20px_rgba(0,238,87,0.4)]"
		>
			<Icon name="sprout" size={34} />
		</div>
		<h1 class="text-2xl font-bold text-ink">Redirecting...</h1>
	</div>
</div>
