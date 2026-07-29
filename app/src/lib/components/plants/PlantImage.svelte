<script lang="ts">
	import { imageCacheStore } from '$lib/stores/imageCache.svelte';
	import Icon from '../ui/Icon.svelte';
	import type { IconName } from '../ui/icons';

	interface Props {
		photoId?: string;
		remoteUrl?: string;
		alt: string;
		/** Icon shown when no image is available */
		fallback?: IconName;
		/** Classes applied to the <img> or the fallback tile (sizing lives with the parent) */
		class?: string;
		fallbackClass?: string;
	}

	let {
		photoId,
		remoteUrl,
		alt,
		fallback = 'leaf',
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
		class="flex items-center justify-center bg-gradient-to-br from-brand to-brand-dark text-onbrand/90 {className} {fallbackClass}"
		aria-hidden="true"
	>
		<Icon name={fallback} size={36} />
	</div>
{/if}
