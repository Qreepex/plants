import { t } from '$lib/i18n';

export const MAX_PHOTO_BYTES = 2 * 1024 * 1024;
export const ALLOWED_PHOTO_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

async function blobFromImage(bitmap: ImageBitmap, type: string, quality: number): Promise<Blob> {
	const canvas = document.createElement('canvas');
	canvas.width = bitmap.width;
	canvas.height = bitmap.height;
	const ctx = canvas.getContext('2d');
	if (!ctx) throw new Error('Canvas unsupported');
	ctx.drawImage(bitmap, 0, 0);
	const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality));
	if (!blob) throw new Error('Failed to create blob');
	return blob;
}

async function downscaleBitmap(src: ImageBitmap, scale: number): Promise<ImageBitmap> {
	const canvas = document.createElement('canvas');
	canvas.width = Math.max(1, Math.floor(src.width * scale));
	canvas.height = Math.max(1, Math.floor(src.height * scale));
	const ctx = canvas.getContext('2d');
	if (!ctx) throw new Error('Canvas unsupported');
	ctx.imageSmoothingQuality = 'high';
	ctx.drawImage(src, 0, 0, canvas.width, canvas.height);
	const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve));
	if (!blob) throw new Error('Downscale failed');
	return await createImageBitmap(blob);
}

export interface CompressedPhoto {
	blob: Blob;
	contentType: string;
	outName: string;
}

/**
 * Compress an image to WebP under the size limit, progressively lowering
 * quality and dimensions until it fits.
 */
export async function compressPhoto(file: File): Promise<CompressedPhoto> {
	const targetType = 'image/webp';
	let bitmap = await createImageBitmap(file);

	const maxDim = 3000;
	if (bitmap.width > maxDim || bitmap.height > maxDim) {
		const scale = Math.min(maxDim / bitmap.width, maxDim / bitmap.height);
		bitmap = await downscaleBitmap(bitmap, scale);
	}

	let quality = 0.92;
	let blob = await blobFromImage(bitmap, targetType, quality);

	for (let attempts = 0; blob.size > MAX_PHOTO_BYTES && attempts < 6; attempts++) {
		quality = Math.max(0.4, quality - 0.15);
		blob = await blobFromImage(bitmap, targetType, quality);
	}

	for (let i = 0; i < 3 && blob.size > MAX_PHOTO_BYTES; i++) {
		bitmap = await downscaleBitmap(bitmap, 0.8);
		quality = Math.max(0.5, quality - 0.1);
		blob = await blobFromImage(bitmap, targetType, quality);
	}

	if (blob.size > MAX_PHOTO_BYTES) throw new Error(t('common.compressionFailed'));

	const outName = file.name.replace(/\.[^.]+$/, '') + '.webp';
	return { blob, contentType: targetType, outName };
}

/** Upload a blob via a presigned S3 URL. Returns true on success. */
export async function putToPresignedUrl(
	url: string,
	headers: Record<string, string>,
	blob: Blob
): Promise<boolean> {
	try {
		const res = await fetch(url, { method: 'PUT', body: blob, headers });
		return res.ok;
	} catch {
		return false;
	}
}
