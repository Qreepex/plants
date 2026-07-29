<script lang="ts">
	import { tStore } from '$lib/i18n';
	import Button from '../Button.svelte';

	interface Props {
		items: string[];
		/** i18n key for the input placeholder */
		placeholder: string;
		/** i18n key for the empty state text */
		emptyText: string;
	}

	let { items = $bindable(), placeholder, emptyText }: Props = $props();

	let draft = $state('');

	function add(): void {
		const value = draft.trim();
		if (!value) return;
		items = [...items, value];
		draft = '';
	}

	function remove(index: number): void {
		items = items.filter((_, i) => i !== index);
	}
</script>

<div>
	<div class="mb-2 flex flex-col gap-2 sm:flex-row">
		<input
			type="text"
			bind:value={draft}
			onkeydown={(e) => e.key === 'Enter' && (e.preventDefault(), add())}
			placeholder={$tStore(placeholder)}
			class="flex-1 rounded-xl border-2 border-brand/25 bg-canvas px-4 py-2.5 text-base text-ink shadow-sm transition placeholder:text-ink/30 focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none"
		/>
		<Button onclick={add} text="plants.formAdd" variant="primary" class="w-full sm:w-auto" />
	</div>

	{#if items.length > 0}
		<ul class="space-y-2">
			{#each items as item, i (i)}
				<li class="flex items-start justify-between gap-2 rounded-xl bg-canvas p-3">
					<span class="flex-1 text-base break-words text-ink">{item}</span>
					<Button text="plants.formRemove" variant="danger" size="sm" onclick={() => remove(i)} />
				</li>
			{/each}
		</ul>
	{:else}
		<p class="text-sm text-ink-soft/70 italic">{$tStore(emptyText)}</p>
	{/if}
</div>
