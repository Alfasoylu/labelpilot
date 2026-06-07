/**
 * Returns `input` when it is a safe relative path (starts with "/" but not "//").
 * Rejects absolute URLs such as "https://evil.com" or protocol-relative paths
 * like "//evil.com" that would produce an open redirect via `new URL(input, base)`.
 *
 * Falls back to `fallback` for any unsafe or empty value.
 */
export function safeRedirect(input: string | undefined | null, fallback: string): string {
  if (typeof input === "string" && input.startsWith("/") && !input.startsWith("//")) {
    return input;
  }
  return fallback;
}
