<script lang="ts">
	import Icon from '../ui/Icon.svelte';
	import MoodFace from '../ui/MoodFace.svelte';
	import type { IconName } from '../ui/icons';
	import { t } from '$lib/i18n.svelte';

	interface ShowcaseCard {
		icon: IconName;
		mood: 'happy' | 'soon' | 'thirsty';
		titleKey: string;
		descriptionKey: string;
	}

	const cards: ShowcaseCard[] = [
		{
			icon: 'home',
			mood: 'happy',
			titleKey: 'screenshots.cards.home.title',
			descriptionKey: 'screenshots.cards.home.description'
		},
		{
			icon: 'droplet',
			mood: 'soon',
			titleKey: 'screenshots.cards.watering.title',
			descriptionKey: 'screenshots.cards.watering.description'
		},
		{
			icon: 'pencil',
			mood: 'thirsty',
			titleKey: 'screenshots.cards.management.title',
			descriptionKey: 'screenshots.cards.management.description'
		}
	];
</script>

<section class="px-4 py-20 sm:px-6 lg:px-8">
	<div class="mx-auto max-w-6xl">
		<h2 class="text-center text-4xl font-bold text-ink sm:text-5xl">
			{$t('screenshots.title')}
		</h2>
		<p class="mx-auto mt-4 max-w-2xl text-center text-lg text-ink-soft">
			{$t('screenshots.subtitle')}
		</p>

		<div class="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
			{#each cards as card, i (card.titleKey)}
				<div
					class="pop-in overflow-hidden rounded-3xl border border-ink/5 bg-surface shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
					style="animation-delay: {i * 80}ms"
				>
					<!-- Stylized preview window -->
					<div
						class="relative flex h-52 items-center justify-center bg-gradient-to-br from-brand/15 to-brand-dark/10"
					>
						<div class="absolute top-3 right-3 left-3 flex gap-1.5" aria-hidden="true">
							<span class="h-2 w-2 rounded-full bg-ink/15"></span>
							<span class="h-2 w-2 rounded-full bg-ink/15"></span>
							<span class="h-2 w-2 rounded-full bg-ink/15"></span>
						</div>
						<div
							class="flex h-24 w-24 items-center justify-center rounded-full bg-surface shadow-md"
						>
							<MoodFace mood={card.mood} size={72} class="text-ok" />
						</div>
						<span
							class="absolute bottom-3 flex items-center gap-1.5 rounded-full bg-surface px-3 py-1 text-xs font-semibold text-ink shadow-sm"
						>
							<Icon name={card.icon} size={13} />
							{$t(card.titleKey)}
						</span>
					</div>
					<div class="p-6">
						<h3 class="text-xl font-semibold text-ink">{$t(card.titleKey)}</h3>
						<p class="mt-2 text-ink-soft">{$t(card.descriptionKey)}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
