<script lang="ts">
	import Scrollable from '$lib/components/layout/Scrollable.svelte';
	import SearchInput from '$lib/components/ui/SearchInput.svelte';
	import type { Plant } from '$lib/types/api';
	import { sortPlants, type SortOption } from '$lib/utils/plant';
	import PlantCard from './PlantCard.svelte';
	import SortControls from './SortControls.svelte';

	interface Props {
		plants: Plant[];
		sortBy: SortOption;
		onSortChange: (sort: SortOption) => void;
	}

	const { plants, sortBy, onSortChange }: Props = $props();

	let searchQuery = $state('');

	const filteredPlants = $derived.by(() => {
		const filtered = sortPlants(plants, sortBy);
		const query = searchQuery.toLowerCase().trim();
		if (!query) return filtered;

		return filtered.filter((plant) =>
			[plant.name, plant.species, plant.location?.room, plant.location?.position]
				.filter(Boolean)
				.some((field) => field!.toLowerCase().includes(query))
		);
	});
</script>

<!-- Search and controls -->
<div class="mb-3 flex flex-shrink-0 items-center gap-2 px-2">
	<div class="min-w-0 flex-1">
		<SearchInput bind:value={searchQuery} />
	</div>

	<div
		class="flex h-11 min-w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand/10 px-2.5 text-xs font-semibold text-ink"
		aria-label="{filteredPlants.length} plants"
	>
		{filteredPlants.length}
	</div>

	<SortControls {sortBy} {onSortChange} compact iconOnly />
</div>

<Scrollable multi>
	{#each filteredPlants as plant, i (plant.id)}
		<PlantCard {plant} index={i} />
	{/each}
</Scrollable>
