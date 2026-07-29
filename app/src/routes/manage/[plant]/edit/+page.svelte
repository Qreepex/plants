<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { fetchData } from '$lib/auth/fetch.svelte';
	import PageContent from '$lib/components/layout/PageContent.svelte';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import PlantEditor from '$lib/components/plants/PlantEditor.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import Spinner from '$lib/components/ui/Spinner.svelte';
	import { tStore } from '$lib/i18n';
	import type { Plant } from '$lib/types/api';

	let plant = $state<Plant | null>(null);
	let loading = $state(true);
	let error = $state<string | null>(null);

	onMount(async () => {
		try {
			const plantId = page.params.plant ?? '';
			const res = await fetchData('/api/plants/{id}', {
				params: { id: plantId }
			});

			if (!res.ok) {
				error = res.error?.message || $tStore('plants.failedToFetchPlants');
				return;
			}

			plant = res.data;
		} catch (err) {
			error = err instanceof Error ? err.message : $tStore('plants.failedToFetchPlants');
		} finally {
			loading = false;
		}
	});
</script>

{#if loading}
	<PageHeader icon="pencil" title="plants.editPlant" />
	<PageContent>
		<Spinner message="common.loadingPlantDetails" />
	</PageContent>
{:else if !plant}
	<PageHeader icon="pencil" title="plants.editPlant" />
	<PageContent>
		<Alert
			type="error"
			title="common.error"
			description={error || $tStore('common.plantNotFound')}
		/>
	</PageContent>
{:else}
	{#key plant.id}
		<PlantEditor mode="edit" {plant} />
	{/key}
{/if}
