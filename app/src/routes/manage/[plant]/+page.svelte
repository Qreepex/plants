<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { fetchData } from '$lib/auth/fetch.svelte';
	import PageContent from '$lib/components/layout/PageContent.svelte';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Spinner from '$lib/components/ui/Spinner.svelte';
	import { tStore } from '$lib/i18n';
	import type { Plant } from '$lib/types/api';
	import { PLANT_SECTIONS } from '$lib/utils/plantForm';

	let plant = $state<Plant | null>(null);
	let loading = $state(true);
	let error = $state<string | null>(null);

	const isCreateFlow = $derived(page.url.searchParams.get('createFlow') === '1');

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

	function goToSection(section: string): void {
		if (!plant) return;
		const flowQuery = isCreateFlow ? '?createFlow=1' : '';
		if (section === 'photos') {
			goto(resolve(`/manage/${plant.id}/photos${flowQuery}`));
			return;
		}
		goto(resolve(`/manage/${plant.id}/edit/${section}${flowQuery}`));
	}
</script>

<PageHeader
	icon="🧭"
	title={plant?.name || $tStore('plants.editPlant')}
	description={plant?.species || $tStore('plants.manageHubDescription')}
	backHref={resolve(`/plant/${page.params.plant}`)}
/>

<PageContent>
	{#if loading}
		<Spinner message="common.loadingPlantDetails" />
	{:else if !plant}
		<Alert
			type="error"
			title="common.error"
			description={error || $tStore('common.plantNotFound')}
		/>
	{:else}
		<div class="px-2">
			<p class="mb-3 px-1 text-base font-semibold text-ink">
				{$tStore('plants.manageSections')}
			</p>
			<Card>
				{#each PLANT_SECTIONS as item, index (item.key)}
					<button
						onclick={() => goToSection(item.key)}
						class="flex min-h-14 w-full cursor-pointer items-center justify-between px-4 py-3 text-left text-base font-medium text-ink transition hover:bg-brand/5 active:bg-brand/10"
					>
						<span class="flex items-center gap-3">
							<span aria-hidden="true">{item.emoji}</span>
							{$tStore(item.label)}
						</span>
						<span class="text-ink-soft" aria-hidden="true">›</span>
					</button>
					{#if index < PLANT_SECTIONS.length - 1}
						<div class="mx-4 h-px bg-brand/10"></div>
					{/if}
				{/each}
			</Card>
		</div>
	{/if}
</PageContent>
