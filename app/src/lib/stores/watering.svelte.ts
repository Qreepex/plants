import { fetchData } from '$lib/auth/fetch.svelte';
import { invalidateApiCache } from '$lib/utils/cache';
import { t } from '$lib/i18n';
import { Haptics, NotificationType } from '@capacitor/haptics';
import { getPlantsStore } from './plants.svelte';

/**
 * Watering session state for the water page: tracks which plant is awaiting
 * confirmation and which plants are currently being watered (in-flight).
 */
export function createWateringStore() {
	const plantsStore = getPlantsStore();
	let selectedId = $state<string | null>(null);
	let inFlightIds = $state<string[]>([]);

	function haptic(type: NotificationType): void {
		Haptics.notification({ type }).catch(() => {
			/* haptics unavailable (web) */
		});
	}

	return {
		get selectedId() {
			return selectedId;
		},
		get inFlightIds() {
			return inFlightIds;
		},
		isWatering(id: string): boolean {
			return inFlightIds.includes(id);
		},
		/** Two-step confirm: first tap selects, second tap cancels selection. */
		toggleSelection(id: string): void {
			selectedId = selectedId === id ? null : id;
		},
		async waterPlant(id: string): Promise<void> {
			if (inFlightIds.includes(id)) return;
			inFlightIds = [...inFlightIds, id];
			plantsStore.setError(null);

			try {
				const response = await fetchData('/api/plants/water', {
					method: 'post',
					body: { plantIds: [id] }
				});

				if (!response.ok) {
					plantsStore.setError(response.error?.message || t('plants.failedToWaterPlant'));
					haptic(NotificationType.Error);
					return;
				}

				selectedId = null;
				await invalidateApiCache(['/api/plants'], { waitForAck: true, timeoutMs: 500 });
				await plantsStore.reloadSilently();
				haptic(NotificationType.Success);
			} catch (err) {
				plantsStore.setError(err instanceof Error ? err.message : t('plants.failedToWaterPlant'));
				haptic(NotificationType.Error);
			} finally {
				inFlightIds = inFlightIds.filter((pid) => pid !== id);
			}
		}
	};
}

let wateringStore: ReturnType<typeof createWateringStore> | null = null;

export function getWateringStore() {
	if (!wateringStore) {
		wateringStore = createWateringStore();
	}
	return wateringStore;
}
