import { resolve } from '$app/paths';
import { redirect } from '@sveltejs/kit';

export const prerender = false;
export const ssr = false;

export function load({ params }) {
	// The old manage hub is gone — the unified editor lives at /edit.
	redirect(307, resolve('/manage/[plant]/edit', { plant: params.plant }));
}
