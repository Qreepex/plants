<script lang="ts">
	import { tStore } from '$lib/i18n';
	import Icon from './Icon.svelte';
	import type { IconName } from './icons';
	import { toneBg, toneText, type Tone } from './tone';

	interface Props {
		icon?: IconName;
		/** i18n key for the heading */
		title: string;
		count?: number;
		tone?: Tone;
	}

	const { icon, title, count, tone = 'brand' }: Props = $props();
</script>

<div class="mb-3 flex items-center gap-2 px-1">
	{#if icon}
		<span class={toneText[tone]} aria-hidden="true">
			<Icon name={icon} size={22} />
		</span>
	{/if}
	<h2 class="text-lg font-bold text-ink md:text-xl">
		{$tStore(title)}
	</h2>
	{#if count !== undefined}
		<span
			class="ml-auto rounded-full px-3 py-0.5 text-sm font-semibold {toneBg[tone]} {toneText[tone]}"
		>
			{count}
		</span>
	{/if}
</div>
