<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Snippet } from 'svelte';
	import FooterSection from './FooterSection.svelte';
	import Icon from '../ui/Icon.svelte';

	interface Props {
		title: string;
		subtitle?: string;
		children: Snippet;
	}

	const { title, subtitle, children }: Props = $props();
</script>

<div class="min-h-screen bg-canvas">
	<nav class="sticky top-0 z-50 border-b border-brand/10 bg-canvas/80 backdrop-blur-md">
		<div class="mx-auto max-w-6xl px-4 py-3 sm:px-6 lg:px-8">
			<a href={resolve('/')} class="flex items-center gap-2.5 transition hover:opacity-80">
				<span
					class="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand text-onbrand shadow-[0_4px_14px_rgba(0,238,87,0.35)]"
				>
					<Icon name="sprout" size={22} />
				</span>
				<span class="text-xl font-bold text-ink sm:text-2xl">Water Me</span>
			</a>
		</div>
	</nav>

	<div class="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
		<h1 class="text-4xl font-bold text-ink sm:text-5xl">{title}</h1>
		{#if subtitle}
			<p class="mt-2 text-ink-soft">{subtitle}</p>
		{/if}

		<div class="prose-sm mt-10 max-w-none space-y-8 text-ink-soft">
			{@render children()}
		</div>
	</div>

	<FooterSection />
</div>
