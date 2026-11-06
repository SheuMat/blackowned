"use client";

import { CalendarClock, Clock, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { DAY_NAMES, type DayHours, type HoursValue } from "./hours";

export type { DayHours, HoursValue } from "./hours";

const modes = [
  { value: "set", label: "Regular hours", Icon: Clock },
  { value: "appointment", label: "By appointment", Icon: CalendarClock },
  { value: "none", label: "No set hours / online", Icon: Globe },
] as const;

export function HoursEditor({
  id,
  value,
  onChange,
  errors = {},
}: {
  id: string;
  value: HoursValue;
  onChange: (v: HoursValue) => void;
  errors?: Record<string, string>;
}) {
  function setDay(index: number, patch: Partial<DayHours>) {
    const targets = value.sameWeekdays && index < 5 ? [0, 1, 2, 3, 4] : [index];
    onChange({
      ...value,
      days: value.days.map((d, i) => (targets.includes(i) ? { ...d, ...patch } : d)),
    });
  }

  function toggleSame(on: boolean) {
    const mon = value.days[0]!;
    onChange({
      ...value,
      sameWeekdays: on,
      days: on ? value.days.map((d, i) => (i < 5 ? { ...mon } : d)) : value.days,
    });
  }

  const rows = value.sameWeekdays
    ? [
        { index: 0, label: "Monday to Friday" },
        { index: 5, label: "Saturday" },
        { index: 6, label: "Sunday" },
      ]
    : DAY_NAMES.map((label, index) => ({ index, label }));

  return (
    <fieldset id={id} className="flex flex-col gap-4">
      <legend className="mb-1.5 font-heading text-sm font-bold text-espresso">
        Opening hours<span className="ml-0.5 text-rose" aria-hidden>*</span>
      </legend>
      <div className="grid gap-2 sm:grid-cols-3" role="radiogroup" aria-label="How do customers visit you?">
        {modes.map(({ value: m, label, Icon }) => {
          const checked = value.mode === m;
          return (
            <label
              key={m}
              className={cn(
                "flex min-h-12 cursor-pointer items-center gap-2.5 rounded-2xl border-2 px-4 py-3 text-sm font-semibold transition-all has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-rose",
                checked ? "border-espresso bg-espresso text-cream" : "border-espresso/15 bg-white text-cocoa hover:border-espresso/50",
              )}
            >
              <input
                type="radio"
                name={`${id}-mode`}
                value={m}
                checked={checked}
                onChange={() => onChange({ ...value, mode: m })}
                className="sr-only"
              />
              <Icon className="h-4 w-4 shrink-0" aria-hidden />
              {label}
            </label>
          );
        })}
      </div>

      {value.mode === "set" && (
        <div className="rounded-2xl border-2 border-espresso/15 bg-white p-3 sm:p-4">
          <label className="flex min-h-11 cursor-pointer items-center gap-3 px-1 text-sm font-semibold text-espresso">
            <input
              type="checkbox"
              checked={value.sameWeekdays}
              onChange={(e) => toggleSame(e.target.checked)}
              className="h-5 w-5 cursor-pointer accent-espresso"
            />
            Same hours every weekday
          </label>
          <ul className="mt-2 divide-y divide-espresso/10">
            {rows.map(({ index, label }) => {
              const d = value.days[index]!;
              const err = errors[String(index)];
              const rowId = `${id}-day-${index}`;
              return (
                <li key={index} className="py-3">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <p id={`${rowId}-label`} className="w-full font-heading text-sm font-bold text-espresso sm:w-36">
                      {label}
                    </p>
                    <div className={cn("flex flex-1 items-center gap-2", d.closed && "opacity-40")}>
                      <label className="sr-only" htmlFor={`${rowId}-open`}>
                        {label} opening time
                      </label>
                      <input
                        id={`${rowId}-open`}
                        type="time"
                        value={d.open}
                        disabled={d.closed}
                        onChange={(e) => setDay(index, { open: e.target.value })}
                        aria-invalid={!!err || undefined}
                        className="h-11 min-w-0 flex-1 rounded-xl border-2 border-espresso/15 bg-cream px-2 text-sm text-espresso focus:border-espresso focus:outline-none aria-[invalid=true]:border-rose sm:max-w-32"
                      />
                      <span aria-hidden className="text-sm text-cocoa">to</span>
                      <label className="sr-only" htmlFor={`${rowId}-close`}>
                        {label} closing time
                      </label>
                      <input
                        id={`${rowId}-close`}
                        type="time"
                        value={d.close}
                        disabled={d.closed}
                        onChange={(e) => setDay(index, { close: e.target.value })}
                        aria-invalid={!!err || undefined}
                        className="h-11 min-w-0 flex-1 rounded-xl border-2 border-espresso/15 bg-cream px-2 text-sm text-espresso focus:border-espresso focus:outline-none aria-[invalid=true]:border-rose sm:max-w-32"
                      />
                    </div>
                    <label className="flex min-h-11 cursor-pointer items-center gap-2 text-sm font-semibold text-cocoa">
                      <input
                        type="checkbox"
                        checked={d.closed}
                        onChange={(e) =>
                          setDay(
                            index,
                            e.target.checked
                              ? { closed: true }
                              : { closed: false, open: d.open || "09:00", close: d.close || "17:00" },
                          )
                        }
                        className="h-5 w-5 cursor-pointer accent-espresso"
                      />
                      Closed<span className="sr-only"> on {label}</span>
                    </label>
                  </div>
                  {err && (
                    <p role="alert" className="mt-1.5 text-xs font-semibold text-rose-ink">
                      {err}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
          {errors._all && (
            <p role="alert" className="mt-1 px-1 text-xs font-semibold text-rose-ink">
              {errors._all}
            </p>
          )}
        </div>
      )}

      {value.mode !== "none" && (
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${id}-note`} className="font-heading text-sm font-bold text-espresso">
            {value.mode === "appointment" ? "How do people book?" : "Anything to add?"}
            <span className="ml-1.5 text-xs font-medium text-cocoa/60">(optional)</span>
          </label>
          <input
            id={`${id}-note`}
            value={value.note}
            maxLength={140}
            onChange={(e) => onChange({ ...value, note: e.target.value })}
            placeholder={
              value.mode === "appointment"
                ? "e.g. Message us on Instagram or book online"
                : "e.g. Late opening on Thursdays in December"
            }
            className="h-12 w-full rounded-2xl border-2 border-espresso/15 bg-white px-4 text-[15px] text-espresso placeholder:text-cocoa/50 focus:border-espresso focus:outline-none"
          />
        </div>
      )}
    </fieldset>
  );
}
