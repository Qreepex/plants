<script lang="ts">
	import { imageCacheStore } from '$lib/stores/imageCache.svelte';

	interface Props {
		photoId?: string;
		remoteUrl?: string;
		alt: string;
		/** Emoji shown when no image is available */
		fallback?: string;
		/** Classes applied to the <img> or fallback wrapper (sizing lives with the parent) */
		class?: string;
		fallbackClass?: string;
	}

	let {
		photoId,
		remoteUrl,
		alt,
		fallback = '🌿',
		class: className = '',
		fallbackClass = ''
	}: Props = $props();

	let url = $state<string | null>(null);

	$effect(() => {
		const id = photoId;
		if (!id) {
			url = null;
			return;
		}

		const cached = imageCacheStore.getImageURLSync(id);
		if (cached) {
			url = cached;
			return () => imageCacheStore.releaseImage(id);
		}

		let cancelled = false;
		imageCacheStore.getImageURL(id, remoteUrl).then((loaded) => {
			if (!cancelled) url = loaded;
		});

		return () => {
			cancelled = true;
			imageCacheStore.releaseImage(id);
		};
	});
</script>

{#if url}
	<img src={url} {alt} class={className} />
{:else}
	<div
		class="flex items-center justify-center bg-gradient-to-br from-brand to-brand-dark {className} {fallbackClass}"
		aria-hidden="true"
	>
		<span class="text-5xl">{fallback}</span>
	</div>
{/if}
