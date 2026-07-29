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
			<!-- extra bottom padding reserves space for the floating water-all bar -->
			<div class="space-y-6 px-2 {duePlants.length > 0 ? 'pb-44' : 'pb-8'}">
				{#if duePlants.length > 0}
					<!-- Thirsty plants first, biggest cards -->
					<section>
						<SectionHeader
							icon="alert-triangle"
							title="plants.needsWater"
							count={duePlants.length}
							tone="danger"
						/>
						<List noPadding class="md:grid-cols-2 2xl:grid-cols-3">
							{#each duePlants as plant, i (plant.id)}
								<WaterPlantCard {plant} index={i} />
							{/each}
						</List>
					</section>
				{:else if okPlants.length > 0}
					<!-- Celebration: everything is hydrated -->
					<Card padded class="pop-in border-none bg-brand/15 text-center">
						<div class="flex justify-center">
							<MoodFace mood="happy" size={72} class="animate-pulse text-ok" />
						</div>
						<p class="mt-3 text-xl font-bold text-ink">{$tStore('plants.allWatered')}</p>
						<p class="mt-1 text-sm text-ink-soft">{$tStore('plants.allPlantsWatered')}</p>
					</Card>
				{/if}

				{#if okPlants.length > 0}
					<section>
						<SectionHeader
							icon="check-circle"
							title="plants.watered"
							count={okPlants.length}
							tone="ok"
						/>
						<List noPadding class="md:grid-cols-2 2xl:grid-cols-3">
							{#each okPlants as plant, i (plant.id)}
								<WaterPlantCard {plant} compact index={i} />
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
									class="pop-in flex items-center justify-between gap-3 rounded-2xl bg-surface p-4 shadow"
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

		<!-- Floating water-all action, always within thumb reach -->
		{#if duePlants.length > 0}
			<div
				class="fixed right-3 left-3 z-50 md:right-10 md:left-10 xl:right-32 xl:left-32"
				style="bottom: calc(env(safe-area-inset-bottom) + 5.5rem);"
			>
				<HoldButton
					variant="water"
					size="lg"
					icon="droplets"
					label={$tStore('plants.waterAllPlants', [String(duePlants.length)])}
					disabled={watering.isWateringAny}
					onconfirm={() => watering.waterPlants(duePlants.map((p) => p.id))}
					class="shadow-xl"
				/>
			</div>
		{/if}
	{/if}
</PageContent>
