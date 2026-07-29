<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import PageContent from '$lib/components/layout/PageContent.svelte';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import Scrollable from '$lib/components/layout/Scrollable.svelte';
	import List from '$lib/components/layout/List.svelte';
	import WaterPlantCard from '$lib/components/plants/WaterPlantCard.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';
	import SectionHeader from '$lib/components/ui/SectionHeader.svelte';
	import Spinner from '$lib/components/ui/Spinner.svelte';
	import { getPlantsStore } from '$lib/stores/plants.svelte';
	import { getWateringStore } from '$lib/stores/watering.svelte';
	import type { Plant } from '$lib/types/api';
	import { getPlantStatusText, getPlantWaterStatus, getStatusIcon } from '$lib/utils/plant';
	import { sortByWateringPriority } from '$lib/utils/watering';
	import { SvelteDate } from 'svelte/reactivity';

	const store = getPlantsStore();
	const watering = getWateringStore();

	const hasWateringConfig = (plant: Plant) => !!plant.watering?.intervalDays;

	const configuredPlants = $derived.by(() => {
		const sorted = sortByWateringPriority(store.plants.filter(hasWateringConfig));
		const priority = { overdue: 0, 'due-soon': 1, ok: 2 } as const;
		return [...sorted].sort(
			(a, b) => priority[getPlantWaterStatus(a)] - priority[getPlantWaterStatus(b)]
		);
	});

	const duePlants = $derived(
		configuredPlants.filter((p) => ['overdue', 'due-soon'].includes(getPlantWaterStatus(p)))
	);
	const okPlants = $derived(configuredPlants.filter((p) => getPlantWaterStatus(p) === 'ok'));
	const unconfiguredPlants = $derived(store.plants.filter((p) => !hasWateringConfig(p)));

	function getNextWaterDate(plant: Plant): Date {
		const lastWatered = plant.watering?.lastWatered
			? new Date(plant.watering.lastWatered)
			: new Date();
		const nextWaterDate = new SvelteDate(lastWatered);
		nextWaterDate.setDate(nextWaterDate.getDate() + (plant.watering?.intervalDays ?? 0));
		return nextWaterDate;
	}
</script>

<PageHeader icon="💧" title="menu.waterPlants" description="menu.wateringDescription" />

<PageContent>
	{#if store.error}
		<div class="mx-2 mb-3">
			<Alert type="error" title="common.error" description={store.error} />
		</div>
	{/if}

	{#if store.loading}
		<Spinner message="common.loadingPlants" />
	{:else if store.plants.length === 0}
		<EmptyState icon="🪴" title="plants.noPlants" description="plants.startAddingPlants">
			<Button
				variant="primary"
				onclick={() => goto(resolve('/manage/new'))}
				text="plants.addPlant"
			/>
		</EmptyState>
	{:else if configuredPlants.length === 0 && unconfiguredPlants.length === 0}
		<EmptyState icon="✅" title="plants.allWatered" description="plants.allPlantsWatered" />
	{:else}
		<Scrollable noPadding>
			<div class="space-y-6 px-2">
				{#if duePlants.length > 0}
					<section>
						<SectionHeader
							icon="🌵"
							title="plants.needsWater"
							count={duePlants.length}
							tone="danger"
						/>
						<List noPadding>
							{#each duePlants as plant (plant.id)}
								<WaterPlantCard
									{plant}
									status={getPlantWaterStatus(plant)}
									statusTextKey={getPlantStatusText(plant)}
									statusIcon={getStatusIcon(getPlantWaterStatus(plant)).emoji}
									isWatering={watering.isWatering(plant.id)}
									isSelected={watering.selectedId === plant.id}
									onWater={(id) => watering.waterPlant(id)}
									onSelect={(id) => watering.toggleSelection(id)}
									showNextWater={false}
								/>
							{/each}
						</List>
					</section>
				{/if}

				{#if okPlants.length > 0}
					<section>
						<SectionHeader icon="✅" title="plants.watered" count={okPlants.length} tone="ok" />
						<List noPadding>
							{#each okPlants as plant (plant.id)}
								<WaterPlantCard
									{plant}
									status={getPlantWaterStatus(plant)}
									statusTextKey={getPlantStatusText(plant)}
									statusIcon={getStatusIcon(getPlantWaterStatus(plant)).emoji}
									isWatering={watering.isWatering(plant.id)}
									isSelected={watering.selectedId === plant.id}
									onWater={(id) => watering.waterPlant(id)}
									onSelect={(id) => watering.toggleSelection(id)}
									showNextWater
									nextWaterDate={getNextWaterDate(plant)}
								/>
							{/each}
						</List>
					</section>
				{/if}

				{#if unconfiguredPlants.length > 0}
					<section>
						<SectionHeader
							icon="⚙️"
							title="plants.noWateringConfig"
							count={unconfiguredPlants.length}
							tone="warn"
						/>
						<List noPadding>
							{#each unconfiguredPlants as plant (plant.id)}
								<div
									class="flex items-center justify-between gap-3 rounded-2xl bg-surface p-4 shadow"
								>
									<div class="min-w-0 flex-1">
										<p class="truncate font-semibold text-ink">{plant.name}</p>
										<p class="truncate text-xs text-ink-soft">{plant.species}</p>
									</div>
									<Button
										variant="secondary"
										size="sm"
										text="plants.configureWateringSchedule"
										icon="💧"
										onclick={() => goto(resolve(`/manage/${plant.id}/edit/watering`))}
									/>
								</div>
							{/each}
						</List>
					</section>
				{/if}
			</div>
		</Scrollable>
	{/if}
</PageContent>
