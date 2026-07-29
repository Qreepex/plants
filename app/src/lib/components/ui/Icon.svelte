<script lang="ts">
	import { iconPaths, type IconName } from './icons';

	interface Props {
		name: IconName;
		size?: number | string;
		class?: string;
		strokeWidth?: number;
	}

	const { name, size = 20, class: className = '', strokeWidth = 2 }: Props = $props();
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	width={size}
	height={size}
	viewBox="0 0 24 24"
	fill="none"
	stroke="currentColor"
	stroke-width={strokeWidth}
	stroke-linecap="round"
	stroke-linejoin="round"
	class={className}
	aria-hidden="true"
>
	<!-- Icon paths are static trusted strings from our own registry, never user input -->
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html iconPaths[name]}
</svg>
