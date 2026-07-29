<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { fetchData } from '$lib/auth/fetch.svelte';
	import FormActionBar from '$lib/components/layout/FormActionBar.svelte';
	import PageContent from '$lib/components/layout/PageContent.svelte';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import BasicInformationForm from '$lib/components/plants/forms/BasicInformationForm.svelte';
	import FertilizingForm from '$lib/components/plants/forms/FertilizingForm.svelte';
	import LocationForm from '$lib/components/plants/forms/LocationForm.svelte';
	import MetadataForm from '$lib/components/plants/forms/MetadataForm.svelte';
	import MistingForm from '$lib/components/plants/forms/MistingForm.svelte';
	import SeasonalityForm from '$lib/components/plants/forms/SeasonalityForm.svelte';
	import SoilForm from '$lib/components/plants/forms/SoilForm.svelte';
	import WateringForm from '$lib/components/plants/forms/WateringForm.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Spinner from '$lib/components/ui/Spinner.svelte';
	import { tStore } from '$lib/i18n';
	import type { Plant } from '$lib/types/api';
	import type { FormData } from '$lib/types/forms';
	import { createEmptyFormData } from '$lib/types/forms';
	import { invalidateApiCache } from '$lib/utils/cache';
	import {
		SECTION_TITLES,
		buildSectionPayload,
		initializeFormData,
		isBasicInfoValid,
		isFormDirty,
		type EditSection
	} from '$lib/utils/plantForm';

	let plant = $state<Plant | null>(null);
	let loading = $state(true);
	let saving = $state(false);
	let error = $state<string | null>(null);
	let formData = $state<FormData>(createEmptyFormData());
	let originalFormData = $state<FormData>(createEmptyFormData());

	const section = $derived((page.params.section ?? 'basic') as EditSection);
	const isCreateFlow = $derived(page.url.searchParams.get('createFlow') === '1');
	const isDirty = $derived(isFormDirty(formData, originalFormData));

	onMount(async () => {
		try {
			const plantId = page.params.plant ?? '';
			const res = await fetchData('/api/plants/{id}', {
				params: { id: plantId }
			});

			if (!res.ok) {
				error = res.error?.message || $tStore('plants.failedToFetchPlants');
				return;
			}

			plant = res.data;
			formData = initializeFormData(res.data);
			originalFormData = JSON.parse(JSON.stringify(formData));
		} catch (err) {
			error = err instanceof Error ? err.message : $tStore('plants.failedToFetchPlants');
		} finally {
			loading = false;
		}
	});

	async function saveSection(): Promise<void> {
		if (!plant) return;
		if (section === 'basic' && !isBasicInfoValid(formData)) {
			error = $tStore('plants.requiredNameSpecies');
			return;
		}

		error = null;
		saving = true;
		try {
			const res = await fetchData('/api/plants/{id}', {
				method: 'patch',
				params: { id: plant.id },
				body: buildSectionPayload(section, formData)
			});

			if (!res.ok) {
				throw new Error(res.error?.message || $tStore('plants.failedToUpdatePlant'));
			}

			await invalidateApiCache(['/api/plants', `/api/plants/${plant.id}`], {
				waitForAck: true,
				timeoutMs: 100
			});

			backToHub();
		} catch (err) {
			error = err instanceof Error ? err.message : $tStore('plants.failedToUpdatePlant');
		} finally {
			saving = false;
		}
	}

	function backToHub(): void {
		if (!plant) return;
		goto(resolve(`/manage/${plant.id}${isCreateFlow ? '?createFlow=1' : ''}`));
	}
</script>

<PageHeader
	icon="✏️"
	title={SECTION_TITLES[section]}
	description={plant?.name || ''}
	backHref={plant
		? resolve(`/manage/${plant.id}${isCreateFlow ? '?createFlow=1' : ''}`)
		: undefined}
/>

<PageContent>
	{#if loading}
		<Spinner message="common.loadingPlantDetails" />
	{:else if !plant}
		<Alert
			type="error"
			title="common.error"
			description={error || $tStore('common.plantNotFound')}
		/>
	{:else}
		{#if error}
			<div class="mx-2 mb-3">
				<Alert type="error" title="common.error" description={error} />
			</div>
		{/if}

		<!-- pb reserves space for the fixed FormActionBar -->
		<div class="min-h-0 flex-1 overflow-y-auto px-2 pb-48">
			<Card padded>
				{#if section === 'basic'}
					<BasicInformationForm bind:formData />
				{:else if section === 'location'}
					<LocationForm bind:formData />
				{:else if section === 'watering'}
					<WateringForm bind:formData />
				{:else if section === 'fertilizing'}
					<FertilizingForm bind:formData />
				{:else if section === 'humidity'}
					<MistingForm bind:formData />
				{:else if section === 'soil'}
					<SoilForm bind:formData />
				{:else if section === 'seasonality'}
					<SeasonalityForm bind:formData />
				{:else if section === 'metadata'}
					<MetadataForm bind:formData />
				{/if}
			</Card>
		</div>

		<FormActionBar
			onCancel={backToHub}
			onSave={saveSection}
			{saving}
			canSave={isDirty}
			cancelText={isCreateFlow ? 'common.skip' : 'common.close'}
		/>
	{/if}
</PageContent>
