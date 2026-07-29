<script lang="ts">
	import Field from '$lib/components/ui/form/Field.svelte';
	import Input from '$lib/components/ui/form/Input.svelte';
	import ListEditor from '$lib/components/ui/form/ListEditor.svelte';
	import type { FormData } from '$lib/types/forms';

	interface Props {
		formData: FormData;
	}

	let { formData = $bindable() }: Props = $props();
</script>

<div class="space-y-4">
	<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
		<Field label="plants.soilType" forId="soil-type">
			<Input
				id="soil-type"
				placeholder="plants.formSoilTypePlaceholder"
				bind:value={formData.soilType}
			/>
		</Field>

		<Field label="plants.repottingCycle" forId="repot-cycle">
			<Input id="repot-cycle" type="number" min={1} bind:value={formData.repottingCycle} />
		</Field>
	</div>

	<Field label="plants.soilComponents">
		<ListEditor
			bind:items={formData.soilComponents}
			placeholder="plants.formSoilComponentsPlaceholder"
			emptyText="plants.formNoComponentsAdded"
		/>
	</Field>
</div>
