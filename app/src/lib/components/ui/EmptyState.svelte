<script lang="ts">
	import { tStore } from '$lib/i18n';
	import type { Snippet } from 'svelte';
	import Icon from './Icon.svelte';
	import type { IconName } from './icons';

	interface Props {
		icon: IconName;
		/** i18n keys */
		title: string;
		description: string;
		children?: Snippet;
	}

	const { icon, title, description, children }: Props = $props();
</script>

<div
	class="rounded-2xl border-2 border-dashed border-brand/50 bg-surface/50 px-4 py-12 text-center"
>
	<div
		class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand/15 text-brand-dark dark:text-brand"
		aria-hidden="true"
	>
		<Icon name={icon} size={32} />
	</div>
	<h2 class="mb-2 text-xl font-bold text-ink md:text-2xl">{$tStore(title)}</h2>
	<p class="mx-auto mb-6 max-w-md text-ink-soft">{$tStore(description)}</p>
	{#if children}
		<div class="mt-6 flex justify-center">
			{@render children?.()}
		</div>
	{/if}
</div>
