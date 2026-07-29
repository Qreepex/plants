<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import NotificationDebug from '$lib/components/NotificationDebug.svelte';
	import PageContent from '$lib/components/layout/PageContent.svelte';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Checkbox from '$lib/components/ui/form/Checkbox.svelte';
	import { tStore } from '$lib/i18n';
	import {
		getNotificationState,
		requestNotificationPermissions,
		type NotificationState
	} from '$lib/notifications';

	interface FeedbackMessage {
		type: 'success' | 'error';
		text: string;
	}

	let notifState = $state<NotificationState>(getNotificationState());
	let requesting = $state(false);
	let message = $state<FeedbackMessage | null>(null);

	// Placeholder preferences until backend config exists (see TODO.md)
	let wateringReminders = $state(true);
	let fertilizingReminders = $state(false);
	let mistingReminders = $state(false);

	async function enableNotifications(): Promise<void> {
		requesting = true;
		message = null;
		try {
			await requestNotificationPermissions();
			notifState = getNotificationState();
			message =
				notifState.isRegistered && notifState.token
					? { type: 'success' as const, text: $tStore('menu.notificationsEnabled') }
					: { type: 'error' as const, text: $tStore('menu.permissionDenied') };
		} catch (e) {
			console.error(e);
			message = { type: 'error' as const, text: $tStore('menu.notificationError') };
		} finally {
			requesting = false;
		}
	}

	onMount(() => {
		notifState = getNotificationState();
	});
</script>

<PageHeader icon="🔔" title="menu.notifications" backHref={resolve('/')} />

<PageContent>
	<div class="min-h-0 flex-1 overflow-y-auto">
		<div class="space-y-4 px-2 pb-8">
			<Card padded>
				<h2 class="text-lg font-semibold text-ink">{$tStore('menu.pushNotifications')}</h2>
				<p class="mt-1 mb-4 text-sm text-ink-soft">
					{$tStore('menu.notificationsDescription')}
				</p>
				<Button
					onclick={enableNotifications}
					loading={requesting}
					disabled={requesting}
					loadingText="menu.requestingNotifications"
					text="menu.enableNotifications"
					variant="primary"
				/>
				{#if message}
					<Alert type={message.type} description={message.text} class="mt-3" />
				{/if}
				{#if notifState.token}
					<p class="mt-3 text-xs break-all text-ink-soft">Token: {notifState.token}</p>
				{/if}
			</Card>

			<Card padded>
				<h2 class="mb-2 text-lg font-semibold text-ink">{$tStore('menu.preferences')}</h2>
				<Checkbox bind:checked={wateringReminders} label="plants.wateringTitle" />
				<Checkbox bind:checked={fertilizingReminders} label="plants.fertilizingTitle" />
				<Checkbox bind:checked={mistingReminders} label="plants.humidityTitle" />
			</Card>

			<NotificationDebug />
		</div>
	</div>
</PageContent>
