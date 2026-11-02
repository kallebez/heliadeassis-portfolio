export const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"] as const;
export const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
export const MAX_IMAGE_SIDE = 1000;

export function isSupportedImage(file: File): boolean {
  return (ACCEPTED_IMAGE_TYPES as readonly string[]).includes(file.type);
}

export function isImageTooLarge(file: File): boolean {
  return file.size > MAX_IMAGE_BYTES;
}

export function imageScale(width: number, height: number, maxSide = MAX_IMAGE_SIDE): number {
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) return 1;
  return Math.min(1, maxSide / Math.max(width, height));
}

export function hasTransparency(data: Uint8ClampedArray): boolean {
  for (let i = 3; i < data.length; i += 4) if (data[i] !== 255) return true;
  return false;
}

export function imageOutputType(fileType: string, transparent: boolean): "image/png" | "image/jpeg" {
  return transparent && (fileType === "image/png" || fileType === "image/webp") ? "image/png" : "image/jpeg";
}
