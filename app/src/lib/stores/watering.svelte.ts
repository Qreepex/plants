import { fetchData } from '$lib/auth/fetch.svelte';
import { invalidateApiCache } from '$lib/utils/cache';
import { t } from '$lib/i18n';
import { Haptics, NotificationType } from '@capacitor/haptics';
import { getPlantsStore } from './plants.svelte';

/**
 * Watering session state for the water view / plant detail:
 * tracks which plants are currently being watered (in-flight).
 */
export function createWateringStore() {
	const plantsStore = getPlantsStore();
	let inFlightIds = $state<string[]>([]);

	function haptic(type: NotificationType): void {
		Haptics.notification({ type }).catch(() => {
			/* haptics unavailable (web) */
		});
	}

	async function water(ids: string[]): Promise<void> {
		const targets = ids.filter((id) => !inFlightIds.includes(id));
		if (targets.length === 0) return;
		inFlightIds = [...inFlightIds, ...targets];
		plantsStore.setError(null);

		try {
			const response = await fetchData('/api/plants/water', {
				method: 'post',
				body: { plantIds: targets }
			});

			if (!response.ok) {
				plantsStore.setError(response.error?.message || t('plants.failedToWaterPlant'));
				haptic(NotificationType.Error);
				return;
			}

			await invalidateApiCache(['/api/plants'], { waitForAck: true, timeoutMs: 500 });
			await plantsStore.reloadSilently();
			haptic(NotificationType.Success);
		} catch (err) {
			plantsStore.setError(err instanceof Error ? err.message : t('plants.failedToWaterPlant'));
			haptic(NotificationType.Error);
		} finally {
			inFlightIds = inFlightIds.filter((id) => !targets.includes(id));
		}
	}

	return {
		get inFlightIds() {
			return inFlightIds;
		},
		isWatering(id: string): boolean {
			return inFlightIds.includes(id);
		},
		get isWateringAny(): boolean {
			return inFlightIds.length > 0;
		},
		/** Water a single plant. */
		waterPlant: (id: string) => water([id]),
		/** Water multiple plants at once (e.g. "water all due"). */
		waterPlants: (ids: string[]) => water(ids)
	};
}

let wateringStore: ReturnType<typeof createWateringStore> | null = null;

export function getWateringStore() {
	if (!wateringStore) {
		wateringStore = createWateringStore();
	}
	return wateringStore;
}
