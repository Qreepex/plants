<script lang="ts">
	import { tStore } from '$lib/i18n';
	import { toneBg, toneText, type Tone } from './tone';

	interface Props {
		icon?: string;
		/** i18n key for the heading */
		title: string;
		count?: number;
		tone?: Tone;
	}

	const { icon, title, count, tone = 'brand' }: Props = $props();
</script>

<div class="mb-3 flex items-center gap-2 px-1">
	<h2 class="text-lg font-bold text-ink md:text-xl">
		{#if icon}<span aria-hidden="true">{icon}</span>
		{/if}{$tStore(title)}
	</h2>
	{#if count !== undefined}
		<span
			class="ml-auto rounded-full px-3 py-0.5 text-sm font-semibold {toneBg[tone]} {toneText[tone]}"
		>
			{count}
		</span>
	{/if}
</div>
