<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import PageContent from '$lib/components/layout/PageContent.svelte';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import PlantList from '$lib/components/plants/PlantList.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';
	import Spinner from '$lib/components/ui/Spinner.svelte';
	import { getPlantsStore } from '$lib/stores/plants.svelte';
	import type { SortOption } from '$lib/utils/plant';

	const store = getPlantsStore();
	let sortBy = $state<SortOption>('nameAsc');
</script>

<PageHeader icon="sprout" title="common.app" description="common.appDescription" />

<PageContent>
	{#if store.loading}
		<Spinner message="common.loadingPlants" />
	{:else if store.error}
		<Alert type="error" title="common.errorLoadingPlants" description={store.error} />
	{:else if store.plants.length === 0}
		<EmptyState icon="leaf" title="plants.noPlants" description="plants.startAddingPlants">
			<Button
				variant="primary"
				onclick={() => goto(resolve('/manage/new'))}
				text="plants.addPlant"
			/>
		</EmptyState>
	{:else}
		<PlantList plants={store.plants} {sortBy} onSortChange={(value) => (sortBy = value)} />
	{/if}
</PageContent>
