<script lang="ts">
	import { tStore } from '$lib/i18n';
	import { toneBg, toneIcon, toneText, type Tone } from './tone';

	type AlertType = 'error' | 'success' | 'warning' | 'info';

	interface Props {
		type?: AlertType;
		title?: string;
		/** i18n key (or raw text) for the body; `description` takes precedence over `message` */
		message?: string;
		description?: string;
		class?: string;
	}

	const {
		type = 'info',
		title = undefined,
		message = undefined,
		description = undefined,
		class: className = ''
	}: Props = $props();

	const toneByType: Record<AlertType, Tone> = {
		error: 'danger',
		success: 'ok',
		warning: 'warn',
		info: 'info'
	};

	const tone = $derived(toneByType[type]);
	const translatedTitle = $derived(title ? $tStore(title) : undefined);
	const translatedDescription = $derived(
		description ? $tStore(description) : message ? $tStore(message) : undefined
	);
</script>

<div
	role="alert"
	class="flex items-start gap-3 rounded-xl px-4 py-3 {toneBg[tone]} {toneText[tone]} {className}"
>
	<span aria-hidden="true">{toneIcon[tone]}</span>
	<div class="min-w-0 text-sm">
		{#if translatedTitle}
			<p class="font-bold">{translatedTitle}</p>
		{/if}
		{#if translatedDescription}
			<p class="wrap-break-word">{translatedDescription}</p>
		{/if}
	</div>
</div>
