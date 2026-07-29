<script lang="ts">
	import { resolve } from '$app/paths';
	import { GITHUB_URL, INSTAGRAM_URL, TIKTOK_URL } from '$lib';
	import Icon from '../ui/Icon.svelte';
	import { t } from '$lib/i18n.svelte';

	const socialLinks = [
		{ url: TIKTOK_URL, labelKey: 'footer.social.tiktok' },
		{ url: INSTAGRAM_URL, labelKey: 'footer.social.instagram' },
		{ url: GITHUB_URL, labelKey: 'footer.social.github' }
	] as const;
</script>

<footer class="border-t border-brand/15 bg-[#061f12] px-4 py-12 text-white sm:px-6 lg:px-8">
	<div class="mx-auto max-w-6xl">
		<div class="grid gap-8 sm:grid-cols-4">
			<div>
				<div class="flex items-center gap-2.5">
					<span class="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-onbrand">
						<Icon name="sprout" size={20} />
					</span>
					<span class="text-xl font-bold">Water Me</span>
				</div>
				<p class="mt-3 text-sm text-white/70">{$t('footer.tagline')}</p>
			</div>

			<div>
				<h4 class="font-semibold">{$t('footer.product')}</h4>
				<!-- Hash anchors cannot be expressed via resolve(); built from resolve('/') base -->
				<!-- eslint-disable svelte/no-navigation-without-resolve -->
				<ul class="mt-3 space-y-2">
					<li>
						<a
							href={`${resolve('/')}#features`}
							class="text-sm text-white/70 transition hover:text-brand"
						>
							{$t('nav.features')}
						</a>
					</li>
					<li>
						<a
							href={`${resolve('/')}#download`}
							class="text-sm text-white/70 transition hover:text-brand"
						>
							{$t('nav.download')}
						</a>
					</li>
					<li>
						<a
							href="mailto:support@water-me.app"
							class="text-sm text-white/70 transition hover:text-brand"
						>
							{$t('footer.support')}
						</a>
					</li>
				</ul>
				<!-- eslint-enable svelte/no-navigation-without-resolve -->
			</div>

			<div>
				<h4 class="font-semibold">{$t('footer.legal')}</h4>
				<ul class="mt-3 space-y-2">
					<li>
						<a
							href={resolve('/privacy')}
							data-sveltekit-preload-data="off"
							class="text-sm text-white/70 transition hover:text-brand"
						>
							{$t('footer.privacy')}
						</a>
					</li>
					<li>
						<a
							href={resolve('/terms')}
							data-sveltekit-preload-data="off"
							class="text-sm text-white/70 transition hover:text-brand"
						>
							{$t('footer.terms')}
						</a>
					</li>
					<li>
						<a
							href={resolve('/imprint')}
							data-sveltekit-preload-data="off"
							class="text-sm text-white/70 transition hover:text-brand"
						>
							{$t('footer.imprint')}
						</a>
					</li>
				</ul>
			</div>

			<div>
				<h4 class="font-semibold">{$t('footer.connect')}</h4>
				<ul class="mt-3 space-y-2">
					{#each socialLinks as link (link.url)}
						<li>
							<a
								rel="external"
								target="_blank"
								href={link.url}
								class="inline-flex items-center gap-1.5 text-sm text-white/70 transition hover:text-brand"
							>
								{$t(link.labelKey)}
								<Icon name="external-link" size={13} />
							</a>
						</li>
					{/each}
				</ul>
			</div>
		</div>

		<div class="mt-10 border-t border-white/10 pt-8">
			<p class="text-center text-sm text-white/70">{$t('footer.copyright')}</p>
		</div>
	</div>
</footer>
