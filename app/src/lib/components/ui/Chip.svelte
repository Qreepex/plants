<script lang="ts">
	import { toneBg, toneText, type Tone } from './tone';

	interface Props {
		tone?: Tone;
		/** Leading emoji/icon, already-translated label as children text */
		icon?: string;
		text: string;
		class?: string;
	}

	const { tone = 'brand', icon, text, class: className = '' }: Props = $props();
</script>

<span
	class="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium {toneBg[
		tone
	]} {toneText[tone]} {className}"
>
	{#if icon}<span aria-hidden="true">{icon}</span>{/if}
	{text}
</span>
