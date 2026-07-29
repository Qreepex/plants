<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import Spinner from '$lib/components/ui/Spinner.svelte';
	import { tStore } from '$lib/i18n';
	import { getPlantsStore } from '$lib/stores/plants.svelte';
	import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
	import { Capacitor } from '@capacitor/core';
	import { initializeApp } from 'firebase/app';
	import {
		browserLocalPersistence,
		getAuth,
		onAuthStateChanged,
		setPersistence
	} from 'firebase/auth';
	import { onMount, type Snippet } from 'svelte';
	import { FIREBASE_CONFIG } from './firebase';

	interface Props {
		children: Snippet;
	}

	const { children }: Props = $props();

	const app = initializeApp(FIREBASE_CONFIG);
	const auth = getAuth(app);
	const store = getPlantsStore();
	const platform = Capacitor.getPlatform();

	// Web and native SDKs return different User types; we only need truthiness.
	let user = $state<unknown>(null);
	let loading = $state(false);
	let initializing = $state(true);
	let error = $state<string | null>(null);

	// Load plants data once the user is authenticated
	$effect(() => {
		if (user && !store.hasLoaded) {
			void store.loadPlants();
		}
	});

	onMount(() => {
		let unsubscribe: (() => void) | undefined;

		if (platform === 'web') {
			setPersistence(auth, browserLocalPersistence).catch(console.error);

			unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
				user = firebaseUser ?? null;
				initializing = false;
			});
		} else {
			void (async () => {
				const result = await FirebaseAuthentication.getCurrentUser();
				user = result.user ?? null;
				initializing = false;

				const listener = await FirebaseAuthentication.addListener('authStateChange', (res) => {
					user = res.user;
				});
				unsubscribe = () => void listener.remove();
			})();
		}

		return () => unsubscribe?.();
	});

	async function loginWithGoogle() {
		try {
			loading = true;
			error = null;

			const result = await FirebaseAuthentication.signInWithGoogle();

			// Check if user cancelled (result exists but no user)
			if (!result || !result.user) {
				error = 'auth.signInCancelled';
				return;
			}

			user = result.user;
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			console.error('Login failed', err);
			if (
				err?.message?.includes('popup_closed_by_user') ||
				err?.code === 'popup-closed-by-user' ||
				err?.message?.includes('cancelled')
			) {
				error = 'auth.signInCancelled';
			} else {
				error = 'auth.signInError';
			}
		} finally {
			loading = false;
		}
	}
</script>

{#if initializing || (user && store.loading && !store.hasLoaded)}
	<Spinner fullscreen message="common.loadingPlants" />
{:else if user}
	{@render children()}
{:else}
	<div class="flex h-full items-center justify-center bg-canvas p-4">
		<div class="w-full max-w-md">
			<div class="mb-8 text-center">
				<h1 class="mb-2 text-4xl font-bold text-ink">{$tStore('common.app')}</h1>
				<p class="text-ink-soft">{$tStore('common.appDescription')}</p>
			</div>

			<Card padded class="p-8">
				<h2 class="mb-1 text-2xl font-bold text-ink">{$tStore('auth.signIn')}</h2>
				<p class="mb-6 text-ink-soft">{$tStore('auth.signInToContinue')}</p>

				{#if error}
					<Alert type="error" description={error} class="mb-4" />
				{/if}

				<Button
					disabled={loading}
					{loading}
					onclick={loginWithGoogle}
					text="auth.signInWithGoogle"
					loadingText="auth.signingIn"
					class="w-full"
				/>
			</Card>
		</div>
	</div>
{/if}
