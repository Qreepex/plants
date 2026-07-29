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

<div class="space-y-4">
	<Slider
		id="temp"
		label="plants.formPreferredTemperature"
		min={-50}
		max={100}
		bind:value={formData.preferedTemperature}
		format={(v) => `${v}°C`}
	/>

	<Checkbox bind:checked={formData.winterRestPeriod} label="plants.formHasWinterRest" />

	<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
		<Slider
			id="winter-factor"
			label="plants.winterWaterFactor"
			min={0}
			max={1}
			step={0.1}
			bind:value={formData.winterWaterFactor}
			format={(v) => `${(v * 100).toFixed(0)}%`}
			hint="plants.formWinterWaterFactorHint"
		/>

		<Field label="plants.minTemp" forId="min-temp">
			<Input id="min-temp" type="number" bind:value={formData.minTempCelsius} />
		</Field>
	</div>
</div>
