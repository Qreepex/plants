<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { IMPRINT_URL, PRIVACY_POLICY_URL, WEBSITE_URL } from '$lib/constants';
	import { tStore } from '$lib/i18n';
	import { openExternalLink } from '$lib/os/browser';
	import { languageStore, setLanguage } from '$lib/stores/language';
	import { getPlantsStore } from '$lib/stores/plants.svelte';
	import Card from '../ui/Card.svelte';
	import Icon from '../ui/Icon.svelte';
	import Button from '../ui/Button.svelte';
	import PageContent from './PageContent.svelte';
	import PageHeader from './PageHeader.svelte';

	interface Props {
		onClose?: () => void;
	}

	const { onClose }: Props = $props();
	const plantsStore = getPlantsStore();

	let refreshing = $state(false);

	const languages = [
		{ code: 'en', label: 'EN' },
		{ code: 'de', label: 'DE' },
		{ code: 'es', label: 'ES' }
	] as const;

	const resources = [
		{ icon: 'globe', label: 'menu.website', url: WEBSITE_URL },
		{ icon: 'lock', label: 'menu.privacyPolicy', url: PRIVACY_POLICY_URL },
		{ icon: 'info', label: 'menu.imprint', url: IMPRINT_URL }
	] as const;

	async function handleRefresh(): Promise<void> {
		refreshing = true;
		try {
			await plantsStore.refresh();
			onClose?.();
		} finally {
			refreshing = false;
		}
	}

	async function handleCreate(): Promise<void> {
		onClose?.();
		await goto(resolve('/manage/new'));
	}

	const version = '1.0.0';
</script>

<PageHeader icon="settings" title="menu.settings" />

<PageContent>
	<div class="min-h-0 flex-1 overflow-y-auto">
		<div class="space-y-4 px-2 py-4">
			<Card padded>
				<div class="space-y-2">
					<Button
						onclick={handleCreate}
						disabled={refreshing}
						class="w-full"
						icon="plus"
						text="plants.createPlant"
					/>
					<Button
						onclick={handleRefresh}
						disabled={refreshing}
						loading={refreshing}
						variant="ghost"
						class="w-full"
						icon="refresh-cw"
						text="common.refresh"
					/>
				</div>
			</Card>

			<Card padded>
				<p class="mb-3 text-sm font-semibold text-ink">{$tStore('common.language')}</p>
				<div class="flex gap-2" role="group" aria-label={$tStore('common.language')}>
					{#each languages as lang (lang.code)}
						<button
							type="button"
							aria-pressed={$languageStore === lang.code}
							onclick={() => setLanguage(lang.code)}
							class="min-h-11 flex-1 cursor-pointer rounded-xl text-sm font-medium transition {$languageStore ===
							lang.code
								? 'bg-brand text-onbrand shadow-[0_4px_14px_rgba(0,238,87,0.4)]'
								: 'bg-brand/10 text-brand-dark hover:bg-brand/20 dark:text-brand'}"
						>
							{lang.label}
						</button>
					{/each}
				</div>
			</Card>

			<Card>
				<p class="px-4 pt-4 pb-1 text-sm font-semibold text-ink md:px-6 md:pt-6">
					{$tStore('menu.resources')}
				</p>
				<div class="pb-2">
					{#each resources as item (item.url)}
						<button
							type="button"
							class="flex min-h-11 w-full cursor-pointer items-center gap-2 px-4 py-2.5 text-left text-sm text-brand-dark transition hover:bg-brand/5 md:px-6"
							onclick={() => openExternalLink(item.url)}
						>
							<Icon name={item.icon} size={18} />
							{$tStore(item.label)}
						</button>
					{/each}
				</div>
			</Card>

			<Card padded>
				<p class="mb-3 text-sm font-semibold text-ink">{$tStore('menu.about')}</p>
				<dl class="space-y-2 text-sm text-ink-soft">
					<div class="flex items-center justify-between">
						<dt>{$tStore('menu.version')}</dt>
						<dd class="font-medium text-ink">{version}</dd>
					</div>
					<div class="flex items-center justify-between">
						<dt>{$tStore('menu.build')}</dt>
						<dd class="font-medium text-ink">{new Date().toLocaleDateString()}</dd>
					</div>
				</dl>
			</Card>
		</div>
	</div>
</PageContent>
