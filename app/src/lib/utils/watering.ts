import type { Plant } from '$lib/types/api';
import { getDaysUntilWater } from './plant';

/**
 * Sort plants by watering priority (most urgent first)
 */
export function sortByWateringPriority(plants: Plant[]): Plant[] {
	return [...plants].sort((a, b) => getDaysUntilWater(a) - getDaysUntilWater(b));
}
