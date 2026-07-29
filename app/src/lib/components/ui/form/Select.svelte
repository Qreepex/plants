<script lang="ts" generics="T extends string">
	interface Props {
		value: T;
		id?: string;
		options: { value: T; label: string }[];
	}

	let { value = $bindable(), id, options }: Props = $props();
</script>

<select
	{id}
	bind:value
	class="w-full cursor-pointer rounded-xl border-2 border-brand/25 bg-canvas px-4 py-2.5 text-base text-ink shadow-sm transition focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none"
>
	{#each options as option (option.value)}
		<option value={option.value}>{option.label}</option>
	{/each}
</select>
