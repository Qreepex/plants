import type { Plant } from '$lib/types/api';
import { FertilizerType, SunlightRequirement, WateringMethod, WaterType } from '$lib/types/api';
import type { FormData } from '$lib/types/forms';
import { createEmptyFormData } from '$lib/types/forms';

export type EditSection =
	| 'basic'
	| 'location'
	| 'watering'
	| 'fertilizing'
	| 'humidity'
	| 'soil'
	| 'seasonality'
	| 'metadata';

/** Section catalogue for the manage hub and the edit page. */
export const PLANT_SECTIONS = [
	{ key: 'basic', emoji: '📋', label: 'plants.basicInformation' },
	{ key: 'photos', emoji: '📸', label: 'plants.photos' },
	{ key: 'location', emoji: '📍', label: 'plants.location' },
	{ key: 'watering', emoji: '💧', label: 'plants.wateringTitle' },
	{ key: 'fertilizing', emoji: '🍯', label: 'plants.fertilizingTitle' },
	{ key: 'humidity', emoji: '💨', label: 'plants.humidityTitle' },
	{ key: 'soil', emoji: '💩', label: 'plants.soilTitle' },
	{ key: 'seasonality', emoji: '❄️', label: 'plants.seasonalityTitle' },
	{ key: 'metadata', emoji: '🏷️', label: 'plants.metadata' }
] as const;

export const SECTION_TITLES: Record<EditSection, string> = {
	basic: 'plants.basicInformation',
	location: 'plants.location',
	watering: 'plants.wateringTitle',
	fertilizing: 'plants.fertilizingTitle',
	humidity: 'plants.humidityTitle',
	soil: 'plants.soilTitle',
	seasonality: 'plants.seasonalityTitle',
	metadata: 'plants.metadata'
};

/** Create form data pre-filled from an existing plant (edit flows). */
export function initializeFormData(plant: Plant): FormData {
	return {
		name: plant.name,
		species: plant.species,
		isToxic: plant.isToxic,
		sunlight: plant.sunlight as SunlightRequirement,
		preferedTemperature: plant.preferedTemperature,
		room: plant.location?.room ?? '',
		position: plant.location?.position ?? '',
		isOutdoors: plant.location?.isOutdoors ?? false,
		wateringIntervalDays: plant.watering?.intervalDays ?? 7,
		wateringMethod: plant.watering?.method ?? WateringMethod.Top,
		waterType: plant.watering?.waterType ?? WaterType.Tap,
		fertilizingType: plant.fertilizing?.type ?? FertilizerType.Liquid,
		fertilizingIntervalDays: plant.fertilizing?.intervalDays ?? 30,
		npkRatio: plant.fertilizing?.npkRatio ?? '10:10:10',
		concentrationPercent: plant.fertilizing?.concentrationPercent ?? 50,
		activeInWinter: plant.fertilizing?.activeInWinter ?? false,
		targetHumidity: plant.humidity?.targetHumidityPct ?? 50,
		requiresMisting: plant.humidity?.requiresMisting ?? false,
		mistingIntervalDays: plant.humidity?.mistingIntervalDays ?? 3,
		requiresHumidifier: plant.humidity?.requiresHumidifier ?? false,
		soilType: plant.soil?.type ?? 'Generic',
		repottingCycle: plant.soil?.repottingCycle ?? 2,
		soilComponents: plant.soil?.components ?? [],
		winterRestPeriod: plant.seasonality?.winterRestPeriod ?? false,
		winterWaterFactor: plant.seasonality?.winterWaterFactor ?? 0.5,
		minTempCelsius: plant.seasonality?.minTempCelsius ?? 15,
		flags: plant.flags ?? [],
		notes: plant.notes ?? []
	};
}

/** Patch payload for a single edit section (PATCH /api/plants/{id}). */
export function buildSectionPayload(
	section: EditSection,
	formData: FormData
): Record<string, unknown> {
	switch (section) {
		case 'basic':
			return { name: formData.name, species: formData.species };
		case 'location':
			return {
				sunlight: formData.sunlight,
				location: {
					room: formData.room,
					position: formData.position,
					isOutdoors: formData.isOutdoors
				}
			};
		case 'watering':
			return {
				watering: {
					intervalDays: formData.wateringIntervalDays,
					method: formData.wateringMethod,
					waterType: formData.waterType
				}
			};
		case 'fertilizing':
			return {
				fertilizing: {
					type: formData.fertilizingType,
					intervalDays: formData.fertilizingIntervalDays,
					npkRatio: formData.npkRatio,
					concentrationPercent: formData.concentrationPercent,
					activeInWinter: formData.activeInWinter
				}
			};
		case 'humidity':
			return {
				humidity: {
					targetHumidityPct: formData.targetHumidity,
					requiresMisting: formData.requiresMisting,
					mistingIntervalDays: formData.mistingIntervalDays,
					requiresHumidifier: formData.requiresHumidifier
				}
			};
		case 'soil':
			return {
				soil: {
					type: formData.soilType,
					repottingCycle: formData.repottingCycle,
					components: formData.soilComponents
				}
			};
		case 'seasonality':
			return {
				preferedTemperature: formData.preferedTemperature,
				seasonality: {
					winterRestPeriod: formData.winterRestPeriod,
					winterWaterFactor: formData.winterWaterFactor,
					minTempCelsius: formData.minTempCelsius
				}
			};
		case 'metadata':
			return {
				isToxic: formData.isToxic,
				flags: formData.flags,
				notes: formData.notes
			};
	}
}

function hasChanged<K extends keyof FormData>(
	formData: FormData,
	initial: FormData,
	key: K
): boolean {
	if (Array.isArray(formData[key]) && Array.isArray(initial[key])) {
		return JSON.stringify(formData[key]) !== JSON.stringify(initial[key]);
	}
	return formData[key] !== initial[key];
}

/**
 * Create payload containing only fields that differ from the empty defaults
 * (POST /api/plants). `initial` defaults to a fresh empty form.
 */
export function buildCreatePayload(
	formData: FormData,
	initial: FormData = createEmptyFormData()
): Record<string, unknown> {
	const now = new Date().toISOString();
	const payload: Record<string, unknown> = {
		name: formData.name.trim(),
		species: formData.species.trim()
	};

	if (hasChanged(formData, initial, 'isToxic')) payload.isToxic = formData.isToxic;
	if (hasChanged(formData, initial, 'sunlight')) payload.sunlight = formData.sunlight;
	if (hasChanged(formData, initial, 'preferedTemperature')) {
		payload.preferedTemperature = formData.preferedTemperature;
	}

	if (
		hasChanged(formData, initial, 'room') ||
		hasChanged(formData, initial, 'position') ||
		hasChanged(formData, initial, 'isOutdoors')
	) {
		payload.location = {
			room: formData.room.trim(),
			position: formData.position.trim(),
			isOutdoors: formData.isOutdoors
		};
	}

	if (
		hasChanged(formData, initial, 'wateringIntervalDays') ||
		hasChanged(formData, initial, 'wateringMethod') ||
		hasChanged(formData, initial, 'waterType')
	) {
		payload.watering = {
			intervalDays: formData.wateringIntervalDays,
			method: formData.wateringMethod,
			waterType: formData.waterType,
			lastWatered: now
		};
	}

	if (
		hasChanged(formData, initial, 'fertilizingType') ||
		hasChanged(formData, initial, 'fertilizingIntervalDays') ||
		hasChanged(formData, initial, 'npkRatio') ||
		hasChanged(formData, initial, 'concentrationPercent') ||
		hasChanged(formData, initial, 'activeInWinter')
	) {
		payload.fertilizing = {
			type: formData.fertilizingType,
			intervalDays: formData.fertilizingIntervalDays,
			npkRatio: formData.npkRatio.trim(),
			concentrationPercent: formData.concentrationPercent,
			activeInWinter: formData.activeInWinter,
			lastFertilized: now
		};
	}

	if (
		hasChanged(formData, initial, 'targetHumidity') ||
		hasChanged(formData, initial, 'requiresMisting') ||
		hasChanged(formData, initial, 'mistingIntervalDays') ||
		hasChanged(formData, initial, 'requiresHumidifier')
	) {
		payload.humidity = {
			targetHumidityPct: formData.targetHumidity,
			requiresMisting: formData.requiresMisting,
			mistingIntervalDays: formData.mistingIntervalDays,
			requiresHumidifier: formData.requiresHumidifier
		};
	}

	if (
		hasChanged(formData, initial, 'soilType') ||
		hasChanged(formData, initial, 'repottingCycle') ||
		hasChanged(formData, initial, 'soilComponents')
	) {
		payload.soil = {
			type: formData.soilType.trim(),
			repottingCycle: formData.repottingCycle,
			components: formData.soilComponents
		};
	}

	if (
		hasChanged(formData, initial, 'winterRestPeriod') ||
		hasChanged(formData, initial, 'winterWaterFactor') ||
		hasChanged(formData, initial, 'minTempCelsius')
	) {
		payload.seasonality = {
			winterRestPeriod: formData.winterRestPeriod,
			winterWaterFactor: formData.winterWaterFactor,
			minTempCelsius: formData.minTempCelsius
		};
	}

	if (hasChanged(formData, initial, 'flags')) payload.flags = formData.flags;
	if (hasChanged(formData, initial, 'notes')) payload.notes = formData.notes;

	return payload;
}

export function isFormDirty(current: FormData, original: FormData): boolean {
	return JSON.stringify(current) !== JSON.stringify(original);
}

/** Name + species are mandatory when creating or renaming a plant. */
export function isBasicInfoValid(formData: FormData): boolean {
	return formData.name.trim().length > 0 && formData.species.trim().length > 0;
}
