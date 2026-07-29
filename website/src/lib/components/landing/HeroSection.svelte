<script lang="ts">
	import { WEB_APP_URL } from '$lib';
	import Icon from '../ui/Icon.svelte';
	import MoodFace from '../ui/MoodFace.svelte';
	import { t } from '$lib/i18n.svelte';
</script>

<section class="relative overflow-hidden px-4 pt-16 pb-20 sm:px-6 sm:pt-24 lg:px-8">
	<!-- Brand glow behind everything -->
	<div
		aria-hidden="true"
		class="pointer-events-none absolute inset-x-0 top-0 h-[420px]"
		style="background: var(--glow);"
	></div>

	<div class="relative mx-auto max-w-6xl">
		<div class="grid items-center gap-12 lg:grid-cols-2">
			<div class="pop-in">
				<h1 class="text-5xl leading-tight font-bold text-ink sm:text-6xl lg:text-7xl">
					{$t('hero.title')}
				</h1>
				<p class="mt-6 max-w-xl text-lg text-ink-soft sm:text-xl">
					{$t('hero.subtitle')}
				</p>

				<div class="mt-8 flex flex-wrap gap-3">
					<a
						href="#download"
						class="inline-flex min-h-13 items-center gap-2.5 rounded-2xl bg-brand px-7 py-3.5 text-base font-semibold text-onbrand shadow-[0_4px_20px_rgba(0,238,87,0.45)] transition hover:bg-brand-dark hover:text-white active:scale-[0.97]"
					>
						<Icon name="download" size={19} />
						{$t('hero.cta_primary')}
					</a>
					<a
						href={WEB_APP_URL}
						target="_blank"
						rel="noopener noreferrer external"
						class="inline-flex min-h-13 items-center gap-2.5 rounded-2xl border-2 border-brand px-7 py-3.5 text-base font-semibold text-brand-dark transition hover:bg-brand/10 active:scale-[0.97] dark:text-brand"
					>
						<Icon name="globe" size={19} />
						{$t('hero.cta_secondary')}
					</a>
				</div>

				<div class="mt-10 flex items-center gap-3">
					<div class="flex text-warn" aria-hidden="true">
						{#each [0, 1, 2, 3, 4] as i (i)}
							<Icon name="star" size={20} class="fill-warn" />
						{/each}
					</div>
					<p class="font-semibold text-ink">{$t('hero.trust_badge')}</p>
				</div>
			</div>

			<!-- App preview mock: the plant mood card straight out of the app -->
			<div class="pop-in relative mx-auto w-full max-w-sm" style="animation-delay: 120ms">
				<div
					aria-hidden="true"
					class="absolute inset-x-0 top-6 h-full rounded-3xl bg-gradient-to-br from-brand to-brand-dark opacity-20 blur-2xl"
				></div>

				<div
					class="relative rotate-2 rounded-3xl bg-surface p-5 shadow-2xl transition-transform duration-500 hover:rotate-0"
				>
					<div class="flex items-center gap-4">
						<div
							class="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-brand-dark text-onbrand/90"
						>
							<Icon name="sprout" size={34} />
						</div>
						<div class="min-w-0 flex-1">
							<p class="truncate text-lg font-bold text-ink">{$t('hero.mock_plant_name')}</p>
							<p class="truncate text-sm text-ink-soft">{$t('hero.mock_plant_spot')}</p>
						</div>
						<MoodFace mood="happy" size={52} class="shrink-0 text-ok" />
					</div>

					<p class="mt-4 text-sm font-semibold text-ok">{$t('hero.mock_happy')}</p>

					<div class="mt-2 h-2.5 overflow-hidden rounded-full bg-ink/10">
						<div class="h-full w-1/3 rounded-full bg-brand"></div>
					</div>
					<div class="mt-2 flex justify-between text-xs text-ink-soft">
						<span>{$t('hero.mock_next')}</span><span>{$t('hero.mock_in_days')}</span>
					</div>

					<div
						class="mt-4 flex h-13 items-center justify-center gap-2 rounded-2xl bg-info font-semibold text-white shadow-[0_4px_14px_rgba(33,158,188,0.4)]"
					>
						<Icon name="droplet" size={19} />
						{$t('hero.mock_hold')}
					</div>
				</div>

				<!-- Floating accent chips -->
				<div class="absolute -top-4 -right-3 rotate-6 rounded-2xl bg-surface px-3.5 py-2 shadow-lg">
					<span class="flex items-center gap-1.5 text-xs font-semibold text-ok">
						<Icon name="check-circle" size={15} />
						{$t('hero.mock_watered')}
					</span>
				</div>
				<div
					class="absolute -bottom-5 -left-4 -rotate-3 rounded-2xl bg-surface px-3.5 py-2 shadow-lg"
				>
					<span class="flex items-center gap-1.5 text-xs font-semibold text-info">
						<Icon name="bell" size={15} />
						{$t('hero.mock_reminders')}
					</span>
				</div>
			</div>
		</div>
	</div>
</section>
