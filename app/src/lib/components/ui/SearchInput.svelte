<script lang="ts">
	import { tStore } from '$lib/i18n';

	interface Props {
		value?: string;
		/** i18n key for placeholder + aria-label */
		label?: string;
	}

	let { value = $bindable(''), label = 'plants.searchPlants' }: Props = $props();

	function clear() {
		value = '';
	}
</script>

<div class="relative flex-1">
	<input
		type="search"
		bind:value
		placeholder={$tStore(label)}
		aria-label={$tStore(label)}
		class="h-11 w-full rounded-full border border-brand/30 bg-surface pr-11 pl-10 text-[0.95rem] text-ink shadow-sm transition placeholder:text-ink/40 focus:border-brand/60 focus:ring-2 focus:ring-brand/20 focus:outline-none"
	/>
	<svg
		class="absolute top-1/2 left-3 h-4.5 w-4.5 -translate-y-1/2 text-brand-dark/50"
		fill="none"
		stroke="currentColor"
		viewBox="0 0 24 24"
		aria-hidden="true"
	>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
		/>
	</svg>
	{#if value}
		<button
			type="button"
			onclick={clear}
			class="absolute top-1/2 right-1.5 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-ink/60 transition hover:bg-brand/10 hover:text-brand-dark"
			aria-label="Clear search"
		>
			<svg viewBox="0 0 20 20" class="h-4 w-4" fill="currentColor" aria-hidden="true">
				<path
					d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
				/>
			</svg>
		</button>
	{/if}
</div>
