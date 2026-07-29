<script lang="ts">
	import { Haptics, ImpactStyle } from '@capacitor/haptics';
	import Icon from './Icon.svelte';
	import type { IconName } from './icons';

	interface Props {
		/** Already-translated label */
		label: string;
		icon?: IconName;
		variant?: 'water' | 'primary' | 'secondary';
		/** Hold duration in ms before the action fires */
		duration?: number;
		size?: 'md' | 'lg';
		disabled?: boolean;
		onconfirm: () => void;
		class?: string;
	}

	const {
		label,
		icon,
		variant = 'primary',
		duration = 650,
		size = 'md',
		disabled = false,
		onconfirm,
		class: className = ''
	}: Props = $props();

	let progress = $state(0);
	let holding = $state(false);
	let frame = 0;
	let startTs = 0;

	const variantClasses = {
		water: 'bg-info text-white shadow-[0_4px_14px_rgba(33,158,188,0.4)]',
		primary: 'bg-brand text-onbrand shadow-[0_4px_14px_rgba(0,238,87,0.4)]',
		secondary: 'bg-surface text-ink border border-ink/10'
	};

	const sizeClasses = {
		md: 'h-14 text-base rounded-2xl',
		lg: 'h-16 text-lg rounded-2xl'
	};

	function tick(): void {
		const elapsed = performance.now() - startTs;
		progress = Math.min(1, elapsed / duration);

		if (progress >= 1) {
			complete();
			return;
		}
		frame = requestAnimationFrame(tick);
	}

	function startHold(event: PointerEvent): void {
		if (disabled || holding) return;
		// Own the pointer so leaving the element mid-hold stays tracked
		(event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId);
		holding = true;
		startTs = performance.now();
		frame = requestAnimationFrame(tick);
	}

	function cancelHold(): void {
		if (!holding) return;
		holding = false;
		cancelAnimationFrame(frame);
		progress = 0;
	}

	function complete(): void {
		holding = false;
		cancelAnimationFrame(frame);
		progress = 0;
		Haptics.impact({ style: ImpactStyle.Medium }).catch(() => {
			/* haptics unavailable (web) */
		});
		onconfirm();
	}

	function onKeydown(event: KeyboardEvent): void {
		// Keyboard users confirm instantly with Enter/Space
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			onconfirm();
		}
	}
</script>

<button
	type="button"
	{disabled}
	onpointerdown={startHold}
	onpointerup={cancelHold}
	onpointercancel={cancelHold}
	onpointerleave={cancelHold}
	onkeydown={onKeydown}
	class="relative w-full cursor-pointer touch-none overflow-hidden font-semibold transition select-none active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 {variantClasses[
		variant
	]} {sizeClasses[size]} {className}"
>
	<!-- Hold progress fill -->
	<div
		class="absolute inset-y-0 left-0 bg-white/25 transition-none"
		style:width="{progress * 100}%"
		aria-hidden="true"
	></div>

	<span class="relative flex items-center justify-center gap-2">
		{#if icon}
			<Icon name={icon} size={size === 'lg' ? 24 : 20} />
		{/if}
		{label}
	</span>
</button>
