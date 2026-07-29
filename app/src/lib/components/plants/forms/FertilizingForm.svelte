<script lang="ts">
	import Checkbox from '$lib/components/ui/form/Checkbox.svelte';
	import Field from '$lib/components/ui/form/Field.svelte';
	import Input from '$lib/components/ui/form/Input.svelte';
	import Select from '$lib/components/ui/form/Select.svelte';
	import Slider from '$lib/components/ui/form/Slider.svelte';
	import { tStore } from '$lib/i18n';
	import { FertilizerType } from '$lib/types/api';
	import type { FormData } from '$lib/types/forms';

	interface Props {
		formData: FormData;
	}

	let { formData = $bindable() }: Props = $props();

	const typeOptions = $derived.by(() =>
		Object.values(FertilizerType).map((type) => ({
			value: type,
			label: $tStore('plants.fertilizerTypeOptions.' + type) || type
		}))
	);
</script>

<div class="space-y-4">
	<Field label="plants.formIntervalDays" forId="fert-interval">
		<Input id="fert-interval" type="number" min={1} bind:value={formData.fertilizingIntervalDays} />
	</Field>

	<Field label="plants.formType" forId="fert-type">
		<Select id="fert-type" bind:value={formData.fertilizingType} options={typeOptions} />
	</Field>

	<Field label="plants.npkRatio" forId="npk-ratio">
		<Input id="npk-ratio" placeholder="plants.formNpkPlaceholder" bind:value={formData.npkRatio} />
	</Field>

	<Slider
		id="concentration"
		label="plants.concentration"
		min={1}
		max={100}
		bind:value={formData.concentrationPercent}
		format={(v) => `${v}%`}
	/>

	<Checkbox bind:checked={formData.activeInWinter} label="plants.formFertilizeInWinter" />
</div>
