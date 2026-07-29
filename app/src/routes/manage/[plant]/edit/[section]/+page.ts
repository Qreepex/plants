import { resolve } from '$app/paths';
import { redirect } from '@sveltejs/kit';

export const prerender = false;
export const ssr = false;

export function load({ params }) {
	// Old per-section editor URLs deep-link into the unified editor via hash.
	redirect(307, `${resolve('/manage/[plant]/edit', { plant: params.plant })}#${params.section}`);
}
