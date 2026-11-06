"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { FormError } from "@/components/forms/FormStatus";
import { Honeypot } from "@/components/forms/fields";
import { useSubmission } from "@/components/forms/useSubmission";

/** "Send me the impact report" sign-up. Goes in as a newsletter submission tagged impact-report. */
export function ReportSignup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const { submit, state, honeypot, setHoneypot, submitting } = useSubmission("newsletter");

  if (state.status === "success") {
    return (
      <div role="status" className="flex items-start gap-3 rounded-2xl border-2 border-cream/20 bg-cream/5 p-5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pink text-espresso">
          <Check className="h-5 w-5" aria-hidden />
        </span>
        <div>
          <p className="font-heading text-lg font-bold text-cream">You&apos;re on the list.</p>
          <p className="mt-1 text-sm text-cream/80">
            We&apos;ll email you the report as soon as it&apos;s published{name.trim() ? `, ${name.trim().split(/\s+/)[0]}` : ""}.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form
      className="relative"
      onSubmit={async (e) => {
        e.preventDefault();
        await submit({ name: name.trim(), email: email.trim(), interest: "impact-report", source: "impact-page" });
      }}
    >
      <Honeypot value={honeypot} onChange={setHoneypot} />
      <div className="grid gap-3 sm:grid-cols-[1fr_1.4fr]">
        <div>
          <label htmlFor="report-name" className="mb-1.5 block font-heading text-sm font-bold text-cream">
            First name <span className="text-xs font-medium text-cream/60">(optional)</span>
          </label>
          <input
            id="report-name"
            autoComplete="given-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-12 w-full rounded-2xl border-2 border-cream/20 bg-cream/5 px-4 text-[15px] text-cream placeholder:text-cream/40 focus:border-pink focus:outline-none focus:ring-4 focus:ring-pink/30"
          />
        </div>
        <div>
          <label htmlFor="report-email" className="mb-1.5 block font-heading text-sm font-bold text-cream">
            Email address <span className="text-pink" aria-hidden>*</span>
          </label>
          <input
            id="report-email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 w-full rounded-2xl border-2 border-cream/20 bg-cream/5 px-4 text-[15px] text-cream placeholder:text-cream/40 focus:border-pink focus:outline-none focus:ring-4 focus:ring-pink/30"
          />
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-cream/70">
          One email when the report is out, plus our occasional newsletter. Unsubscribe any time.{" "}
          <Link href="/privacy" className="font-semibold text-pink underline underline-offset-2">
            Privacy
          </Link>
        </p>
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full border-2 border-espresso bg-pink px-6 font-heading font-bold text-espresso shadow-[3px_3px_0_0_#f6bd3c] transition-all hover:-translate-y-0.5 hover:bg-sunflower disabled:opacity-60"
        >
          {submitting ? "Signing you up…" : "Send me the report"}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </button>
      </div>
      {state.status === "error" && <FormError message={state.error} className="mt-4" />}
    </form>
  );
}
