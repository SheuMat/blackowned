"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { checkCredential, endSession, startSession } from "@/lib/session";
import { safeNext } from "@/components/support/safe-next";

export type LoginState = {
  error?: string;
  /** Echoed back so the form keeps what the member typed */
  name?: string;
};

/** Gentle brute-force protection: a few attempts per minute per IP */
const attempts = new Map<string, { count: number; at: number }>();
const WINDOW_MS = 60_000;
const MAX_ATTEMPTS = 8;

function tooManyAttempts(key: string) {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || now - entry.at > WINDOW_MS) {
    attempts.set(key, { count: 1, at: now });
    return false;
  }
  entry.count++;
  return entry.count > MAX_ATTEMPTS;
}

function cleanName(value: FormDataEntryValue | null) {
  if (typeof value !== "string") return "";
  return value
    .replace(/[\u0000-\u001f\u007f<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 40);
}

export async function memberLogin(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const code = typeof formData.get("code") === "string" ? String(formData.get("code")) : "";
  const name = cleanName(formData.get("name"));
  const next = safeNext(formData.get("next"));

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "local";
  if (tooManyAttempts(ip)) {
    return { name, error: "Too many attempts. Take a breather and try again in a minute." };
  }

  if (!code.trim()) {
    return { name, error: "Enter the access code from your membership email." };
  }
  if (code.length > 200 || !checkCredential("member", code)) {
    return {
      name,
      error: "That code doesn't match. Check your membership email (codes are case-sensitive) and try again.",
    };
  }

  await startSession("member", name || undefined);
  redirect(next);
}

export async function memberSignOut() {
  await endSession();
  redirect("/business-support?signedout=1");
}
