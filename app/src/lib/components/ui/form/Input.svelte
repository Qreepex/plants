<script lang="ts">
	import { tStore } from '$lib/i18n';

	interface Props {
		value: string | number;
		type?: 'text' | 'number' | 'email' | 'url';
		id?: string;
		placeholder?: string;
		required?: boolean;
		min?: number;
		max?: number;
		step?: number;
	}

	let {
		value = $bindable(),
		type = 'text',
		id,
		placeholder,
		required = false,
		min,
		max,
		step
	}: Props = $props();
</script>

<input
	{type}
	{id}
	{required}
	{min}
	{max}
	{step}
	bind:value
	placeholder={placeholder ? $tStore(placeholder) : undefined}
	class="w-full rounded-xl border-2 border-brand/25 bg-surface px-4 py-2.5 text-base text-ink shadow-sm transition placeholder:text-ink/30 focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none"
/>
