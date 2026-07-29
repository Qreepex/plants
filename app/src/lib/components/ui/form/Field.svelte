<script lang="ts">
	import { tStore } from '$lib/i18n';
	import type { Snippet } from 'svelte';

	interface Props {
		/** i18n key for the label */
		label: string;
		forId?: string;
		required?: boolean;
		/** i18n key for an optional hint below the control */
		hint?: string;
		/** Already-translated suffix shown after the label (e.g. current slider value) */
		labelSuffix?: string;
		children: Snippet;
	}

	const { label, forId, required = false, hint, labelSuffix, children }: Props = $props();
</script>

<div>
	{#if forId}
		<label for={forId} class="mb-1 block text-sm font-semibold text-ink-soft">
			{$tStore(label)}{#if required}&nbsp;*{/if}
			{#if labelSuffix}: <span class="font-bold text-brand-dark">{labelSuffix}</span>{/if}
		</label>
	{:else}
		<span class="mb-1 block text-sm font-semibold text-ink-soft">
			{$tStore(label)}{#if required}&nbsp;*{/if}
			{#if labelSuffix}: <span class="font-bold text-brand-dark">{labelSuffix}</span>{/if}
		</span>
	{/if}
	{@render children()}
	{#if hint}
		<p class="mt-1 text-xs text-ink-soft/70">{$tStore(hint)}</p>
	{/if}
</div>
