<script lang="ts">
	import Can from '$lib/assets/Can.svg.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { tStore } from '$lib/i18n';
	import type { Plant } from '$lib/types/api';
	import { formatFutureTimestamp, formatPastTimestamp } from '$lib/utils/timestamp.svelte';
	import PlantImage from './PlantImage.svelte';

	interface Props {
		plant: Plant;
		status: 'overdue' | 'due-soon' | 'ok';
		statusTextKey: { key: string; args?: string[] };
		statusIcon: string;
		isWatering?: boolean;
		isSelected?: boolean;
		showNextWater?: boolean;
		nextWaterDate?: Date;
		onWater: (id: string) => void;
		onSelect: (id: string) => void;
	}

	const {
		plant,
		status,
		statusTextKey,
		statusIcon,
		isWatering = false,
		isSelected = false,
		showNextWater = false,
		nextWaterDate,
		onWater,
		onSelect
	}: Props = $props();

	const statusBorder: Record<typeof status, string> = {
		overdue: 'border-danger/60',
		'due-soon': 'border-warn/60',
		ok: 'border-ok/40'
	};

	function getLastWateredText(): string {
		const lastWatered = plant.watering?.lastWatered;
		if (!lastWatered) return $tStore('plants.needsWaterStatus');
		return `${$tStore('plants.lastWatered')}: ${formatPastTimestamp(new Date(lastWatered))}`;
	}

	function getNextWaterText(): string {
		if (!nextWaterDate) return $tStore('plants.noConfig');
		return `${$tStore('plants.nextWatering')}: ${formatFutureTimestamp(nextWaterDate)}`;
	}

	const photoUrl = $derived((plant as { photoUrls?: string[] }).photoUrls?.[0]);
</script>

<div
	class="w-full overflow-hidden rounded-2xl border-2 bg-surface shadow-md transition hover:shadow-lg {statusBorder[
		status
	]}"
>
	<div class="flex items-center gap-4 p-4">
		<!-- Photo -->
		<PlantImage
			photoId={plant.photoIds?.[0]}
			remoteUrl={photoUrl}
			alt={plant.name}
			class="h-16 w-16 shrink-0 rounded-lg object-cover"
			fallback="🌿"
		/>

		<!-- Plant Info -->
		<div class="min-w-0 flex-1 text-left">
			<h3 class="truncate text-lg font-bold text-ink">{plant.name}</h3>
			<p class="mb-1.5 truncate text-sm text-ink-soft italic">{plant.species}</p>

			<div class="flex items-center gap-2">
				<span aria-hidden="true">{statusIcon}</span>
				<span class="text-xs font-medium text-ink">
					{$tStore(statusTextKey.key, statusTextKey.args)}
				</span>
			</div>

			{#if status !== 'overdue' && status !== 'due-soon'}
				<p class="mt-1 text-xs text-ink-soft">
					{showNextWater ? getNextWaterText() : getLastWateredText()}
				</p>
			{/if}

			{#if plant.location?.room}
				<p class="mt-1 truncate text-xs text-ink-soft">📍 {plant.location.room}</p>
			{/if}
		</div>
	</div>

	<!-- Two-Step Action Area -->
	<div class="px-3 pb-3">
		{#if !isSelected}
			<Button
				variant="water"
				onclick={() => onSelect(plant.id)}
				iconComponent={Can}
				text="plants.readyToWater"
				class="w-full"
			/>
		{:else}
			<div class="flex gap-2">
				<Button
					variant="danger"
					onclick={() => onSelect(plant.id)}
					text="plants.cancel"
					class="flex-1"
				/>
				<Button
					variant="water"
					onclick={() => onWater(plant.id)}
					disabled={isWatering}
					loading={isWatering}
					loadingText="plants.watering"
					iconComponent={Can}
					text="plants.confirm"
					class="flex-1"
				/>
			</div>
		{/if}
	</div>
</div>
