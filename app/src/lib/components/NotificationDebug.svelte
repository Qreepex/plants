<script lang="ts">
	import { onMount } from 'svelte';
	import { getNotificationState, checkNotificationPermissions } from '$lib/notifications';
	import { Preferences } from '@capacitor/preferences';
	import type { NotificationState } from '$lib/notifications';

	let notificationState = $state<NotificationState>({
		token: null,
		isRegistered: false,
		isSupported: false
	});
	let permissionGranted = $state(false);
	let showToken = $state(false);

	onMount(async () => {
		// Get current notification state
		notificationState = getNotificationState();

		// Check if token is in Capacitor Preferences (in case it was registered before)
		if (!notificationState.token) {
			try {
				const { value } = await Preferences.get({ key: 'fcm_token' });
				if (value) {
					notificationState.token = value;
				}
			} catch (err) {
				console.error('Failed to get stored token:', err);
			}
		}

		// Check permissions
		permissionGranted = await checkNotificationPermissions();
	});

	function copyToken() {
		if (notificationState.token) {
			navigator.clipboard.writeText(notificationState.token);
			alert('Token copied to clipboard!');
		}
	}
</script>

<div class="rounded-2xl border border-ink/10 bg-surface p-4 shadow-md md:p-6">
	<h3 class="mb-4 flex items-center gap-2 text-lg font-bold text-brand-dark dark:text-brand">
		Push Notifications
	</h3>

	<div class="space-y-3">
		<!-- Status -->
		<div class="grid grid-cols-2 gap-3 text-sm">
			<div>
				<p class="font-semibold text-ink">Supported:</p>
				<p class={notificationState.isSupported ? 'text-ok' : 'text-ink-soft/70'}>
					{notificationState.isSupported ? '✓ Yes' : '✗ No (Web only)'}
				</p>
			</div>
			<div>
				<p class="font-semibold text-ink">Permission:</p>
				<p class={permissionGranted ? 'text-ok' : 'text-danger'}>
					{permissionGranted ? '✓ Granted' : '✗ Denied'}
				</p>
			</div>
			<div>
				<p class="font-semibold text-ink">Registered:</p>
				<p class={notificationState.isRegistered ? 'text-ok' : 'text-ink-soft/70'}>
					{notificationState.isRegistered ? '✓ Yes' : '✗ No'}
				</p>
			</div>
			<div>
				<p class="font-semibold text-ink">Token:</p>
				<p class={notificationState.token ? 'text-ok' : 'text-ink-soft/70'}>
					{notificationState.token ? '✓ Available' : '✗ None'}
				</p>
			</div>
		</div>

		<!-- FCM Token -->
		{#if notificationState.token}
			<div class="border-t border-brand/20 pt-3">
				<div class="mb-2 flex items-center justify-between">
					<p class="text-sm font-semibold text-ink">FCM Token:</p>
					<button
						onclick={() => (showToken = !showToken)}
						class="text-xs font-medium text-brand-dark dark:text-brand"
					>
						{showToken ? 'Hide' : 'Show'}
					</button>
				</div>

				{#if showToken}
					<div class="rounded-xl bg-canvas p-3">
						<p class="font-mono text-xs break-all text-ink">
							{notificationState.token}
						</p>
						<button
							onclick={copyToken}
							class="mt-2 w-full rounded-lg bg-brand px-3 py-2 text-sm font-semibold text-onbrand transition hover:bg-brand-dark hover:text-white"
						>
							📋 Copy Token
						</button>
					</div>
				{/if}
			</div>

			<!-- Instructions -->
			<div class="border-t border-brand/20 pt-3">
				<p class="mb-2 text-xs text-ink-soft">
					<strong>To send test notification:</strong>
				</p>
				<ol class="list-inside list-decimal space-y-1 text-xs text-ink-soft">
					<li>Copy the token above</li>
					<li>Go to Firebase Console → Cloud Messaging</li>
					<li>Click "Send test message"</li>
					<li>Paste the token and send</li>
				</ol>
			</div>
		{:else}
			<div class="border-t border-brand/20 pt-3">
				<p class="text-xs text-ink-soft">
					{#if !notificationState.isSupported}
						Push notifications are only available on native platforms (iOS/Android).
					{:else if !permissionGranted}
						Please grant notification permissions to receive push notifications.
					{:else}
						Waiting for FCM token registration...
					{/if}
				</p>
			</div>
		{/if}
	</div>
</div>
