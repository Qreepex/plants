<script lang="ts">
	import { resolve } from '$app/paths';
	import { languageStore, t, type Language } from '$lib/i18n.svelte';
	import Icon from './Icon.svelte';

	let open = $state(false);

	const languages: { code: Language; labelKey: string; short: string }[] = [
		{ code: 'en', labelKey: 'nav.languages.en', short: 'EN' },
		{ code: 'de', labelKey: 'nav.languages.de', short: 'DE' },
		{ code: 'es', labelKey: 'nav.languages.es', short: 'ES' }
	];

	function switchTo(lang: Language): void {
		open = false;
		languageStore.setLanguage(lang);
		window.location.href = resolve(`/${lang}`);
	}

	function onWindowClick(event: MouseEvent): void {
		if (open && !(event.target as HTMLElement).closest?.('[data-language-switcher]')) {
			open = false;
		}
	}
</script>

<svelte:window onclick={onWindowClick} />

<div class="relative" data-language-switcher>
	<button
		type="button"
		onclick={() => (open = !open)}
		aria-expanded={open}
		aria-haspopup="listbox"
		aria-label={$t('nav.select_language')}
		class="flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-ink/10 bg-surface px-4 py-2 text-sm font-semibold text-ink shadow-sm transition hover:border-brand/40 hover:shadow active:scale-95"
	>
		<Icon name="globe" size={17} />
		{$languageStore.toUpperCase()}
		<Icon
			name="chevron-down"
			size={15}
			class="transition-transform duration-200 {open ? 'rotate-180' : ''}"
		/>
	</button>

	{#if open}
		<div
			role="listbox"
			aria-label={$t('nav.select_language')}
			class="pop-in absolute right-0 z-50 mt-2 w-44 overflow-hidden rounded-2xl border border-ink/10 bg-surface p-1.5 shadow-xl"
		>
			{#each languages as lang (lang.code)}
				{@const active = $languageStore === lang.code}
				<button
					type="button"
					role="option"
					aria-selected={active}
					onclick={() => switchTo(lang.code)}
					class="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition {active
						? 'bg-brand/15 text-brand-dark dark:text-brand'
						: 'text-ink hover:bg-brand/10'}"
				>
					<span
						class="flex h-7 w-7 items-center justify-center rounded-full bg-brand/10 text-[11px] font-bold"
					>
						{lang.short}
					</span>
					<span class="flex-1">{$t(lang.labelKey)}</span>
					{#if active}
						<Icon name="check" size={15} />
					{/if}
				</button>
			{/each}
		</div>
	{/if}
</div>
