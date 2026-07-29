/**
 * Shared tone system for status-colored UI primitives (Chip, Alert, SectionHeader, ...).
 * Maps semantic tones to the Emerald Oasis design tokens.
 */
import type { IconName } from './icons';

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
	brand: 'text-brand-dark dark:text-brand',
	ok: 'text-ok dark:text-[#2fd077]',
	warn: 'text-amber-700 dark:text-amber-300',
	info: 'text-info dark:text-[#5bc2de]',
	danger: 'text-danger',
	neutral: 'text-ink-soft'
};

export const toneIcon: Record<Tone, IconName> = {
	brand: 'leaf',
	ok: 'check-circle',
	warn: 'alert-triangle',
	info: 'info',
	danger: 'alert-circle',
	neutral: 'info'
};
