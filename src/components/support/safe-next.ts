/**
 * Only follow `next` redirects to pages on this site. Anything that isn't a
 * plain internal path ("/business-support/funding") falls back to the hub, so
 * the login page can't be used to bounce people to another website.
 */
export const DEFAULT_MEMBER_PATH = "/business-support";

export function safeNext(value: unknown, fallback = DEFAULT_MEMBER_PATH): string {
  if (typeof value !== "string") return fallback;
  const next = value.trim();
  if (!next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return fallback;
  // No control characters or backslashes (browsers treat "\" like "/")
  if (/[\u0000-\u001f\u007f\\]/.test(next)) return fallback;
  if (next.length > 300) return fallback;
  // Don't send people back to the login page after logging in
  if (next === "/members/login" || next.startsWith("/members/login?")) return fallback;
  return next;
}
