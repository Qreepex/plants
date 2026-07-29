<script lang="ts">
	import { tStore } from '$lib/i18n';
	import { toneText, type Tone } from '../ui/tone';

	interface DetailRow {
		/** i18n key for the label */
		labelKey: string;
		value: string;
	}

	interface Props {
		tone?: Tone;
		/** i18n key for the panel heading */
		titleKey: string;
		rows: DetailRow[];
	}

	const { tone = 'brand', titleKey, rows }: Props = $props();
</script>

<div class="rounded-xl border border-ink/5 bg-canvas/60 p-4">
	<div class="text-sm font-semibold {toneText[tone]}">{$tStore(titleKey)}</div>
	<dl class="mt-2 space-y-1 text-sm text-ink">
		{#each rows as row (row.labelKey)}
			<div class="flex flex-wrap items-baseline gap-x-2">
				<dt class="text-ink-soft">{$tStore(row.labelKey)}:</dt>
				<dd class="break-words">{row.value}</dd>
			</div>
		{/each}
	</dl>
</div>
