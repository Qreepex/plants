<script lang="ts">
	import Field from '$lib/components/ui/form/Field.svelte';
	import Input from '$lib/components/ui/form/Input.svelte';
	import type { FormData } from '$lib/types/forms';

	interface Props {
		formData: FormData;
	}

	let { formData = $bindable() }: Props = $props();
</script>

<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
	<Field label="plants.plantName" forId="name" required>
		<Input id="name" required bind:value={formData.name} />
	</Field>

	<Field label="plants.species" forId="species" required>
		<Input id="species" required bind:value={formData.species} />
	</Field>
</div>
