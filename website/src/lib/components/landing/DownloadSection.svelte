<script lang="ts">
	import Icon from '../ui/Icon.svelte';
	import { t } from '$lib/i18n.svelte';
</script>

<section id="download" class="px-4 py-20 sm:px-6 lg:px-8">
	<div class="mx-auto max-w-4xl">
		<div
			class="relative overflow-hidden rounded-3xl border border-brand/30 bg-surface p-10 text-center shadow-xl sm:p-12"
		>
			<!-- Brand glow inside the card -->
			<div
				aria-hidden="true"
				class="pointer-events-none absolute inset-x-0 top-0 h-64 rounded-b-full bg-gradient-to-b from-brand/15 to-transparent"
			></div>

			<div class="relative">
				<h2 class="text-4xl font-bold text-ink sm:text-5xl">{$t('download.title')}</h2>
				<p class="mx-auto mt-4 max-w-xl text-lg text-ink-soft">{$t('download.subtitle')}</p>

				<div class="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
					<a
						href="https://play.google.com/store/apps/details?id=app.waterme.app"
						target="_blank"
						rel="noopener noreferrer external"
						class="inline-flex min-h-13 items-center justify-center gap-2.5 rounded-2xl bg-ink px-7 py-3.5 font-semibold text-canvas transition hover:opacity-85 active:scale-[0.97]"
					>
						<Icon name="play" size={19} class="fill-current" />
						{$t('download.googleplay')}
					</a>
					<div
						class="inline-flex min-h-13 cursor-not-allowed items-center justify-center gap-2.5 rounded-2xl border-2 border-ink/15 px-7 py-3.5 font-semibold text-ink-soft"
					>
						<Icon name="apple" size={19} />
						{$t('download.appstore')}
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
