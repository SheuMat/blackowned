import { NextResponse } from "next/server";
import { z } from "zod";
import { SUBMISSION_TYPES, saveSubmission } from "@/lib/submissions";

/**
 * POST /api/applications
 * Body: { type: SubmissionType, data: Record<string, unknown>, website?: string }
 *
 * Every form on the site posts here (use the `useSubmission` hook).
 * `website` is a honeypot field: real people never fill it in.
 * Type-specific validation is done client-side with zod; the server enforces
 * shape, size limits and a contact email for anything except newsletters.
 */

const Body = z.object({
  type: z.enum(SUBMISSION_TYPES),
  data: z.record(z.string(), z.unknown()),
  website: z.string().optional(),
});

const MAX_BYTES = 64 * 1024;

const rate = new Map<string, { count: number; at: number }>();
function limited(ip: string) {
  const now = Date.now();
  const r = rate.get(ip);
  if (!r || now - r.at > 60_000) {
    rate.set(ip, { count: 1, at: now });
    return false;
  }
  r.count++;
  return r.count > 10;
}

function clean(value: unknown, depth = 0): unknown {
  if (depth > 4) return undefined;
  if (typeof value === "string") return value.slice(0, 5000).trim();
  if (typeof value === "number" || typeof value === "boolean" || value === null) return value;
  if (Array.isArray(value)) return value.slice(0, 50).map((v) => clean(v, depth + 1));
  if (typeof value === "object" && value) {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .slice(0, 80)
        .map(([k, v]) => [k.slice(0, 80), clean(v, depth + 1)]),
    );
  }
  return undefined;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (limited(ip)) {
    return NextResponse.json({ ok: false, error: "Too many submissions. Please wait a minute." }, { status: 429 });
  }

  const text = await req.text();
  if (text.length > MAX_BYTES) {
    return NextResponse.json({ ok: false, error: "That's too much information for one form." }, { status: 413 });
  }

  let parsed: z.infer<typeof Body>;
  try {
    parsed = Body.parse(JSON.parse(text));
  } catch {
    return NextResponse.json({ ok: false, error: "Something about that form wasn't right." }, { status: 400 });
  }

  // Honeypot: pretend success for bots
  if (parsed.website) return NextResponse.json({ ok: true, id: "ok" });

  const data = clean(parsed.data) as Record<string, unknown>;
  const email = typeof data.email === "string" ? data.email : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "Please give us an email address we can reply to." }, { status: 422 });
  }

  try {
    const s = await saveSubmission(parsed.type, data, {
      userAgent: req.headers.get("user-agent") ?? undefined,
      referer: req.headers.get("referer") ?? undefined,
    });
    return NextResponse.json({ ok: true, id: s.id });
  } catch {
    return NextResponse.json(
      { ok: false, error: "We couldn't save that just now. Please try again, or message us on Instagram." },
      { status: 500 },
    );
  }
}
