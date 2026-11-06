"use client";

import { useId, type ComponentProps, type ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Form primitives. Every form on the site uses these so they look and behave
 * the same. Pair with `useSubmission` from ./useSubmission.
 */

const control =
  "w-full rounded-2xl border-2 border-espresso/15 bg-white px-4 py-3 text-[15px] text-espresso placeholder:text-cocoa/50 transition-colors focus:border-espresso focus:outline-none focus:ring-4 focus:ring-pink/45 focus-visible:outline-none aria-[invalid=true]:border-rose";

export function Field({
  label,
  hint,
  error,
  required,
  children,
  className,
  htmlFor,
}: {
  label: ReactNode;
  hint?: ReactNode;
  error?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
  htmlFor?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={htmlFor} className="font-heading text-sm font-bold text-espresso">
        {label}
        {required ? <span className="ml-0.5 text-rose-ink" aria-hidden>*</span> : <span className="ml-1.5 text-xs font-medium text-cocoa/80">(optional)</span>}
      </label>
      {hint && (
        <p id={htmlFor ? `${htmlFor}-hint` : undefined} className="-mt-0.5 text-xs text-cocoa/80">
          {hint}
        </p>
      )}
      {children}
      {error && (
        <p id={htmlFor ? `${htmlFor}-error` : undefined} role="alert" className="text-xs font-semibold text-rose-ink">
          {error}
        </p>
      )}
    </div>
  );
}

/** Joins a caller's aria-describedby with the field's hint and error ids */
function describedBy(fid: string, hint: ReactNode, error: string | undefined, own?: string) {
  return [own, hint ? `${fid}-hint` : null, error ? `${fid}-error` : null].filter(Boolean).join(" ") || undefined;
}

type InputProps = ComponentProps<"input"> & { label: ReactNode; hint?: ReactNode; error?: string; wrapperClassName?: string };

export function TextInput({ label, hint, error, required, wrapperClassName, className, id, ...rest }: InputProps) {
  const autoId = useId();
  const fid = id ?? autoId;
  return (
    <Field label={label} hint={hint} error={error} required={required} htmlFor={fid} className={wrapperClassName}>
      <input
        id={fid}
        required={required}
        aria-invalid={!!error || undefined}
        className={cn(control, "h-12", className)}
        {...rest}
        aria-describedby={describedBy(fid, hint, error, rest["aria-describedby"])}
      />
    </Field>
  );
}

type TextareaProps = ComponentProps<"textarea"> & { label: ReactNode; hint?: ReactNode; error?: string; wrapperClassName?: string };

export function TextArea({ label, hint, error, required, wrapperClassName, className, id, rows = 4, ...rest }: TextareaProps) {
  const autoId = useId();
  const fid = id ?? autoId;
  return (
    <Field label={label} hint={hint} error={error} required={required} htmlFor={fid} className={wrapperClassName}>
      <textarea
        id={fid}
        rows={rows}
        required={required}
        aria-invalid={!!error || undefined}
        className={cn(control, "resize-y leading-relaxed", className)}
        {...rest}
        aria-describedby={describedBy(fid, hint, error, rest["aria-describedby"])}
      />
    </Field>
  );
}

type SelectProps = ComponentProps<"select"> & {
  label: ReactNode;
  hint?: ReactNode;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  wrapperClassName?: string;
};

export function SelectInput({ label, hint, error, required, options, placeholder, wrapperClassName, className, id, ...rest }: SelectProps) {
  const autoId = useId();
  const fid = id ?? autoId;
  return (
    <Field label={label} hint={hint} error={error} required={required} htmlFor={fid} className={wrapperClassName}>
      <select
        id={fid}
        required={required}
        aria-invalid={!!error || undefined}
        className={cn(
          control,
          "h-12 appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2216%22%20height%3D%2216%22%20fill%3D%22none%22%20stroke%3D%22%232a1910%22%20stroke-width%3D%222.5%22%20viewBox%3D%220%200%2024%2024%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22/%3E%3C/svg%3E')] bg-[length:16px] bg-[right_1rem_center] bg-no-repeat pr-10",
          className,
        )}
        {...rest}
        aria-describedby={describedBy(fid, hint, error, rest["aria-describedby"])}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

/** Pill-style multi-select checkboxes */
export function ChoiceChips({
  label,
  hint,
  error,
  required,
  name,
  options,
  value,
  onChange,
  multiple = true,
  className,
}: {
  label: ReactNode;
  hint?: ReactNode;
  error?: string;
  required?: boolean;
  name: string;
  options: { value: string; label: string }[];
  value: string[];
  onChange: (v: string[]) => void;
  multiple?: boolean;
  className?: string;
}) {
  const gid = useId();
  return (
    <fieldset
      className={cn("flex flex-col gap-2", className)}
      aria-describedby={[hint ? `${gid}-hint` : null, error ? `${gid}-error` : null].filter(Boolean).join(" ") || undefined}
    >
      <legend className="mb-1.5 font-heading text-sm font-bold text-espresso">
        {label}
        {required ? <span className="ml-0.5 text-rose-ink" aria-hidden>*</span> : <span className="ml-1.5 text-xs font-medium text-cocoa/80">(optional)</span>}
      </legend>
      {hint && (
        <p id={`${gid}-hint`} className="-mt-1 mb-1 text-xs text-cocoa/80">
          {hint}
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const checked = value.includes(o.value);
          return (
            <label
              key={o.value}
              className={cn(
                "inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-full border-2 px-4 py-2 text-sm font-semibold transition-all has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-rose",
                checked ? "border-espresso bg-espresso text-cream" : "border-espresso/15 bg-white text-cocoa hover:border-espresso/50",
              )}
            >
              <input
                type={multiple ? "checkbox" : "radio"}
                name={name}
                value={o.value}
                checked={checked}
                onChange={() =>
                  onChange(
                    multiple ? (checked ? value.filter((v) => v !== o.value) : [...value, o.value]) : [o.value],
                  )
                }
                className="sr-only"
              />
              {checked && <Check className="h-3.5 w-3.5" aria-hidden />}
              {o.label}
            </label>
          );
        })}
      </div>
      {error && (
        <p id={`${gid}-error`} role="alert" className="text-xs font-semibold text-rose-ink">
          {error}
        </p>
      )}
    </fieldset>
  );
}

export function Checkbox({
  label,
  error,
  className,
  id,
  ...rest
}: Omit<ComponentProps<"input">, "type"> & { label: ReactNode; error?: string }) {
  const autoId = useId();
  const fid = id ?? autoId;
  return (
    <div className={className}>
      <label htmlFor={fid} className="flex cursor-pointer items-start gap-3 text-sm text-cocoa">
        <input
          id={fid}
          type="checkbox"
          aria-invalid={!!error || undefined}
          className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded-md border-2 border-espresso accent-espresso"
          {...rest}
          aria-describedby={[rest["aria-describedby"], error ? `${fid}-error` : null].filter(Boolean).join(" ") || undefined}
        />
        <span>{label}</span>
      </label>
      {error && (
        <p id={`${fid}-error`} role="alert" className="mt-1 text-xs font-semibold text-rose-ink">
          {error}
        </p>
      )}
    </div>
  );
}

/** Hidden honeypot. Include once inside every <form>. */
export function Honeypot({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Leave this empty
        <input tabIndex={-1} autoComplete="off" value={value} onChange={(e) => onChange(e.target.value)} name="website" />
      </label>
    </div>
  );
}
