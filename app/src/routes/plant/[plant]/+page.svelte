<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import PageContent from '$lib/components/layout/PageContent.svelte';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import Scrollable from '$lib/components/layout/Scrollable.svelte';
	import DetailPanel from '$lib/components/plants/DetailPanel.svelte';
	import PlantImage from '$lib/components/plants/PlantImage.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Chip from '$lib/components/ui/Chip.svelte';
	import Spinner from '$lib/components/ui/Spinner.svelte';
	import StatTile from '$lib/components/ui/StatTile.svelte';
	import { tStore } from '$lib/i18n';
	import { getPlantsStore } from '$lib/stores/plants.svelte';
	import type { Plant } from '$lib/types/api';
	import { formatPastTimestamp } from '$lib/utils/timestamp.svelte';

	const store = getPlantsStore();
	const plantId = $derived(page.params.plant ?? '');
	const plant = $derived(store.plants.find((p) => p.id === plantId || p.slug === plantId) ?? null);

	const photoUrls = $derived(
		(plant as unknown as { photoUrls?: string[] } | null)?.photoUrls ?? []
	);

	function formatDate(date?: string | null): string {
		if (!date) return '-';
		return new Date(date).toLocaleDateString();
	}

	function formatBool(value?: boolean): string {
		if (value === undefined || value === null) return '-';
		return value ? $tStore('common.yes') : $tStore('common.no');
	}

	function formatInterval(days?: number): string {
		return days ? `${$tStore('plants.every')} ${days} ${$tStore('plants.days')}` : '-';
	}

	function formatPast(date?: string | null): string {
		return date ? formatPastTimestamp(new Date(date)) : '-';
	}

	function editPlant(current: Plant) {
		goto(resolve(`/manage/${current.id}`));
	}
</script>

<PageHeader
	icon="🪴"
	title={plant?.name ?? 'plants.myPlants'}
	description={plant?.species}
	backHref={resolve('/')}
>
	{#if plant}
		<Button
			variant="primary"
			size="sm"
			text="common.edit"
			icon="✏️"
			onclick={() => editPlant(plant)}
		/>
	{/if}
</PageHeader>

<PageContent>
	{#if store.loading}
		<Spinner message="common.loadingPlantDetails" />
	{:else if !plant}
		<Alert type="error" title="common.error" description="plants.notFound" />
	{:else}
		{@const p = plant}
		<Scrollable noPadding>
			<div class="space-y-4 px-2">
				<!-- Hero -->
				<Card>
					<div class="grid gap-6 md:grid-cols-[minmax(0,320px)_1fr]">
						<PlantImage
							photoId={p.photoIds?.[0]}
							remoteUrl={photoUrls[0]}
							alt={p.name}
							fallback="🌿"
							class="h-64 w-full object-cover md:h-full"
							fallbackClass="text-7xl"
						/>
						<div class="p-4 md:p-6">
							<div class="flex flex-wrap items-center gap-2">
								{#if p.sunlight}
									<Chip tone="info" icon="☀️" text={$tStore('plants.sunlight.' + p.sunlight)} />
								{/if}
								{#if p.isToxic !== undefined}
									<Chip
										tone="warn"
										icon="☠️"
										text={p.isToxic ? $tStore('plants.toxic') : $tStore('plants.notToxic')}
									/>
								{/if}
								{#if p.location?.room}
									<Chip
										tone="brand"
										icon="📍"
										text={p.location.position
											? `${p.location.room} · ${p.location.position}`
											: p.location.room}
									/>
								{/if}
								{#if p.location?.isOutdoors !== undefined}
									<Chip
										tone="ok"
										text={p.location.isOutdoors
											? $tStore('plants.outdoors')
											: $tStore('plants.indoors')}
									/>
								{/if}
							</div>

							<div class="mt-5 grid grid-cols-2 gap-3">
								<StatTile
									tone="info"
									icon="💧"
									label={$tStore('plants.lastWatered')}
									value={formatPast(p.watering?.lastWatered)}
								/>
								<StatTile
									tone="warn"
									icon="🥗"
									label={$tStore('plants.lastFertilized')}
									value={formatPast(p.fertilizing?.lastFertilized)}
								/>
								<StatTile
									tone="brand"
									icon="🗓️"
									label={$tStore('plants.wateringFrequency')}
									value={formatInterval(p.watering?.intervalDays)}
								/>
								<StatTile
									tone="brand"
									icon="💨"
									label={$tStore('plants.sprayFrequency')}
									value={formatInterval(p.humidity?.mistingIntervalDays)}
								/>
							</div>
						</div>
					</div>
				</Card>

				<!-- Care details -->
				<Card padded>
					<h2 class="text-lg font-semibold text-ink">{$tStore('plants.careDetails')}</h2>
					<div class="mt-4 grid gap-4 md:grid-cols-2">
						<DetailPanel
							tone="info"
							titleKey="plants.wateringTitle"
							rows={[
								{ labelKey: 'plants.wateringMethod', value: p.watering?.method ?? '-' },
								{ labelKey: 'plants.waterType', value: p.watering?.waterType ?? '-' },
								{ labelKey: 'plants.lastWatered', value: formatDate(p.watering?.lastWatered) }
							]}
						/>
						{#if p.fertilizing}
							<DetailPanel
								tone="warn"
								titleKey="plants.fertilizingTitle"
								rows={[
									{ labelKey: 'plants.fertilizerType', value: p.fertilizing.type ?? '-' },
									{ labelKey: 'plants.npkRatio', value: p.fertilizing.npkRatio ?? '-' },
									{
										labelKey: 'plants.concentration',
										value: `${p.fertilizing.concentrationPercent ?? '-'}%`
									},
									{
										labelKey: 'plants.lastFertilized',
										value: formatDate(p.fertilizing.lastFertilized)
									}
								]}
							/>
						{/if}
						{#if p.humidity}
							<DetailPanel
								tone="info"
								titleKey="plants.humidityTitle"
								rows={[
									{
										labelKey: 'plants.targetHumidity',
										value: `${p.humidity.targetHumidityPct ?? '-'}%`
									},
									{
										labelKey: 'plants.mistingInterval',
										value: formatInterval(p.humidity.mistingIntervalDays)
									},
									{ labelKey: 'plants.lastMisted', value: formatDate(p.humidity.lastMisted) },
									{
										labelKey: 'plants.humidifier',
										value: formatBool(p.humidity.requiresHumidifier)
									}
								]}
							/>
						{/if}
						{#if p.soil}
							<DetailPanel
								tone="brand"
								titleKey="plants.soilTitle"
								rows={[
									{ labelKey: 'plants.soilType', value: p.soil.type ?? '-' },
									{
										labelKey: 'plants.repottingCycle',
										value: String(p.soil.repottingCycle ?? '-')
									},
									{ labelKey: 'plants.lastRepotted', value: formatDate(p.soil.lastRepotted) },
									...(p.soil.components?.length
										? [{ labelKey: 'plants.soilComponents', value: p.soil.components.join(', ') }]
										: [])
								]}
							/>
						{/if}
						{#if p.seasonality}
							<DetailPanel
								tone="warn"
								titleKey="plants.seasonalityTitle"
								rows={[
									{
										labelKey: 'plants.winterRest',
										value: formatBool(p.seasonality.winterRestPeriod)
									},
									{
										labelKey: 'plants.winterWaterFactor',
										value: String(p.seasonality.winterWaterFactor ?? '-')
									},
									{
										labelKey: 'plants.minTemp',
										value: `${p.seasonality.minTempCelsius ?? '-'}°C`
									}
								]}
							/>
						{/if}
					</div>
				</Card>

				<!-- Gallery -->
				<Card padded>
					<h2 class="text-lg font-semibold text-ink">{$tStore('plants.gallery')}</h2>
					{#if p.photoIds?.length}
						<div class="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
							{#each p.photoIds as photoId, i (photoId)}
								<PlantImage
									{photoId}
									remoteUrl={photoUrls[i]}
									alt={p.name}
									class="aspect-square w-full rounded-xl object-cover"
									fallbackClass="text-2xl"
								/>
							{/each}
						</div>
					{:else}
						<p class="mt-2 text-sm text-ink-soft">{$tStore('plants.noImages')}</p>
					{/if}
				</Card>

				{#if p.notes?.length}
					<Card padded>
						<h2 class="text-lg font-semibold text-ink">{$tStore('plants.notesTitle')}</h2>
						<ul class="mt-4 space-y-2 text-sm text-ink">
							{#each p.notes as note, idx (idx)}
								<li class="rounded-xl bg-canvas p-3">📝 {note}</li>
							{/each}
						</ul>
					</Card>
				{/if}

				{#if p.flags?.length}
					<Card padded>
						<h2 class="text-lg font-semibold text-ink">{$tStore('plants.flags')}</h2>
						<div class="mt-4 flex flex-wrap gap-2">
							{#each p.flags as flag (flag)}
								<Chip tone="warn" icon="⚡" text={flag} />
							{/each}
						</div>
					</Card>
				{/if}

				{#if p.pestHistory?.length}
					<Card padded>
						<h2 class="text-lg font-semibold text-ink">{$tStore('plants.pestHistory')}</h2>
						<div class="mt-4 space-y-3">
							{#each p.pestHistory as pest (pest.id)}
								<div class="rounded-xl bg-canvas p-4">
									<div class="flex items-center justify-between gap-2">
										<div class="font-semibold text-ink">{pest.pest}</div>
										<div class="text-xs text-ink-soft">{formatDate(pest.detectedAt)}</div>
									</div>
									<p class="mt-2 text-sm text-ink-soft">{pest.notes}</p>
								</div>
							{/each}
						</div>
					</Card>
				{/if}

				<!-- Growth history -->
				<Card padded>
					<h2 class="text-lg font-semibold text-ink">{$tStore('plants.growthHistory')}</h2>
					{#if p.growthHistory?.length}
						<div class="mt-4 space-y-3">
							{#each p.growthHistory as entry (entry.id)}
								<div class="rounded-xl bg-canvas p-4">
									<div class="flex flex-wrap items-center justify-between gap-2">
										<div class="text-sm font-semibold text-ink">{formatDate(entry.date)}</div>
										<div class="text-xs text-ink-soft">
											{$tStore('plants.health')}: {entry.health}
										</div>
									</div>
									<div class="mt-3 grid gap-3 md:grid-cols-[96px_1fr]">
										{#if entry.photoId}
											<PlantImage
												photoId={entry.photoId}
												alt={p.name}
												class="h-24 w-24 rounded-lg object-cover"
											/>
										{/if}
										<div class="text-sm text-ink">
											<div>{$tStore('plants.height')}: {entry.heightCm} cm</div>
											<div>{$tStore('plants.leafCount')}: {entry.leafCount}</div>
											{#if entry.condition}
												<div>{$tStore('plants.condition')}: {entry.condition}</div>
											{/if}
										</div>
									</div>
								</div>
							{/each}
						</div>
					{:else}
						<p class="mt-2 text-sm text-ink-soft">{$tStore('plants.noGrowthHistory')}</p>
					{/if}
				</Card>
			</div>
		</Scrollable>
	{/if}
</PageContent>
