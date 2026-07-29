<script lang="ts">
	import { tStore } from '$lib/i18n';
	import type { Snippet } from 'svelte';

	interface Props {
		/** i18n key, or a raw string */
		title: string;
		/** i18n key, or a raw string */
		description?: string;
		icon?: string;
		/** Resolved route to navigate back to (shows a back button) */
		backHref?: string;
		children?: Snippet;
	}

	const { title, description, icon, backHref, children }: Props = $props();
</script>

<header class="mb-4 flex flex-wrap items-center justify-between gap-3 px-1 md:mb-6">
	<div class="flex min-w-0 flex-1 items-center gap-3">
		{#if backHref}
			<!-- eslint-disable svelte/no-navigation-without-resolve -- backHref arrives pre-resolved via resolve() from callers -->
			<a
				href={backHref}
				aria-label={$tStore('common.back')}
				class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface text-lg text-ink shadow-md transition hover:bg-canvas active:scale-95"
			>
				←
			</a>
			<!-- eslint-enable svelte/no-navigation-without-resolve -->
		{/if}
		{#if icon}
			<span class="shrink-0 text-3xl md:text-4xl" aria-hidden="true">{icon}</span>
		{/if}
		<div class="min-w-0">
			<h1 class="truncate text-2xl font-bold text-ink md:text-3xl">
				{$tStore(title)}
			</h1>
			{#if description}
				<p class="truncate text-sm text-ink-soft md:text-base">
					{$tStore(description)}
				</p>
			{/if}
		</div>
	</div>
	{#if children}
		<div class="flex items-center gap-2">
			{@render children()}
		</div>
	{/if}
</header>
