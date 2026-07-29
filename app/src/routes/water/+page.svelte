<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import List from '$lib/components/layout/List.svelte';
	import PageContent from '$lib/components/layout/PageContent.svelte';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import Scrollable from '$lib/components/layout/Scrollable.svelte';
	import WaterPlantCard from '$lib/components/plants/WaterPlantCard.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';
	import HoldButton from '$lib/components/ui/HoldButton.svelte';
	import MoodFace from '$lib/components/ui/MoodFace.svelte';
	import SectionHeader from '$lib/components/ui/SectionHeader.svelte';
	import Spinner from '$lib/components/ui/Spinner.svelte';
	import { tStore } from '$lib/i18n';
	import { getPlantsStore } from '$lib/stores/plants.svelte';
	import { getWateringStore } from '$lib/stores/watering.svelte';
	import type { Plant } from '$lib/types/api';
	import { getPlantWaterStatus } from '$lib/utils/plant';
	import { sortByWateringPriority } from '$lib/utils/watering';

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
</script>

<PageHeader icon="droplet" title="menu.waterPlants" description="menu.wateringDescription" />

<PageContent>
	{#if store.error}
		<div class="mx-2 mb-3 shrink-0">
			<Alert type="error" title="common.error" description={store.error} />
		</div>
	{/if}

	{#if store.loading}
		<Spinner message="common.loadingPlants" />
	{:else if store.plants.length === 0}
		<EmptyState icon="leaf" title="plants.noPlants" description="plants.startAddingPlants">
			<Button
				variant="primary"
				onclick={() => goto(resolve('/manage/new'))}
				text="plants.addPlant"
			/>
		</EmptyState>
	{:else if configuredPlants.length === 0 && unconfiguredPlants.length === 0}
		<EmptyState
			icon="check-circle"
			title="plants.allWatered"
			description="plants.allPlantsWatered"
		/>
	{:else}
		<Scrollable noPadding>
			<div class="space-y-6 px-2 pb-8">
				{#if duePlants.length > 0}
					<!-- Summary: how many are thirsty + water-all shortcut -->
					<Card padded class="border-none bg-info/10">
						<div class="flex items-center gap-4">
							<MoodFace mood="thirsty" size={56} class="shrink-0 text-info" />
							<div class="min-w-0 flex-1">
								<p class="text-xl leading-tight font-bold text-ink">
									{duePlants.length} × {$tStore('plants.needsWater')}
								</p>
							</div>
						</div>
						<div class="mt-3">
							<HoldButton
								variant="water"
								size="lg"
								icon="droplets"
								label={$tStore('plants.waterAllPlants', [String(duePlants.length)])}
								disabled={watering.isWateringAny}
								onconfirm={() => watering.waterPlants(duePlants.map((p) => p.id))}
							/>
						</div>
					</Card>

					<section>
						<SectionHeader
							icon="alert-triangle"
							title="plants.needsWater"
							count={duePlants.length}
							tone="danger"
						/>
						<List noPadding>
							{#each duePlants as plant (plant.id)}
								<WaterPlantCard {plant} />
							{/each}
						</List>
					</section>
				{/if}

				{#if okPlants.length > 0}
					<section>
						<SectionHeader
							icon="check-circle"
							title="plants.watered"
							count={okPlants.length}
							tone="ok"
						/>
						<List noPadding>
							{#each okPlants as plant (plant.id)}
								<WaterPlantCard {plant} compact />
							{/each}
						</List>
					</section>
				{/if}

				{#if unconfiguredPlants.length > 0}
					<section>
						<SectionHeader
							icon="settings"
							title="plants.noWateringConfig"
							count={unconfiguredPlants.length}
							tone="neutral"
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
										icon="droplet"
										onclick={() => goto(resolve(`/manage/${plant.id}/edit#watering`))}
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
