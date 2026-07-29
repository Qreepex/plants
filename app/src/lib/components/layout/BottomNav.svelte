<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import Burger from '$lib/assets/Burger.svg.svelte';
	import Can from '$lib/assets/Can.svg.svelte';
	import SunFlower from '$lib/assets/SunFlower.svg.svelte';
	import { tStore } from '$lib/i18n';
	import AppMenu from './AppMenu.svelte';

	let menuOpen = $state(false);

	function isActive(path: '/' | '/water'): boolean {
		return page.url.pathname === resolve(path) || page.url.pathname.startsWith(resolve(path) + '/');
	}

	function navigate(path: '/' | '/water'): void {
		menuOpen = false;
		goto(resolve(path));
	}
</script>

<!-- Bottom Navigation Bar -->
<nav
	class="fixed right-0 bottom-0 left-0 z-40 border-t border-brand/15 bg-surface/95 shadow-lg backdrop-blur"
>
	<div class="pb-safe flex h-20 items-stretch justify-around">
		<button
			onclick={() => navigate('/')}
			class="flex flex-1 cursor-pointer flex-col items-center justify-center gap-1 py-2 transition-colors {!menuOpen &&
			isActive('/')
				? 'text-brand-dark'
				: 'text-ink-soft'}"
			aria-label={$tStore('menu.garden')}
		>
			<SunFlower isActive={!menuOpen && isActive('/')} />
			<span class="text-xs font-medium">{$tStore('menu.garden')}</span>
		</button>

		<button
			onclick={() => navigate('/water')}
			class="flex flex-1 cursor-pointer flex-col items-center justify-center gap-1 py-2 transition-colors {!menuOpen &&
			isActive('/water')
				? 'text-brand-dark'
				: 'text-ink-soft'}"
			aria-label={$tStore('menu.water')}
		>
			<Can isActive={!menuOpen && isActive('/water')} />
			<span class="text-xs font-medium">{$tStore('menu.water')}</span>
		</button>

		<button
			onclick={() => (menuOpen = !menuOpen)}
			class="flex flex-1 cursor-pointer flex-col items-center justify-center gap-1 py-2 transition-colors {menuOpen
				? 'text-brand-dark'
				: 'text-ink-soft'}"
			aria-label={$tStore('menu.menu')}
		>
			<Burger isActive={menuOpen} />
			<span class="text-xs font-medium">{$tStore('menu.menu')}</span>
		</button>
	</div>
</nav>

<!-- Menu Overlay -->
{#if menuOpen}
	<div class="pt-safe fixed inset-0 bottom-20 z-50 bg-canvas">
		<div class="flex h-full flex-col overflow-hidden px-2 pt-2 md:px-10 md:pt-10 xl:px-32 xl:pt-14">
			<AppMenu onClose={() => (menuOpen = false)} />
		</div>
	</div>
{/if}

<style>
	.pt-safe {
		padding-top: env(safe-area-inset-top);
	}

	.pb-safe {
		padding-bottom: env(safe-area-inset-bottom);
	}
</style>
