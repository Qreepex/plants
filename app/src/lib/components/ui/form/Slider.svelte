<script lang="ts">
	import Field from './Field.svelte';

	interface Props {
		value: number;
		/** i18n key for the label */
		label: string;
		id?: string;
		min?: number;
		max?: number;
		step?: number;
		/** Custom formatter for the value shown next to the label */
		format?: (value: number) => string;
		/** i18n key for an optional hint below the slider */
		hint?: string;
	}

	let {
		value = $bindable(),
		label,
		id,
		min = 0,
		max = 100,
		step = 1,
		format,
		hint
	}: Props = $props();

	const display = $derived(format ? format(value) : String(value));
</script>

<Field {label} forId={id} labelSuffix={display} {hint}>
	<input
		type="range"
		{id}
		{min}
		{max}
		{step}
		bind:value
		class="min-h-11 w-full accent-brand-dark"
	/>
</Field>
