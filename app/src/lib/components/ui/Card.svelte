<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		/** Apply standard content padding (p-4 md:p-6) */
		padded?: boolean;
		class?: string;
		children: Snippet;
	}

	const { padded = false, class: className = '', children }: Props = $props();
</script>

<div
	class="overflow-hidden rounded-2xl border border-ink/5 bg-surface shadow-md {padded
		? 'p-4 md:p-6'
		: ''} {className}"
>
	{@render children()}
</div>
