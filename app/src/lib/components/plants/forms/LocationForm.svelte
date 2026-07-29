<script lang="ts">
	import Checkbox from '$lib/components/ui/form/Checkbox.svelte';
	import Field from '$lib/components/ui/form/Field.svelte';
	import Input from '$lib/components/ui/form/Input.svelte';
	import Select from '$lib/components/ui/form/Select.svelte';
	import { tStore } from '$lib/i18n';
	import { SunlightRequirement } from '$lib/types/api';
	import type { FormData } from '$lib/types/forms';

	interface Props {
		formData: FormData;
	}

	let { formData = $bindable() }: Props = $props();

	const sunlightOptions = $derived.by(() =>
		Object.values(SunlightRequirement).map((req) => ({
			value: req,
			label: $tStore('plants.sunlight.' + req) || req
		}))
	);
</script>

<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
	<Field label="plants.formSunlightRequirements" forId="sunlight">
		<Select id="sunlight" bind:value={formData.sunlight} options={sunlightOptions} />
	</Field>

	<Field label="plants.formRoom" forId="room">
		<Input id="room" placeholder="plants.formRoomPlaceholder" bind:value={formData.room} />
	</Field>

	<Field label="plants.formPosition" forId="position">
		<Input
			id="position"
			placeholder="plants.formPositionPlaceholder"
			bind:value={formData.position}
		/>
	</Field>

	<Field label="plants.formEnvironment">
		<Checkbox bind:checked={formData.isOutdoors} label="plants.outdoors" />
	</Field>
</div>
