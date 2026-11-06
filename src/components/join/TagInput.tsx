"use client";

import { useId, useState, type KeyboardEvent } from "react";
import { Plus, X } from "lucide-react";
import { Field } from "@/components/forms/fields";
import { cn } from "@/lib/utils";

/**
 * Add-able tags (services, keywords). Type and press Enter or comma, or tap Add.
 * Backspace on an empty box removes the last tag.
 */
export function TagInput({
  id,
  label,
  hint,
  error,
  required,
  value,
  onChange,
  placeholder,
  max = 12,
  suggestions,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
  max?: number;
  suggestions?: string[];
}) {
  const [draft, setDraft] = useState("");
  const [announce, setAnnounce] = useState("");
  const inputId = `${id}-input`;
  const liveId = useId();
  const full = value.length >= max;

  function add(raw: string) {
    const parts = raw
      .split(",")
      .map((p) => p.trim().replace(/\s+/g, " ").slice(0, 60))
      .filter(Boolean);
    if (parts.length === 0) return;
    const next = [...value];
    const added: string[] = [];
    for (const p of parts) {
      if (next.length >= max) break;
      if (next.some((t) => t.toLowerCase() === p.toLowerCase())) continue;
      next.push(p);
      added.push(p);
    }
    onChange(next);
    setDraft("");
    setAnnounce(added.length ? `Added ${added.join(", ")}.` : "Already added.");
  }

  function remove(tag: string) {
    onChange(value.filter((t) => t !== tag));
    setAnnounce(`Removed ${tag}.`);
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      add(draft);
    } else if (e.key === "Backspace" && draft === "" && value.length > 0) {
      remove(value[value.length - 1]!);
    }
  }

  const unused = suggestions?.filter((s) => !value.some((v) => v.toLowerCase() === s.toLowerCase())).slice(0, 6);

  return (
    <div id={id}>
      <Field
        label={label}
        hint={hint}
        error={error}
        required={required}
        htmlFor={inputId}
      >
        <div
          className={cn(
            "rounded-2xl border-2 bg-white p-2 transition-colors focus-within:border-espresso",
            error ? "border-rose" : "border-espresso/15",
          )}
        >
          {value.length > 0 && (
            <ul className="flex flex-wrap gap-1.5 p-1" aria-label={`${label} added`}>
              {value.map((tag) => (
                <li key={tag}>
                  <span className="inline-flex items-center gap-1 rounded-full bg-espresso py-1 pr-1 pl-3 text-sm font-semibold text-cream">
                    {tag}
                    <button
                      type="button"
                      onClick={() => remove(tag)}
                      className="relative flex h-7 w-7 items-center justify-center rounded-full text-cream/80 before:absolute before:-inset-1.5 before:content-[''] hover:bg-cream/15 hover:text-cream"
                      aria-label={`Remove ${tag}`}
                    >
                      <X className="h-3.5 w-3.5" aria-hidden />
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          )}
          <div className="flex items-center gap-2">
            <input
              id={inputId}
              value={draft}
              onChange={(e) => {
                const v = e.target.value;
                if (v.includes(",")) add(v);
                else setDraft(v);
              }}
              onKeyDown={onKeyDown}
              onBlur={() => draft.trim() && add(draft)}
              disabled={full}
              placeholder={full ? `That's the maximum of ${max}` : placeholder}
              aria-invalid={!!error || undefined}
              aria-describedby={[hint ? `${inputId}-hint` : null, error ? `${inputId}-error` : null, liveId]
                .filter(Boolean)
                .join(" ")}
              className="h-10 min-w-0 flex-1 bg-transparent px-2 text-[15px] text-espresso placeholder:text-cocoa/50 focus:outline-none focus-visible:outline-none disabled:cursor-not-allowed"
            />
            <button
              type="button"
              onClick={() => add(draft)}
              disabled={full || !draft.trim()}
              className="inline-flex h-10 shrink-0 items-center gap-1 rounded-full border-2 border-espresso bg-sunflower px-3.5 font-heading text-sm font-bold text-espresso transition-all hover:-translate-y-0.5 hover:shadow-pop-sm disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:shadow-none"
            >
              <Plus className="h-4 w-4" aria-hidden />
              Add
            </button>
          </div>
        </div>
        <p className="flex justify-between gap-3 text-xs text-cocoa/80">
          <span>Press Enter or comma after each one.</span>
          <span>
            {value.length}/{max}
          </span>
        </p>
        <p id={liveId} aria-live="polite" className="sr-only">
          {announce}
        </p>
      </Field>
      {unused && unused.length > 0 && !full && (
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold text-cocoa/80">Ideas:</span>
          {unused.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => add(s)}
              className="inline-flex min-h-10 items-center gap-1 rounded-full border border-dashed border-espresso/30 px-3 text-xs font-semibold text-cocoa hover:border-espresso hover:bg-white"
            >
              <Plus className="h-3 w-3" aria-hidden />
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
