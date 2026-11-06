import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

/**
 * Where online applications go.
 *
 * 1. Always appended to data/submissions.json (works on any Node host with a disk:
 *    a VPS, Render, Railway, Fly). The admin page at /admin reads this file.
 * 2. If SUBMISSIONS_WEBHOOK_URL is set, each submission is also POSTed there as
 *    JSON, so the team can route it to email, Slack, Google Sheets, Airtable,
 *    Zapier or Make without code changes. On serverless hosts (Vercel) the file
 *    write may fail; the webhook is then the source of truth.
 */

export const SUBMISSION_TYPES = [
  "business", // join the directory
  "member", // become a member
  "partner", // become a partner
  "volunteer",
  "newsletter",
  "contact",
  "work-with-us", // sponsorship / corporate enquiry
  "spotlight", // spotlight package enquiry
  "shop-interest", // gift box interest
  "event-booking", // book / register for an event
  "stall", // market stall application
] as const;

export type SubmissionType = (typeof SUBMISSION_TYPES)[number];

export type Submission = {
  id: string;
  type: SubmissionType;
  createdAt: string;
  status: "new" | "reviewing" | "approved" | "declined";
  data: Record<string, unknown>;
  meta?: { userAgent?: string; referer?: string };
};

const DATA_DIR = path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "submissions.json");

async function readAll(): Promise<Submission[]> {
  try {
    const raw = await fs.readFile(FILE, "utf8");
    return JSON.parse(raw) as Submission[];
  } catch {
    return [];
  }
}

let queue: Promise<unknown> = Promise.resolve();

/** Serialised write so concurrent submissions don't clobber each other */
function withLock<T>(fn: () => Promise<T>): Promise<T> {
  const next = queue.then(fn, fn);
  queue = next.catch(() => undefined);
  return next;
}

export async function saveSubmission(
  type: SubmissionType,
  data: Record<string, unknown>,
  meta?: Submission["meta"],
): Promise<Submission> {
  const submission: Submission = {
    id: randomUUID(),
    type,
    createdAt: new Date().toISOString(),
    status: "new",
    data,
    meta,
  };

  let stored = false;
  try {
    await withLock(async () => {
      await fs.mkdir(DATA_DIR, { recursive: true });
      const all = await readAll();
      all.unshift(submission);
      await fs.writeFile(FILE, JSON.stringify(all, null, 2));
    });
    stored = true;
  } catch (err) {
    console.error("[submissions] could not write file", err);
  }

  const hook = process.env.SUBMISSIONS_WEBHOOK_URL;
  if (hook) {
    try {
      await fetch(hook, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(submission),
      });
      stored = true;
    } catch (err) {
      console.error("[submissions] webhook failed", err);
    }
  }

  if (!stored) throw new Error("Submission could not be stored");
  return submission;
}

export async function listSubmissions(type?: SubmissionType) {
  const all = await readAll();
  return type ? all.filter((s) => s.type === type) : all;
}

export async function updateSubmissionStatus(id: string, status: Submission["status"]) {
  return withLock(async () => {
    const all = await readAll();
    const s = all.find((x) => x.id === id);
    if (!s) return null;
    s.status = status;
    await fs.writeFile(FILE, JSON.stringify(all, null, 2));
    return s;
  });
}
