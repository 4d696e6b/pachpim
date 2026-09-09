export interface SafeUrlOptions {
  allowRelative?: boolean;
  allowedProtocols?: readonly ("http:" | "https:" | "mailto:")[];
}

const CONTROL_CHARACTERS = /[\u0000-\u001F\u007F]/;

export function isSafeUrl(
  value: string,
  {
    allowRelative = false,
    allowedProtocols = ["https:", "http:"],
  }: SafeUrlOptions = {},
): boolean {
  const input = value.trim();
  if (!input || CONTROL_CHARACTERS.test(input) || input.includes("\\"))
    return false;

  if (allowRelative && input.startsWith("/") && !input.startsWith("//")) {
    return true;
  }

  try {
    const url = new URL(input);
    if (
      !allowedProtocols.includes(url.protocol as "http:" | "https:" | "mailto:")
    ) {
      return false;
    }
    if (url.username || url.password) return false;
    if (url.protocol === "mailto:") {
      return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(url.pathname);
    }
    return Boolean(url.hostname);
  } catch {
    return false;
  }
}

export function assertSafeUrl(value: string, options?: SafeUrlOptions): string {
  if (!isSafeUrl(value, options)) {
    throw new Error("Unsafe or unsupported URL.");
  }
  return value.trim();
}
