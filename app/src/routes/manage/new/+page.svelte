<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { fetchData } from '$lib/auth/fetch.svelte';
	import FormActionBar from '$lib/components/layout/FormActionBar.svelte';
	import PageContent from '$lib/components/layout/PageContent.svelte';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import BasicInformationForm from '$lib/components/plants/forms/BasicInformationForm.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import { tStore } from '$lib/i18n';
	import { getPlantsStore } from '$lib/stores/plants.svelte';
	import type { FormData } from '$lib/types/forms';
	import { createEmptyFormData } from '$lib/types/forms';
	import { invalidateApiCache } from '$lib/utils/cache';
	import { buildCreatePayload, isBasicInfoValid, isFormDirty } from '$lib/utils/plantForm';

	const plantsStore = getPlantsStore();
	const initialFormData = createEmptyFormData();
	let formData = $state<FormData>(createEmptyFormData());
	let submitting = $state(false);
	let error = $state<string | null>(null);

	const isDirty = $derived(isFormDirty(formData, initialFormData));

	async function savePlant(): Promise<void> {
		if (!isBasicInfoValid(formData)) {
			error = $tStore('plants.requiredNameSpecies');
			return;
		}

		submitting = true;
		error = null;

		try {
			const res = await fetchData('/api/plants', {
				method: 'post',
				body: buildCreatePayload(formData, initialFormData) as never
			});

			if (!res.ok) {
				throw new Error(res.error?.message || $tStore('plants.failedToCreatePlant'));
			}
			if (!res.data?.id) {
				throw new Error($tStore('plants.invalidResponse'));
			}

			plantsStore.setPlants([...plantsStore.plants, res.data]);
			await invalidateApiCache(['/api/plants', `/api/plants/${res.data.id}`], {
				waitForAck: true,
				timeoutMs: 100
			});

			await goto(resolve(`/manage/${res.data.id}/photos?createFlow=1`));
		} catch (err) {
			error = err instanceof Error ? err.message : $tStore('plants.failedToCreatePlant');
		} finally {
			submitting = false;
		}
	}
</script>

<PageHeader
	icon="🌱"
	title="plants.newPlant"
	description="plants.requiredInfoDescription"
	backHref={resolve('/')}
/>

<PageContent>
	{#if error}
		<div class="mx-2 mb-3">
			<Alert type="error" title="common.error" description={error} />
		</div>
	{/if}

	<!-- pb reserves space for the fixed FormActionBar -->
	<div class="min-h-0 flex-1 overflow-y-auto px-2 pb-48">
		<Card padded>
			<BasicInformationForm bind:formData />
		</Card>
	</div>

	<FormActionBar
		onCancel={() => goto(resolve('/'))}
		onSave={savePlant}
		saving={submitting}
		canSave={isDirty}
	/>
</PageContent>
