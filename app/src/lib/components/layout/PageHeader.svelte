<script lang="ts">
	import Icon from '$lib/components/ui/Icon.svelte';
	import type { IconName } from '$lib/components/ui/icons';
	import { tStore } from '$lib/i18n';
	import type { Snippet } from 'svelte';

	interface Props {
		/** i18n key, or a raw string */
		title: string;
		/** i18n key, or a raw string */
		description?: string;
		icon?: IconName;
		/** Resolved route to navigate back to (shows a back button) */
		backHref?: string;
		children?: Snippet;
	}

	const { title, description, icon, backHref, children }: Props = $props();
</script>

<header class="mb-4 flex flex-wrap items-center justify-between gap-3 px-1 md:mb-6">
	<div class="flex min-w-0 flex-1 items-center gap-3">
		{#if backHref}
			<!-- backHref arrives pre-resolved via resolve() from callers -->
			<!-- eslint-disable svelte/no-navigation-without-resolve -->
			<a
				href={backHref}
				aria-label={$tStore('common.back')}
				class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface text-ink shadow-md transition hover:bg-canvas active:scale-95"
			>
				<Icon name="arrow-left" size={22} />
			</a>
			<!-- eslint-enable svelte/no-navigation-without-resolve -->
		{/if}
		{#if icon}
			<span
				class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-surface text-brand-dark shadow-md md:h-12 md:w-12 dark:text-brand"
				aria-hidden="true"
			>
				<Icon name={icon} size={26} />
			</span>
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
