"use client";

import { useId, useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { Honeypot } from "./fields";
import { useSubmission } from "./useSubmission";
import { cn } from "@/lib/utils";

export function NewsletterForm({
  className,
  dark,
  source = "footer",
}: {
  className?: string;
  dark?: boolean;
  /** Where the sign-up came from, stored with the submission */
  source?: string;
}) {
  const [email, setEmail] = useState("");
  const id = useId();
  const inputId = `${id}-email`;
  const errorId = `${id}-error`;
  const { submit, state, honeypot, setHoneypot, submitting } = useSubmission("newsletter");

  if (state.status === "success") {
    return (
      <p className={cn("inline-flex items-center gap-2 font-semibold", dark ? "text-pink" : "text-teal", className)} role="status">
        <Check className="h-5 w-5" aria-hidden /> You&apos;re on the list. Welcome!
      </p>
    );
  }

  return (
    <form
      className={cn("relative", className)}
      onSubmit={async (e) => {
        e.preventDefault();
        await submit({ email, source });
      }}
    >
      <Honeypot value={honeypot} onChange={setHoneypot} />
      <label htmlFor={inputId} className="sr-only">
        Email address
      </label>
      <div
        className={cn(
          "flex items-center gap-1 rounded-full border-2 p-1",
          "transition-colors",
          dark
            ? "border-cream/20 bg-cream/5 focus-within:border-pink"
            : "border-espresso bg-white focus-within:ring-4 focus-within:ring-pink/45",
        )}
      >
        <input
          id={inputId}
          type="email"
          name="email"
          autoComplete="email"
          required
          aria-invalid={state.status === "error" || undefined}
          aria-describedby={state.status === "error" ? errorId : undefined}
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={cn(
            "h-11 min-w-0 flex-1 bg-transparent px-4 text-[15px] focus:outline-none focus-visible:outline-none",
            dark ? "text-cream placeholder:text-cream/55" : "text-espresso placeholder:text-cocoa/50",
          )}
        />
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-full bg-pink px-5 font-heading text-sm font-bold text-espresso transition-colors hover:bg-sunflower disabled:opacity-60"
        >
          {submitting ? "Joining…" : "Sign up"}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </button>
      </div>
      {state.status === "error" && (
        <p id={errorId} role="alert" className={cn("mt-2 text-xs font-semibold", dark ? "text-pink" : "text-rose-ink")}>
          {state.error}
        </p>
      )}
    </form>
  );
}
