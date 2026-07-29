<script lang="ts">
	import Checkbox from '$lib/components/ui/form/Checkbox.svelte';
	import Field from '$lib/components/ui/form/Field.svelte';
	import ListEditor from '$lib/components/ui/form/ListEditor.svelte';
	import { PlantFlag } from '$lib/types/api';
	import type { FormData } from '$lib/types/forms';

	interface Props {
		formData: FormData;
	}

	let { formData = $bindable() }: Props = $props();

	function toggleFlag(flag: PlantFlag): void {
		formData.flags = formData.flags.includes(flag)
			? formData.flags.filter((f) => f !== flag)
			: [...formData.flags, flag];
	}
</script>

<div class="space-y-4">
	<Field label="plants.formSafety">
		<Checkbox bind:checked={formData.isToxic} label="plants.formToxicToPetsChildren" />
	</Field>

	<Field label="plants.flags">
		<div class="space-y-1">
			{#each Object.values(PlantFlag) as flag (flag)}
				<label
					class="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl px-2 transition hover:bg-brand/5"
				>
					<input
						type="checkbox"
						checked={formData.flags.includes(flag)}
						onchange={() => toggleFlag(flag)}
						class="h-5 w-5 shrink-0 accent-brand-dark"
					/>
					<span class="text-base text-ink">{flag}</span>
				</label>
			{/each}
		</div>
	</Field>

	<Field label="plants.notesTitle">
		<ListEditor
			bind:items={formData.notes}
			placeholder="plants.formAddNotePlaceholder"
			emptyText="plants.formNoNotesYet"
		/>
	</Field>
</div>
