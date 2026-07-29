import type { IconName } from '$lib/components/ui/icons';
import type { Tone } from '$lib/components/ui/tone';
import type { Plant } from '$lib/types/api';

export type SortOption =
	| 'name'
	| 'lastWatered'
	| 'lastFertilized'
	| 'wateringIntervalDays'
	| 'mistingIntervalDays'
	| 'nameAsc'
	| 'nameDesc'
	| 'lastWateredAsc'
	| 'lastWateredDesc'
	| 'speciesAsc'
	| 'speciesDesc';

/**
 * Get watering status for a plant
 */
export function getWateringStatus(
	plant: Plant
): { text: string; tone: Tone; icon: IconName; args?: string[] } | null {
	// Only show status if watering is configured
	if (!plant.watering?.intervalDays) return null;

	const last = plant.watering?.lastWatered
		? new Date(plant.watering.lastWatered).getTime()
		: Date.now();
	const interval = plant.watering?.intervalDays ?? 0;
	const days = Math.floor((Date.now() - last) / (1000 * 60 * 60 * 24));
	const daysUntilWater = interval - days;

	if (daysUntilWater <= -1) {
		return {
			text: 'plants.waterDaysOverdue',
			tone: 'danger',
			icon: 'alert-triangle',
			args: [String(Math.abs(daysUntilWater))]
		};
	}
	if (daysUntilWater === 0) {
		return { text: 'plants.dueTodayStatus', tone: 'danger', icon: 'droplet' };
	}
	if (daysUntilWater === 1) {
		return { text: 'plants.dueTomorrowStatus', tone: 'warn', icon: 'droplet' };
	}
	if (daysUntilWater > 1) {
		return {
			text: 'plants.waterInDays',
			tone: 'ok',
			icon: 'check-circle',
			args: [String(daysUntilWater)]
		};
	}
	return { text: 'plants.needsWaterStatus', tone: 'danger', icon: 'alert-triangle' };
}

/**
 * Sort plants by the given option
 */
export function sortPlants(plants: Plant[], sortBy: SortOption): Plant[] {
	const sorted = [...plants];
	switch (sortBy) {
		case 'name':
		case 'nameAsc':
			return sorted.sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''));
		case 'nameDesc':
			return sorted.sort((a, b) => (b.name ?? '').localeCompare(a.name ?? ''));
		case 'lastWatered':
		case 'lastWateredDesc':
			return sorted.sort((a, b) => {
				const aw = a.watering?.lastWatered ? new Date(a.watering.lastWatered).getTime() : 0;
				const bw = b.watering?.lastWatered ? new Date(b.watering.lastWatered).getTime() : 0;
				return bw - aw;
			});
		case 'lastWateredAsc':
			return sorted.sort((a, b) => {
				const aw = a.watering?.lastWatered ? new Date(a.watering.lastWatered).getTime() : 0;
				const bw = b.watering?.lastWatered ? new Date(b.watering.lastWatered).getTime() : 0;
				return aw - bw;
			});
		case 'speciesAsc':
			return sorted.sort((a, b) => (a.species ?? '').localeCompare(b.species ?? ''));
		case 'speciesDesc':
			return sorted.sort((a, b) => (b.species ?? '').localeCompare(a.species ?? ''));
		case 'lastFertilized':
			return sorted.sort((a, b) => {
				const af = a.fertilizing?.lastFertilized
					? new Date(a.fertilizing.lastFertilized).getTime()
					: 0;
				const bf = b.fertilizing?.lastFertilized
					? new Date(b.fertilizing.lastFertilized).getTime()
					: 0;
				return bf - af;
			});
		case 'wateringIntervalDays':
			return sorted.sort(
				(a, b) => (a.watering?.intervalDays ?? 999) - (b.watering?.intervalDays ?? 999)
			);
		case 'mistingIntervalDays':
			return sorted.sort(
				(a, b) =>
					(a.humidity?.mistingIntervalDays ?? 999) - (b.humidity?.mistingIntervalDays ?? 999)
			);
		default:
			return sorted;
	}
}

/**
 * Get days until water is needed
 */
export function getDaysUntilWater(plant: Plant): number {
	const lastWatered = plant.watering?.lastWatered
		? new Date(plant.watering.lastWatered).getTime()
		: 0;
	const interval = plant.watering?.intervalDays ?? 0;
	const daysSinceWatered = Math.floor((Date.now() - lastWatered) / (1000 * 60 * 60 * 24));
	return interval - daysSinceWatered;
}

/**
 * Thirst level as 0..1 progress (0 = just watered, 1 = overdue), for progress bars.
 */
export function getWateringProgress(plant: Plant): number {
	const interval = plant.watering?.intervalDays ?? 0;
	if (!interval) return 0;
	const daysSince = Math.max(0, interval - getDaysUntilWater(plant));
	return Math.min(1, daysSince / interval);
}

/**
 * Get watering status for water page
 */
export function getPlantWaterStatus(plant: Plant): 'overdue' | 'due-soon' | 'ok' {
	const daysUntil = getDaysUntilWater(plant);
	if (daysUntil <= 0) return 'overdue';
	if (daysUntil <= 1) return 'due-soon';
	return 'ok';
}

/**
 * Get status text for water page
 */
export function getPlantStatusText(plant: Plant): { key: string; args?: string[] } {
	const daysUntil = getDaysUntilWater(plant);
	if (daysUntil < 0)
		return { key: 'plants.statusDaysOverdue', args: [String(Math.abs(daysUntil))] };
	if (daysUntil === 0) return { key: 'plants.statusDueToday' };
	if (daysUntil === 1) return { key: 'plants.statusDueTomorrow' };
	return { key: 'plants.statusDueInDays', args: [String(daysUntil)] };
}

/**
 * Get status icon for water page
 */
export function getStatusVisual(status: 'overdue' | 'due-soon' | 'ok'): {
	icon: IconName;
	tone: Tone;
} {
	switch (status) {
		case 'overdue':
			return { icon: 'alert-triangle', tone: 'danger' };
		case 'due-soon':
			return { icon: 'alert-circle', tone: 'warn' };
		default:
			return { icon: 'check-circle', tone: 'ok' };
	}
}
