<script lang="ts">
	import Button from '../ui/Button.svelte';

	interface Props {
		/** i18n key for the left (dismiss) action */
		cancelText?: string;
		/** i18n key for the right (confirm) action */
		saveText?: string;
		onCancel: () => void;
		onSave: () => void;
		saving?: boolean;
		canSave?: boolean;
	}

	const {
		cancelText = 'common.cancel',
		saveText = 'common.save',
		onCancel,
		onSave,
		saving = false,
		canSave = true
	}: Props = $props();
</script>

<!--
	Sticky action bar floating above the bottom navigation.
	Page content must reserve matching bottom padding (pb-40) so the bar never covers it.
-->
<div
	class="fixed right-3 left-3 z-50 flex gap-3 rounded-2xl border border-ink/10 bg-surface/95 p-3 shadow-lg backdrop-blur md:right-10 md:left-10 xl:right-32 xl:left-32"
	style="bottom: calc(env(safe-area-inset-bottom) + 5.5rem);"
>
	<Button variant="secondary" size="lg" onclick={onCancel} text={cancelText} class="w-full" />
	<Button
		variant="primary"
		size="lg"
		disabled={saving || !canSave}
		onclick={onSave}
		text={saving ? 'common.loading' : saveText}
		class="w-full"
	/>
</div>
