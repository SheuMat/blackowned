import "server-only";
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * Lightweight signed-cookie sessions for two roles:
 *  - "member": unlocks Business Support. Members sign in with the access code
 *    the team sends them on approval (MEMBER_ACCESS_CODE).
 *  - "admin":  the team's /admin dashboard (ADMIN_PASSWORD).
 *
 * This is deliberately simple for launch. When membership grows, swap for
 * per-person accounts (e.g. Auth.js, Clerk or Supabase Auth); the
 * getSession()/requireRole() API can stay the same.
 */

export type Role = "member" | "admin";
export { SESSION_COOKIE } from "./session-cookie";
import { SESSION_COOKIE } from "./session-cookie";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

const DEV_DEFAULTS = {
  SESSION_SECRET: "dev-only-secret-change-me",
  MEMBER_ACCESS_CODE: "bos-member-2026",
  ADMIN_PASSWORD: "bos-admin-2026",
};

const isProd = process.env.NODE_ENV === "production";

/**
 * Without SESSION_SECRET in production, sign with a random per-process secret:
 * sessions reset when the server restarts, but nobody can forge a cookie with
 * the public dev default.
 */
const fallbackSecret = isProd ? randomBytes(32).toString("base64url") : DEV_DEFAULTS.SESSION_SECRET;
if (isProd && !process.env.SESSION_SECRET) {
  console.warn("[session] SESSION_SECRET is not set; using a temporary random secret. Set it before launch.");
}

function sessionSecret() {
  return process.env.SESSION_SECRET || fallbackSecret;
}

/** The expected code/password, or null when that login is switched off */
function credential(name: "MEMBER_ACCESS_CODE" | "ADMIN_PASSWORD") {
  const v = process.env[name];
  if (v) return v;
  if (isProd) {
    // Never fall back to the dev codes (they are in the README) on a live site
    console.error(`[session] ${name} is not set, so this login is switched off until it is.`);
    return null;
  }
  return DEV_DEFAULTS[name];
}

function sign(payload: string) {
  return createHmac("sha256", sessionSecret()).update(payload).digest("base64url");
}

function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

export type Session = { role: Role; name?: string; exp: number };

export function encodeSession(s: Session) {
  const payload = Buffer.from(JSON.stringify(s)).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function decodeSession(token?: string): Session | null {
  if (!token) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig || !safeEqual(sig, sign(payload))) return null;
  try {
    const s = JSON.parse(Buffer.from(payload, "base64url").toString()) as Session;
    return s.exp > Date.now() ? s : null;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<Session | null> {
  const jar = await cookies();
  return decodeSession(jar.get(SESSION_COOKIE)?.value);
}

/** Admins can see everything members can */
export async function hasRole(role: Role) {
  const s = await getSession();
  if (!s) return false;
  return s.role === role || s.role === "admin";
}

export function checkCredential(role: Role, secret: string) {
  const expected = credential(role === "admin" ? "ADMIN_PASSWORD" : "MEMBER_ACCESS_CODE");
  if (!expected) return false;
  return safeEqual(secret.trim(), expected);
}

/** Call from a Server Action or Route Handler */
export async function startSession(role: Role, name?: string) {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, encodeSession({ role, name, exp: Date.now() + MAX_AGE * 1000 }), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function endSession() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}
