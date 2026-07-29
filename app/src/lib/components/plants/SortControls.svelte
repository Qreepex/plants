<script lang="ts">
	import { tStore } from '$lib/i18n';
	import type { SortOption } from '$lib/utils/plant';

	interface Props {
		sortBy?: SortOption;
		onSortChange?: (value: SortOption) => void;
		compact?: boolean;
		iconOnly?: boolean;
	}

	let { sortBy = 'nameAsc', onSortChange, compact = false, iconOnly = false }: Props = $props();

	const sortOptions: { value: SortOption; label: string }[] = [
		{ value: 'nameAsc', label: 'plants.sortOptions.nameAsc' },
		{ value: 'nameDesc', label: 'plants.sortOptions.nameDesc' },
		{ value: 'lastWateredAsc', label: 'plants.sortOptions.lastWateredAsc' },
		{ value: 'lastWateredDesc', label: 'plants.sortOptions.lastWateredDesc' },
		{ value: 'speciesAsc', label: 'plants.sortOptions.speciesAsc' },
		{ value: 'speciesDesc', label: 'plants.sortOptions.speciesDesc' }
	];

	function handleChange(e: Event) {
		const value = (e.currentTarget as HTMLSelectElement).value as SortOption;
		sortBy = value;
		onSortChange?.(value);
	}
</script>

{#if iconOnly}
	<div class="relative h-11 w-11 shrink-0">
		<div
			class="pointer-events-none absolute inset-0 flex items-center justify-center rounded-full border-2 border-brand bg-surface text-ink shadow-sm"
			aria-hidden="true"
		>
			<svg class="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M3 5h18M6 12h12m-9 7h6"
				/>
			</svg>
		</div>
		<select
			value={sortBy}
			onchange={handleChange}
			aria-label={$tStore('plants.sortBy')}
			class="absolute inset-0 h-full w-full cursor-pointer rounded-full opacity-0"
		>
			{#each sortOptions as option (option.value)}
				<option value={option.value}>{$tStore(option.label)}</option>
			{/each}
		</select>
	</div>
{:else}
	<select
		value={sortBy}
		onchange={handleChange}
		aria-label={$tStore('plants.sortBy')}
		class="cursor-pointer rounded-full border-2 border-brand bg-surface font-medium text-ink shadow-sm transition hover:border-brand-dark focus:border-brand focus:outline-none {compact
			? 'h-11 shrink-0 px-3 text-xs'
			: 'w-full px-4 py-3 sm:w-auto'}"
	>
		{#each sortOptions as option (option.value)}
			<option value={option.value}>{$tStore(option.label)}</option>
		{/each}
	</select>
{/if}
