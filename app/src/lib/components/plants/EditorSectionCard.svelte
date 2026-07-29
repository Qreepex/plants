<script lang="ts">
	import { tStore } from '$lib/i18n';
	import type { Snippet } from 'svelte';
	import Icon from '../ui/Icon.svelte';
	import type { IconName } from '../ui/icons';
	import { toneBg, toneText, type Tone } from '../ui/tone';

	interface Props {
		/** Section key — used for anchor id and scroll-spy */
		id: string;
		icon: IconName;
		titleKey: string;
		/** Short live summary of the current values, shown under the title */
		summary?: string;
		tone?: Tone;
		children: Snippet;
	}

	const { id, icon, titleKey, summary, tone = 'brand', children }: Props = $props();
</script>

<section
	id="editor-section-{id}"
	data-editor-section={id}
	class="scroll-mt-3 overflow-hidden rounded-2xl border border-ink/5 bg-surface shadow-md"
>
	<header class="flex items-center gap-3 border-b border-ink/5 px-4 py-3.5 md:px-6">
		<span
			class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl {toneBg[
				tone
			]} {toneText[tone]}"
			aria-hidden="true"
		>
			<Icon name={icon} size={20} />
		</span>
		<div class="min-w-0">
			<h2 class="text-base font-bold text-ink md:text-lg">{$tStore(titleKey)}</h2>
			{#if summary}
				<p class="truncate text-xs font-medium {toneText[tone]}">{summary}</p>
			{/if}
		</div>
	</header>
	<div class="p-4 md:p-6">
		{@render children()}
	</div>
</section>
