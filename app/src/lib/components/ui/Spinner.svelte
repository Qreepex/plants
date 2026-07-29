<script lang="ts">
	import { tStore } from '$lib/i18n';
	import Icon from './Icon.svelte';

	interface Props {
		/** Full-screen branded loading screen (auth bootstrap, app start) */
		fullscreen?: boolean;
		/** i18n key for the loading message */
		message?: string;
	}

	const { fullscreen = false, message = 'common.loading' }: Props = $props();
</script>

{#if fullscreen}
	<div class="flex h-full items-center justify-center bg-canvas">
		<div class="flex flex-col items-center gap-6">
			<div class="relative h-24 w-24">
				<svg
					viewBox="0 0 100 100"
					xmlns="http://www.w3.org/2000/svg"
					class="h-full w-full animate-pulse"
					aria-hidden="true"
				>
					<path
						d="M 25 60 L 30 90 L 70 90 L 75 60 Z"
						fill="#D2691E"
						stroke="#8B4513"
						stroke-width="1.5"
					/>
					<ellipse
						cx="50"
						cy="60"
						rx="25"
						ry="6"
						fill="#CD853F"
						stroke="#8B4513"
						stroke-width="1.5"
					/>
					<ellipse cx="50" cy="62" rx="22" ry="4" fill="#A0643F" />
					<path
						d="M 50 55 Q 35 45 30 25 Q 28 15 35 20 Q 45 32 50 45"
						fill="none"
						stroke="#22C55E"
						stroke-width="3"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="origin-bottom animate-bounce"
						style="animation-delay: 0s; animation-duration: 2s"
					/>
					<path
						d="M 50 55 Q 65 45 70 25 Q 72 15 65 20 Q 55 32 50 45"
						fill="none"
						stroke="#16A34A"
						stroke-width="3"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="origin-bottom animate-bounce"
						style="animation-delay: 0.3s; animation-duration: 2s"
					/>
					<path
						d="M 50 55 Q 50 40 50 15"
						fill="none"
						stroke="#22C55E"
						stroke-width="3"
						stroke-linecap="round"
						class="origin-bottom animate-bounce"
						style="animation-delay: 0.6s; animation-duration: 2s"
					/>
				</svg>
				<div
					class="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-brand border-r-brand-dark"
					style="animation-duration: 3s"
					aria-hidden="true"
				></div>
			</div>
			<p class="text-lg font-semibold text-ink-soft">{$tStore(message)}</p>
		</div>
	</div>
{:else}
	<div class="flex min-h-64 items-center justify-center" role="status">
		<div class="text-center">
			<div
				class="mb-3 inline-block animate-bounce text-brand-dark dark:text-brand"
				aria-hidden="true"
			>
				<Icon name="sprout" size={40} />
			</div>
			<p class="text-base text-ink-soft">{$tStore(message)}</p>
		</div>
	</div>
{/if}
