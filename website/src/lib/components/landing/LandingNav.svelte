<script lang="ts">
	import { resolve } from '$app/paths';
	import { t } from '$lib/i18n.svelte';
	import { WEB_APP_URL } from '$lib';
	import Icon from '../ui/Icon.svelte';
	import LanguageSwitcher from '../ui/LanguageSwitcher.svelte';
</script>

<nav
	class="sticky top-0 z-50 border-b border-brand/10 bg-canvas/80 backdrop-blur-md backdrop-saturate-150"
>
	<div class="mx-auto max-w-6xl px-4 py-3 sm:px-6 lg:px-8">
		<div class="flex items-center justify-between gap-3">
			<a href={resolve('/')} class="flex min-w-0 items-center gap-2.5 transition hover:opacity-80">
				<span
					class="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand text-onbrand shadow-[0_4px_14px_rgba(0,238,87,0.35)]"
				>
					<Icon name="sprout" size={22} />
				</span>
				<span class="truncate text-xl font-bold text-ink sm:text-2xl">Water Me</span>
			</a>

			<div class="flex shrink-0 items-center gap-2 sm:gap-4">
				<div class="hidden gap-6 md:flex">
					<a
						href="#features"
						class="text-ink-soft transition hover:text-brand-dark dark:hover:text-brand"
					>
						{$t('nav.features')}
					</a>
					<a
						href="#stats"
						class="text-ink-soft transition hover:text-brand-dark dark:hover:text-brand"
					>
						{$t('nav.stats')}
					</a>
					<a
						href="#download"
						class="text-ink-soft transition hover:text-brand-dark dark:hover:text-brand"
					>
						{$t('nav.download')}
					</a>
				</div>

				<a
					href={WEB_APP_URL}
					target="_blank"
					rel="noopener noreferrer external"
					class="hidden min-h-11 items-center gap-2 rounded-full bg-brand px-5 py-2 text-sm font-semibold text-onbrand shadow-[0_4px_14px_rgba(0,238,87,0.35)] transition hover:bg-brand-dark hover:text-white active:scale-95 sm:inline-flex"
				>
					{$t('nav.open_app')}
				</a>

				<LanguageSwitcher />
			</div>
		</div>
	</div>
</nav>
