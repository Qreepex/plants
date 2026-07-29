<script lang="ts">
	import HoldButton from '$lib/components/ui/HoldButton.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import MoodFace from '$lib/components/ui/MoodFace.svelte';
	import { toneText } from '$lib/components/ui/tone';
	import { tStore } from '$lib/i18n';
	import { getWateringStore } from '$lib/stores/watering.svelte';
	import type { Plant } from '$lib/types/api';
	import {
		getPlantStatusText,
		getPlantWaterStatus,
		getStatusVisual,
		getWateringProgress
	} from '$lib/utils/plant';
	import PlantImage from './PlantImage.svelte';

	interface Props {
		plant: Plant;
		/** Compact styling for already-watered plants */
		compact?: boolean;
	}

	const { plant, compact = false }: Props = $props();
	const watering = getWateringStore();

	const status = $derived(getPlantWaterStatus(plant));
	const visual = $derived(getStatusVisual(status));
	const statusText = $derived(getPlantStatusText(plant));
	const progress = $derived(getWateringProgress(plant));
	const photoUrls = $derived((plant as { photoUrls?: string[] }).photoUrls ?? []);

	const moodFace = $derived(
		status === 'overdue' ? 'thirsty' : status === 'due-soon' ? 'soon' : 'happy'
	);

	const statusBorder = $derived(
		status === 'overdue'
			? 'border-danger/50'
			: status === 'due-soon'
				? 'border-warn/60'
				: 'border-ink/5'
	);

	const barClass = $derived(
		status === 'overdue' ? 'bg-danger' : status === 'due-soon' ? 'bg-warn' : 'bg-brand'
	);

	const isWatering = $derived(watering.isWatering(plant.id));
</script>

<div
	class="w-full overflow-hidden rounded-2xl border-2 bg-surface shadow-md transition {statusBorder}"
>
	<div class="flex items-center gap-3 p-3.5">
		<!-- Photo -->
		<PlantImage
			photoId={plant.photoIds?.[0]}
			remoteUrl={photoUrls[0]}
			alt={plant.name}
			class="{compact ? 'h-14 w-14' : 'h-18 w-18'} shrink-0 rounded-xl object-cover"
		/>

		<!-- Info -->
		<div class="min-w-0 flex-1">
			<h3 class="truncate text-base font-bold text-ink">{plant.name}</h3>
			<p class="truncate text-xs text-ink-soft italic">
				{plant.species}{#if plant.location?.room}&nbsp;· {plant.location.room}{/if}
			</p>
			<div class="mt-1 flex items-center gap-1.5 {toneText[visual.tone]}">
				<Icon name={visual.icon} size={14} />
				<span class="text-xs font-semibold">
					{$tStore(statusText.key, statusText.args)}
				</span>
			</div>
		</div>

		<!-- Mood face -->
		<MoodFace mood={moodFace} size={compact ? 40 : 48} class="{toneText[visual.tone]} shrink-0" />
	</div>

	<!-- Thirst progress -->
	<div class="mx-3.5 h-2 overflow-hidden rounded-full bg-ink/10" role="presentation">
		<div
			class="h-full rounded-full transition-all duration-500 {barClass}"
			style:width="{progress * 100}%"
		></div>
	</div>

	<!-- Big hold-to-water action -->
	<div class="p-3">
		<HoldButton
			variant={compact ? 'secondary' : 'water'}
			size="md"
			icon="droplet"
			label={isWatering ? $tStore('plants.watering') : $tStore('plants.holdToWater')}
			disabled={isWatering}
			onconfirm={() => watering.waterPlant(plant.id)}
		/>
	</div>
</div>
