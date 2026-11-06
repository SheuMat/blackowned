/**
 * Opening-hours helpers shared by the HoursEditor, the business application
 * payload and the admin dashboard. Pure functions: safe on server and client.
 */

export type DayHours = { open: string; close: string; closed: boolean };
export type HoursValue = {
  mode: "set" | "appointment" | "none";
  /** Monday to Friday share one set of hours */
  sameWeekdays: boolean;
  /** 0 = Monday … 6 = Sunday (matches OpeningHours in content/types) */
  days: DayHours[];
  note: string;
};

export const DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export const defaultHours: HoursValue = {
  mode: "set",
  sameWeekdays: true,
  days: [
    ...Array.from({ length: 5 }, () => ({ open: "09:00", close: "17:00", closed: false })),
    { open: "10:00", close: "16:00", closed: false },
    { open: "", close: "", closed: true },
  ],
  note: "",
};

/** Returns an error message per invalid day index (or "_mode") */
export function validateHours(h: HoursValue): Record<string, string> {
  const errs: Record<string, string> = {};
  if (h.mode !== "set") return errs;
  h.days.forEach((d, i) => {
    if (d.closed) return;
    // Tuesday to Friday copy Monday's row when "same every weekday" is on: report it once
    if (h.sameWeekdays && i > 0 && i < 5) return;
    if (!d.open || !d.close) errs[i] = "Add opening and closing times, or mark as closed.";
    else if (d.close <= d.open && d.close !== "00:00") errs[i] = "Closing time should be after opening time.";
  });
  if (h.days.every((d) => d.closed)) errs._all = "You've marked every day as closed. Try “By appointment” instead?";
  return errs;
}

/** "Mon–Fri 09:00–17:00 · Sat 10:00–16:00 · Sun closed" */
export function summariseHours(h: HoursValue) {
  if (h.mode === "appointment") return `By appointment${h.note ? ` (${h.note})` : ""}`;
  if (h.mode === "none") return "No set hours";
  const short = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const fmt = (d: DayHours) => (d.closed ? "closed" : `${d.open}–${d.close}`);
  const parts: string[] = [];
  let i = 0;
  while (i < 7) {
    let j = i;
    while (j + 1 < 7 && fmt(h.days[j + 1]!) === fmt(h.days[i]!)) j++;
    parts.push(`${j > i ? `${short[i]}–${short[j]}` : short[i]} ${fmt(h.days[i]!)}`);
    i = j + 1;
  }
  return parts.join(" · ") + (h.note ? ` (${h.note})` : "");
}
