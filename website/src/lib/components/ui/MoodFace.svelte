<script lang="ts">
	type PlantMood = 'happy' | 'soon' | 'thirsty';

	interface Props {
		mood: PlantMood;
		size?: number;
		class?: string;
	}

	const { mood, size = 64, class: className = '' }: Props = $props();
</script>

<svg
	viewBox="0 0 64 64"
	width={size}
	height={size}
	class={className}
	fill="none"
	stroke="currentColor"
	stroke-width="3.5"
	stroke-linecap="round"
	aria-hidden="true"
>
	<!-- Leaf sprout on top -->
	<path
		d="M32 10c-2.5-4-7-5-10-4.5C23 10 27 12 32 12c0-4 1-8 4-10 2 3 2 7-1 10"
		fill="currentColor"
		stroke="none"
		opacity="0.9"
	/>

	<!-- Face -->
	<circle cx="32" cy="36" r="24" fill="currentColor" opacity="0.12" stroke="currentColor" />

	{#if mood === 'happy'}
		<path d="M20 32c1.5-2.5 4-2.5 5.5 0" />
		<path d="M38.5 32c1.5-2.5 4-2.5 5.5 0" />
		<path d="M23 41c2.5 4 15.5 4 18 0" />
	{:else if mood === 'soon'}
		<circle cx="23" cy="32" r="1.8" fill="currentColor" stroke="none" />
		<circle cx="41" cy="32" r="1.8" fill="currentColor" stroke="none" />
		<path d="M25 43c2-1.6 4 1.6 6 0s4 1.6 6 0" />
	{:else}
		<path d="M20 30c1.5 2.5 4 2.5 5.5 0" />
		<path d="M38.5 30c1.5 2.5 4 2.5 5.5 0" />
		<path d="M25 45c2.5-3 11.5-3 14 0" />
		<path
			d="M52 12c1.5 2.5 3 4 3 5.5a3 3 0 0 1-6 0c0-1.5 1.5-3 3-5.5z"
			fill="currentColor"
			stroke="none"
			opacity="0.8"
		/>
	{/if}
</svg>
