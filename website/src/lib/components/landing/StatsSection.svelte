<script lang="ts">
	import { API_BASE_URL } from '$lib';
	import { onMount } from 'svelte';
	import Icon from '../ui/Icon.svelte';
	import type { IconName } from '../ui/icons';
	import { t } from '$lib/i18n.svelte';

	let displayStats = $state({ users: 0, plants: 0, reminders: 0 });
	let targetStats = $state({ users: 0, plants: 0, reminders: 0 });
	let hasAnimated = false;
	let statsReady = $state(false);

	const statCards = $derived.by(
		(): { icon: IconName; value: number; suffix: string; labelKey: string }[] => [
			{ icon: 'sprout', value: displayStats.users, suffix: '', labelKey: 'stats.users' },
			{ icon: 'leaf', value: displayStats.plants, suffix: '', labelKey: 'stats.plants' },
			{ icon: 'bell', value: displayStats.reminders, suffix: '+', labelKey: 'stats.reminders' }
		]
	);

	onMount(async () => {
		try {
			const response = await fetch(`${API_BASE_URL}/stats`);
			if (!response.ok) return;
			const data = await response.json();
			if (typeof data?.users !== 'number' || typeof data?.plants !== 'number') return;
			targetStats = {
				users: data.users,
				plants: data.plants,
				reminders: typeof data?.reminders === 'number' ? data.reminders : 0
			};
			statsReady = true;
		} catch {
			return;
		}
	});

	$effect(() => {
		if (!statsReady || hasAnimated) return;
		hasAnimated = true;

		const duration = 1600;
		const startTime = performance.now();

		const animate = () => {
			const progress = Math.min((performance.now() - startTime) / duration, 1);
			const eased = 1 - Math.pow(1 - progress, 3);

			displayStats = {
				users: Math.floor(targetStats.users * eased),
				plants: Math.floor(targetStats.plants * eased),
				reminders: Math.floor(targetStats.reminders * eased)
			};

			if (progress < 1) requestAnimationFrame(animate);
		};

		requestAnimationFrame(animate);
	});
</script>

<section id="stats" class="bg-gradient-to-br from-brand to-brand-dark px-4 py-20 sm:px-6 lg:px-8">
	<div class="mx-auto max-w-6xl">
		<div class="mb-12 text-center">
			<h2 class="text-4xl font-bold text-onbrand sm:text-5xl">{$t('stats.title')}</h2>
		</div>

		<div class="grid gap-6 sm:grid-cols-3">
			{#each statCards as card (card.labelKey)}
				<div
					class="rounded-3xl border border-white/25 bg-white/10 p-8 text-center backdrop-blur-sm transition hover:bg-white/15"
				>
					<div
						class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 text-white"
					>
						<Icon name={card.icon} size={24} />
					</div>
					<div class="text-5xl font-bold text-white tabular-nums">
						{card.value.toLocaleString()}{card.suffix}
					</div>
					<p class="mt-2 text-lg text-white/90">{$t(card.labelKey)}</p>
				</div>
			{/each}
		</div>
	</div>
</section>
