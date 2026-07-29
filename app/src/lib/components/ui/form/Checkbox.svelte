<script lang="ts">
	import { tStore } from '$lib/i18n';

	interface Props {
		checked: boolean;
		/** i18n key for the label */
		label: string;
	}

	let { checked = $bindable(), label }: Props = $props();
</script>

<label
	class="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl px-2 transition hover:bg-brand/5"
>
	<input type="checkbox" bind:checked class="h-5 w-5 shrink-0 accent-brand-dark" />
	<span class="text-base text-ink">{$tStore(label)}</span>
</label>
