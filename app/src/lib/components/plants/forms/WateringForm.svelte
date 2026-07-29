<script lang="ts">
	import Field from '$lib/components/ui/form/Field.svelte';
	import Input from '$lib/components/ui/form/Input.svelte';
	import Select from '$lib/components/ui/form/Select.svelte';
	import { tStore } from '$lib/i18n';
	import { WateringMethod, WaterType } from '$lib/types/api';
	import type { FormData } from '$lib/types/forms';

	interface Props {
		formData: FormData;
	}

	let { formData = $bindable() }: Props = $props();

	const methodOptions = $derived.by(() =>
		Object.values(WateringMethod).map((method) => ({
			value: method,
			label: $tStore('plants.wateringMethodOptions.' + method) || method
		}))
	);

	const typeOptions = $derived.by(() =>
		Object.values(WaterType).map((type) => ({
			value: type,
			label: $tStore('plants.waterTypeOptions.' + type) || type
		}))
	);
</script>

<div class="space-y-4">
	<Field label="plants.formIntervalDays" forId="water-interval">
		<Input id="water-interval" type="number" min={1} bind:value={formData.wateringIntervalDays} />
	</Field>

	<Field label="plants.wateringMethod" forId="water-method">
		<Select id="water-method" bind:value={formData.wateringMethod} options={methodOptions} />
	</Field>

	<Field label="plants.waterType" forId="water-type">
		<Select id="water-type" bind:value={formData.waterType} options={typeOptions} />
	</Field>
</div>
