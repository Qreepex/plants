<script lang="ts">
	import Icon from '../ui/Icon.svelte';
	import type { IconName } from '../ui/icons';
	import { t } from '$lib/i18n.svelte';

	interface Feature {
		icon: IconName;
		tile: string;
		titleKey: string;
		descriptionKey: string;
	}

	const features: Feature[] = [
		{
			icon: 'droplet',
			tile: 'bg-info/15 text-info',
			titleKey: 'features.watering.title',
			descriptionKey: 'features.watering.description'
		},
		{
			icon: 'target',
			tile: 'bg-warn/20 text-amber-700 dark:text-amber-300',
			titleKey: 'features.multicare.title',
			descriptionKey: 'features.multicare.description'
		},
		{
			icon: 'camera',
			tile: 'bg-info/15 text-info',
			titleKey: 'features.growth.title',
			descriptionKey: 'features.growth.description'
		},
		{
			icon: 'chart',
			tile: 'bg-danger/15 text-danger',
			titleKey: 'features.history.title',
			descriptionKey: 'features.history.description'
		},
		{
			icon: 'bell',
			tile: 'bg-ok/15 text-ok',
			titleKey: 'features.notifications.title',
			descriptionKey: 'features.notifications.description'
		},
		{
			icon: 'globe',
			tile: 'bg-brand/15 text-brand-dark dark:text-brand',
			titleKey: 'features.multilang.title',
			descriptionKey: 'features.multilang.description'
		}
	];
</script>

<section id="features" class="relative px-4 py-20 sm:px-6 lg:px-8">
	<div class="mx-auto max-w-6xl">
		<div class="mb-14 text-center">
			<h2 class="text-4xl font-bold text-ink sm:text-5xl">
				{$t('features.section_title')}
			</h2>
			<p class="mt-4 text-xl text-ink-soft">{$t('features.section_subtitle')}</p>
		</div>

		<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each features as feature, i (feature.titleKey)}
				<div
					class="pop-in group rounded-3xl border border-ink/5 bg-surface p-7 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
					style="animation-delay: {i * 60}ms"
				>
					<div
						class="mb-4 flex h-13 w-13 items-center justify-center rounded-2xl {feature.tile} transition-transform duration-200 group-hover:scale-110"
					>
						<Icon name={feature.icon} size={26} />
					</div>
					<h3 class="mb-2 text-xl font-semibold text-ink">
						{$t(feature.titleKey)}
					</h3>
					<p class="text-ink-soft">{$t(feature.descriptionKey)}</p>
				</div>
			{/each}
		</div>
	</div>
</section>
