<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
		/** Responsive multi-column grid for wide screens */
		multi?: boolean;
		noPadding?: boolean;
		class?: string;
	}

	const { children, multi = false, noPadding = false, class: className = '' }: Props = $props();
</script>

<div
	class="grid grid-cols-1 gap-4 md:gap-6 {multi
		? 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'
		: ''} {noPadding ? '' : 'px-2'} {className}"
>
	{@render children()}
</div>
