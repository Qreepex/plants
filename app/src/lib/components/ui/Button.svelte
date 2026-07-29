<script lang="ts">
	import ButtonSpinner from '$lib/assets/ButtonSpinner.svelte';
	import { tStore } from '$lib/i18n';
	import type { Component, Snippet } from 'svelte';

	export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'water';
	export type ButtonSize = 'sm' | 'md' | 'lg';

	interface Props {
		variant?: ButtonVariant;
		size?: ButtonSize;
		disabled?: boolean;
		loading?: boolean;
		onclick?: () => void;
		/** i18n key used as button label, or raw text fallback */
		text: string;
		/** i18n key for the label while `loading` */
		loadingText?: string;
		icon?: string;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		iconComponent?: Snippet | Component<any>;
		class?: string;
	}

	const {
		variant = 'primary',
		size = 'md',
		disabled = false,
		loading = false,
		onclick,
		text,
		loadingText = 'common.loading',
		icon,
		iconComponent,
		class: className = ''
	}: Props = $props();

	const Icon = $derived(typeof iconComponent === 'function' ? iconComponent : () => iconComponent);

	const variantClasses: Record<ButtonVariant, string> = {
		primary:
			'bg-brand text-onbrand hover:bg-brand-dark hover:text-white font-semibold shadow-[0_4px_14px_rgba(0,238,87,0.4)]',
		secondary: 'bg-surface text-ink border border-ink/10 hover:bg-canvas font-medium',
		danger: 'bg-danger text-white hover:opacity-90 font-medium',
		ghost:
			'bg-transparent border-2 border-brand text-brand-dark hover:bg-brand/10 dark:text-brand font-medium',
		water:
			'bg-info text-white hover:opacity-90 font-semibold shadow-[0_4px_14px_rgba(33,158,188,0.4)]'
	};

	const sizeClasses: Record<ButtonSize, string> = {
		sm: 'min-h-9 px-3 py-1.5 text-sm rounded-lg',
		md: 'min-h-11 px-5 py-2.5 text-base rounded-xl',
		lg: 'min-h-13 px-6 py-3.5 text-base rounded-xl'
	};
</script>

<button
	type="button"
	disabled={disabled || loading}
	{onclick}
	class="inline-flex cursor-pointer items-center justify-center transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 {variantClasses[
		variant
	]} {sizeClasses[size]} {className}"
>
	{#if loading}
		<span class="inline-flex items-center gap-2">
			<ButtonSpinner />
			{$tStore(loadingText)}
		</span>
	{:else if icon || iconComponent}
		<span class="inline-flex items-center gap-2">
			{#if iconComponent}
				<Icon />
			{:else if icon}
				<span aria-hidden="true">{icon}</span>
			{/if}
			{#if text}
				<span>{$tStore(text)}</span>
			{/if}
		</span>
	{:else}
		{$tStore(text)}
	{/if}
</button>
