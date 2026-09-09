import { isSafeUrl } from "@/lib/security";

export const MAX_MEDIA_BYTES = 700_000;

export const ACCEPTED_MEDIA_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
] as const;

export type AcceptedMediaType = (typeof ACCEPTED_MEDIA_TYPES)[number];

export function mediaFileUrl(id: string) {
  return `/api/media/${id}/file`;
}

export function isAcceptedMediaType(value: string): value is AcceptedMediaType {
  return (ACCEPTED_MEDIA_TYPES as readonly string[]).includes(value);
}

export function mediaIdFromUrl(value: string) {
  const path = cmsMediaPath(value) ?? value.trim();
  const match = path.match(/^\/api\/media\/([^/]+)\/file\/?$/);
  return match?.[1];
}

export function cmsMediaPath(value: string) {
  const trimmed = value.trim();
  try {
    const parsed = new URL(trimmed, "http://local.invalid");
    if (parsed.pathname.startsWith("/api/media/")) return parsed.pathname;
  } catch {
    return null;
  }
  return null;
}

export function shouldBypassImageOptimizer(src: string) {
  return Boolean(cmsMediaPath(src)) || src.startsWith("/");
}

export function isImageAssetUrl(value: string) {
  if (!isSafeUrl(value, { allowRelative: true })) return false;
  const input = value.trim().toLowerCase();
  if (input.endsWith(".pdf")) return false;
  if (input.startsWith("/api/media/")) return true;
  return /\.(avif|gif|jpe?g|png|webp)(\?|#|$)/.test(input);
}
