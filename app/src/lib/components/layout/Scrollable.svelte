<script lang="ts">
	import type { Snippet } from 'svelte';
	import List from './List.svelte';

	interface Props {
		children: Snippet;
		/** Responsive multi-column grid for wide screens */
		multi?: boolean;
		noPadding?: boolean;
	}

	const { children, multi = false, noPadding = false }: Props = $props();

	let isScrolled = $state(false);
	let scrollContainer: HTMLDivElement | undefined = $state();

	function handleScroll() {
		isScrolled = (scrollContainer?.scrollTop ?? 0) > 4;
	}
</script>

<div class="relative flex min-h-0 flex-1 flex-col">
	<!-- Top fade (appears once scrolled, blends content into the page background) -->
	<div
		class="pointer-events-none absolute top-0 right-0 left-0 z-10 h-4 bg-gradient-to-b from-canvas via-canvas/40 to-transparent transition-opacity duration-150 {isScrolled
			? 'opacity-100'
			: 'opacity-0'}"
	></div>

	<div
		bind:this={scrollContainer}
		onscroll={handleScroll}
		class="relative min-h-0 flex-1 overflow-y-auto overscroll-y-contain"
	>
		<List {multi} {noPadding}>
			{@render children()}
		</List>

		<!-- Bottom fade blending into the page background -->
		<div
			class="pointer-events-none sticky right-0 bottom-0 left-0 z-10 -mt-4 h-4 bg-gradient-to-b from-transparent via-canvas/40 to-canvas"
		></div>
	</div>
</div>
