<script lang="ts">
	import { toneBg, toneText, type Tone } from './tone';

	interface Props {
		tone?: Tone;
		icon?: string;
		label: string;
		value: string;
		class?: string;
	}

	const { tone = 'brand', icon, label, value, class: className = '' }: Props = $props();
</script>

<div class="rounded-xl p-3.5 {toneBg[tone]} {className}">
	<div class="text-xs font-semibold {toneText[tone]}">
		{#if icon}<span aria-hidden="true">{icon}</span>
		{/if}{label}
	</div>
	<div class="mt-1 text-sm font-medium text-ink">{value}</div>
</div>
