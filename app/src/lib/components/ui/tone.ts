/**
 * Shared tone system for status-colored UI primitives (Chip, StatTile, Alert, ...).
 * Maps semantic tones to the Emerald Oasis design tokens.
 */
export type Tone = 'brand' | 'ok' | 'warn' | 'info' | 'danger' | 'neutral';

export const toneBg: Record<Tone, string> = {
	brand: 'bg-brand/15',
	ok: 'bg-ok/15',
	warn: 'bg-warn/20',
	info: 'bg-info/15',
	danger: 'bg-danger/15',
	neutral: 'bg-ink/5'
};

export const toneText: Record<Tone, string> = {
	brand: 'text-brand-dark',
	ok: 'text-ok',
	warn: 'text-amber-700',
	info: 'text-info',
	danger: 'text-danger',
	neutral: 'text-ink-soft'
};

export const toneIcon: Record<Tone, string> = {
	brand: '🌿',
	ok: '✅',
	warn: '⚠️',
	info: 'ℹ️',
	danger: '⛔',
	neutral: '•'
};
