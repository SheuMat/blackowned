import type { NextRequest } from "next/server";
import { displayEntries, plainValue, fieldLabel, statusMeta, typeMeta } from "@/components/admin/format";
import { hasRole } from "@/lib/session";
import { SUBMISSION_TYPES, listSubmissions, type Submission, type SubmissionType } from "@/lib/submissions";

/**
 * GET /api/admin/export?type=business|member|…|all[&status=new|reviewing|approved|declined][&q=search]
 * CSV download of submissions for the team, using the same filters as /admin.
 * Admin session required.
 */

export const dynamic = "force-dynamic";

const STATUSES: Submission["status"][] = ["new", "reviewing", "approved", "declined"];

function cell(value: string) {
  let v = value.replace(/\r\n?/g, "\n");
  // Stop spreadsheet apps treating text as a formula (plain @handles and +44 phone numbers are fine)
  const safe = /^@[\w.]+$/.test(v) || /^\+[\d\s()-]+$/.test(v);
  if (!safe && /^[=+\-@\t\r]/.test(v)) v = `'${v}`;
  return /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}

export async function GET(req: NextRequest) {
  if (!(await hasRole("admin"))) {
    return new Response("Sign in at /admin to export submissions.", {
      status: 401,
      headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" },
    });
  }

  const rawType = req.nextUrl.searchParams.get("type") ?? "all";
  const rawStatus = req.nextUrl.searchParams.get("status") ?? "";
  const type = (SUBMISSION_TYPES as readonly string[]).includes(rawType) ? (rawType as SubmissionType) : undefined;
  if (rawType !== "all" && !type) {
    return new Response(`Unknown type "${rawType}". Use one of: all, ${SUBMISSION_TYPES.join(", ")}.`, {
      status: 400,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }
  const status = STATUSES.includes(rawStatus as Submission["status"]) ? (rawStatus as Submission["status"]) : undefined;
  const needle = (req.nextUrl.searchParams.get("q") ?? "").trim().slice(0, 100).toLowerCase();

  const rows = (await listSubmissions(type))
    .filter((s) => !status || s.status === status)
    .filter((s) => !needle || s.id.startsWith(needle) || JSON.stringify(s.data).toLowerCase().includes(needle))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  // Columns: fixed first, then every data key in the order it first appears
  const keys: string[] = [];
  for (const s of rows) {
    for (const [k] of displayEntries(s.data)) if (!keys.includes(k)) keys.push(k);
  }

  const header = ["Submitted", "Type", "Status", ...keys.map(fieldLabel), "ID"];
  const lines = [header.map(cell).join(",")];
  for (const s of rows) {
    const data = Object.fromEntries(displayEntries(s.data));
    lines.push(
      [
        s.createdAt,
        typeMeta[s.type]?.label ?? s.type,
        statusMeta[s.status]?.label ?? s.status,
        ...keys.map((k) => plainValue(k, data[k])),
        s.id,
      ]
        .map((v) => cell(String(v)))
        .join(","),
    );
  }

  const date = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/London" }).format(new Date());
  const filename = `bos-${type ?? "all"}${status ? `-${status}` : ""}${needle ? "-search" : ""}-submissions-${date}.csv`;

  // BOM so Excel opens UTF-8 (names, £ signs, emoji) correctly
  return new Response("﻿" + lines.join("\r\n") + "\r\n", {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="${filename}"`,
      "cache-control": "no-store",
      "x-robots-tag": "noindex",
    },
  });
}
