<script lang="ts">
	import Checkbox from '$lib/components/ui/form/Checkbox.svelte';
	import Field from '$lib/components/ui/form/Field.svelte';
	import Input from '$lib/components/ui/form/Input.svelte';
	import Slider from '$lib/components/ui/form/Slider.svelte';
	import type { FormData } from '$lib/types/forms';

	interface Props {
		formData: FormData;
	}

	let { formData = $bindable() }: Props = $props();
</script>

<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
	<Slider
		id="humidity"
		label="plants.targetHumidity"
		min={0}
		max={100}
		bind:value={formData.targetHumidity}
		format={(v) => `${v}%`}
	/>

	<div class="space-y-1">
		<Checkbox bind:checked={formData.requiresMisting} label="plants.formRequiresMisting" />
		<Checkbox bind:checked={formData.requiresHumidifier} label="plants.formNeedsHumidifier" />
	</div>

	{#if formData.requiresMisting}
		<Field label="plants.mistingInterval" forId="mist-interval">
			<Input id="mist-interval" type="number" min={1} bind:value={formData.mistingIntervalDays} />
		</Field>
	{/if}
</div>
