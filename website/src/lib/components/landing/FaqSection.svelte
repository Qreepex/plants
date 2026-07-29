<script lang="ts">
	import Icon from '../ui/Icon.svelte';
	import { t } from '$lib/i18n.svelte';

	const faqKeys = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7'];
</script>

<section class="px-4 py-20 sm:px-6 lg:px-8">
	<div class="mx-auto max-w-4xl">
		<h2 class="text-center text-4xl font-bold text-ink sm:text-5xl">
			{$t('faq.title')}
		</h2>

		<div class="mt-12 space-y-4">
			{#each faqKeys as key, i (key)}
				<div
					class="pop-in rounded-2xl border border-ink/5 bg-surface p-6 shadow-sm transition hover:shadow-md"
					style="animation-delay: {i * 40}ms"
				>
					<h3 class="flex items-start gap-3 font-semibold text-ink">
						<span
							class="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/15 text-brand-dark dark:text-brand"
						>
							<Icon name="info" size={14} />
						</span>
						{$t(`faq.${key}`)}
					</h3>
					<p class="mt-2 pl-9 text-ink-soft">{$t(`faq.a${key.substring(1)}`)}</p>
				</div>
			{/each}
		</div>
	</div>
</section>
