/**
 * The session cookie name, in its own module with no Node imports so the
 * proxy (src/proxy.ts) can share it with src/lib/session.ts.
 */
export const SESSION_COOKIE = "bos_session";
