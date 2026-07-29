<script lang="ts">
	import Icon from './Icon.svelte';
	import type { IconName } from './icons';
	import { toneBg, toneText, type Tone } from './tone';

	interface Props {
		tone?: Tone;
		icon?: IconName;
		text: string;
		class?: string;
	}

	const { tone = 'brand', icon, text, class: className = '' }: Props = $props();
</script>

<span
	class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium {toneBg[
		tone
	]} {toneText[tone]} {className}"
>
	{#if icon}<Icon name={icon} size={13} />{/if}
	{text}
</span>
