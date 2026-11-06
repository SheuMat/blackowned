import { useState } from "react";
import { z } from "zod";

/**
 * Small helpers shared by every Join form: zod issue → inline error mapping,
 * a tiny field-state hook, focus-first-error, and common validators.
 */

export type Errors = Record<string, string>;

export function issuesToErrors(issues: z.ZodError["issues"]): Errors {
  const out: Errors = {};
  for (const issue of issues) {
    const key = issue.path.map(String).join(".") || "_form";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

/** Focus the first field (by DOM order) that has an error. Fields use id `${prefix}-${name}`. */
export function focusFirstError(prefix: string, errors: Errors) {
  if (typeof document === "undefined") return;
  const keys = Object.keys(errors);
  const els = keys
    .map((k) => {
      const [field, sub] = k.split(".");
      // Nested errors such as "hours.2" point at a specific row when one exists
      const specific = sub ? document.getElementById(`${prefix}-${field}-day-${sub}-open`) : null;
      return specific ?? document.getElementById(`${prefix}-${field}`);
    })
    .filter((el): el is HTMLElement => !!el);
  if (els.length === 0) return;
  els.sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
  const first = els[0]!;
  const target = first.matches("input, select, textarea, button")
    ? first
    : first.querySelector<HTMLElement>("input:not([type=hidden]), select, textarea, button");
  (target ?? first).focus();
}

/** Controlled values + errors for a flat form */
export function useFields<T extends Record<string, unknown>>(initial: T) {
  const [values, setValues] = useState<T>(initial);
  const [errors, setErrors] = useState<Errors>({});

  function set<K extends keyof T>(key: K, value: T[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key as string]) {
      setErrors((e) => {
        const next = { ...e };
        delete next[key as string];
        return next;
      });
    }
  }

  /** Returns parsed data on success, or null after setting errors */
  function validate<S extends z.ZodType>(schema: S, prefix: string): z.infer<S> | null {
    const result = schema.safeParse(values);
    if (result.success) {
      setErrors({});
      return result.data;
    }
    const errs = issuesToErrors(result.error.issues);
    setErrors(errs);
    focusFirstError(prefix, errs);
    return null;
  }

  return { values, setValues, set, errors, setErrors, validate };
}

// ─── Validators ─────────────────────────────────────────────────────────────

export const req = (msg: string) => z.string().trim().min(1, msg);

export const emailField = z
  .string()
  .trim()
  .min(1, "Please add your email address.")
  .pipe(z.email("That email address doesn't look quite right."));

const PHONE = /^\+?[\d\s()-]{9,20}$/;
export const optionalPhone = z
  .string()
  .trim()
  .refine((v) => v === "" || PHONE.test(v), "That phone number doesn't look quite right.");
export const requiredPhone = z
  .string()
  .trim()
  .min(1, "Please add a phone number.")
  .refine((v) => PHONE.test(v), "That phone number doesn't look quite right.");

const URLISH = /^(https?:\/\/)?([\w-]+\.)+[a-z]{2,}(\/\S*)?$/i;
export function isUrlish(v: string) {
  return URLISH.test(v.trim());
}
export const optionalUrl = z
  .string()
  .trim()
  .refine((v) => v === "" || isUrlish(v), "Please use a full web address, like www.yourbusiness.co.uk");

export const optionalEmail = z
  .string()
  .trim()
  .refine((v) => v === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), "That email address doesn't look quite right.");

/** Light UK postcode check (full postcode) */
export const UK_POSTCODE = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i;
export function formatPostcode(v: string) {
  const s = v.replace(/\s+/g, "").toUpperCase();
  if (!UK_POSTCODE.test(s)) return v.trim().toUpperCase();
  return `${s.slice(0, -3)} ${s.slice(-3)}`;
}

export const consentField = z.literal(true, { error: "Please tick this box so we can process your application." });

/** Adds https:// to bare domains so links work */
export function withProtocol(v: string) {
  const s = v.trim();
  if (!s) return "";
  return /^https?:\/\//i.test(s) ? s : `https://${s}`;
}

// ─── Shared option lists ────────────────────────────────────────────────────

export const heardAboutOptions = [
  "Instagram",
  "Facebook",
  "TikTok",
  "At a Black Owned market or event",
  "Word of mouth",
  "Search engine",
  "A partner organisation",
  "Other",
].map((v) => ({ value: v, label: v }));
