<script lang="ts">
	import { tStore } from '$lib/i18n';
	import type { Snippet } from 'svelte';

	interface Props {
		icon: string;
		/** i18n keys */
		title: string;
		description: string;
		children?: Snippet;
	}

	const { icon, title, description, children }: Props = $props();
</script>

<div class="rounded-2xl border-2 border-dashed border-brand/50 bg-canvas px-4 py-12 text-center">
	<div class="mb-4 text-5xl" aria-hidden="true">{icon}</div>
	<h2 class="mb-2 text-xl font-bold text-ink md:text-2xl">{$tStore(title)}</h2>
	<p class="mx-auto mb-6 max-w-md text-ink-soft">{$tStore(description)}</p>
	{#if children}
		<div class="mt-6 flex justify-center">
			{@render children?.()}
		</div>
	{/if}
</div>
