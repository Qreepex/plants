<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { tStore } from '$lib/i18n';
	import type { Plant } from '$lib/types/api';
	import { getWateringStatus } from '$lib/utils/plant';
	import { formatPastTimestamp } from '$lib/utils/timestamp.svelte';
	import Chip from '../ui/Chip.svelte';
	import { toneBg, toneText } from '../ui/tone';
	import PlantImage from './PlantImage.svelte';

	interface Props {
		plant: Plant;
	}

	const { plant }: Props = $props();

	const photoUrl = $derived((plant as { photoUrls?: string[] }).photoUrls?.[0]);
	const wateringStatus = $derived(getWateringStatus(plant));

	interface MetaTile {
		icon: string;
		text: string;
		tone: keyof typeof toneBg;
	}

	const metaTiles = $derived.by((): MetaTile[] => {
		const tiles: MetaTile[] = [];
		if (plant.watering?.intervalDays) {
			tiles.push({
				icon: '💧',
				text: `${$tStore('plants.every')} ${plant.watering.intervalDays} ${$tStore('plants.days')}`,
				tone: 'info'
			});
		}
		if (plant.fertilizing?.intervalDays) {
			tiles.push({
				icon: '🥗',
				text: `${$tStore('plants.every')} ${plant.fertilizing.intervalDays} ${$tStore('plants.days')}`,
				tone: 'warn'
			});
		}
		if (plant.sunlight) {
			tiles.push({
				icon: '☀️',
				text: $tStore('plants.sunlight.' + plant.sunlight),
				tone: 'brand'
			});
		}
		if (plant.humidity?.targetHumidityPct) {
			tiles.push({
				icon: '💨',
				text: `${plant.humidity.targetHumidityPct}%`,
				tone: 'info'
			});
		}
		return tiles;
	});

	function openPlant() {
		goto(resolve(`/plant/${plant.id}`));
	}

	function onKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			openPlant();
		}
	}
</script>

<div
	role="button"
	tabindex="0"
	onclick={openPlant}
	onkeydown={onKeydown}
	class="group cursor-pointer touch-manipulation overflow-hidden rounded-2xl bg-surface shadow transition-all duration-200 active:scale-[0.98] active:shadow-sm"
>
	<!-- Image -->
	<div class="relative h-40 overflow-hidden">
		<PlantImage
			photoId={plant.photoIds?.[0]}
			remoteUrl={photoUrl}
			alt={plant.name}
			class="h-full w-full object-cover transition-transform duration-300 group-active:scale-105"
			fallback="🌱"
		/>
	</div>

	<!-- Content -->
	<div class="p-3.5">
		<h3 class="line-clamp-1 text-base font-bold text-ink">{plant.name}</h3>
		<p class="mb-2 line-clamp-1 text-xs text-ok dark:text-[#2fd077]">{plant.species}</p>

		<!-- Watering Status -->
		{#if wateringStatus}
			<div class="mb-3">
				<div
					class="mb-1 flex items-center gap-1.5 text-xs font-semibold {toneText[
						wateringStatus.tone
					]}"
				>
					<span aria-hidden="true">{wateringStatus.emoji}</span>
					<span>{$tStore(wateringStatus.text, wateringStatus.args)}</span>
				</div>
				{#if plant.watering?.lastWatered}
					<p class="text-xs text-ink-soft">
						{$tStore('plants.lastWatered')}: {formatPastTimestamp(
							new Date(plant.watering.lastWatered)
						)}
					</p>
				{/if}
			</div>
		{/if}

		<!-- Metadata Grid -->
		{#if metaTiles.length > 0}
			<div class="grid grid-cols-2 gap-2">
				{#each metaTiles as tile (tile.icon + tile.text)}
					<div class="rounded-lg p-1.5 text-xs {toneBg[tile.tone]}">
						<span aria-hidden="true">{tile.icon}</span>
						<span class="ml-1 text-ink/80">{tile.text}</span>
					</div>
				{/each}
			</div>
		{/if}

		<!-- Misting Info -->
		{#if plant.humidity?.requiresMisting && plant.humidity?.mistingIntervalDays}
			<div class="mt-2 rounded-lg bg-info/15 p-2 text-xs text-ink/80">
				💦 {$tStore('plants.sprayEvery')}
				<span class="font-semibold text-info">{plant.humidity.mistingIntervalDays}</span>
				{$tStore('plants.days')}
				{#if plant.humidity.lastMisted}
					· {$tStore('plants.lastSprayedStatus')}:
					<span class="font-semibold">
						{formatPastTimestamp(new Date(plant.humidity.lastMisted))}
					</span>
				{/if}
			</div>
		{/if}

		<!-- Flags -->
		{#if plant.flags && plant.flags.length > 0}
			<div class="mt-2 flex flex-wrap gap-1.5">
				{#each plant.flags as flag (flag)}
					<Chip tone="warn" icon="⚡" text={flag} />
				{/each}
			</div>
		{/if}

		<!-- Notes Preview -->
		{#if plant.notes && plant.notes.length > 0}
			<div class="mt-2 border-t border-brand/15 pt-2">
				<p class="line-clamp-2 text-xs text-ink-soft">📝 {plant.notes[0]}</p>
			</div>
		{/if}
	</div>
</div>
