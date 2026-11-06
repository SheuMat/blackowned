"use client";

import { useRef, useState, type MouseEvent } from "react";
import { ArrowRight, Check, HeartHandshake, Send, Sparkles } from "lucide-react";
import { Button, buttonClasses } from "@/components/ui/Button";
import { Honeypot, SelectInput, TextArea, TextInput } from "@/components/forms/fields";
import { FormError, FormSuccess } from "@/components/forms/FormStatus";
import { useSubmission } from "@/components/forms/useSubmission";
import { cn } from "@/lib/utils";
import { packageOptions, spotlightPackages, type SpotlightPackage } from "./packages";

const cardTone: Record<SpotlightPackage["id"], string> = {
  community: "bg-white text-espresso shadow-pop-pink",
  sponsored: "bg-espresso text-cream",
  bundle: "bg-cream text-espresso",
};

/**
 * Spotlight package cards plus the enquiry form they point to.
 * "Register interest" pre-selects the package and moves focus to the form.
 */
export function SpotlightPackages() {
  const formRef = useRef<HTMLFormElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const [pkg, setPkg] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const { submit, state, setState, honeypot, setHoneypot, submitting } = useSubmission("spotlight");

  function chooseAndGo(e: MouseEvent<HTMLAnchorElement>, id: string) {
    e.preventDefault();
    setPkg(id);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const target = formRef.current ?? document.getElementById("enquire");
    // window.scrollTo rather than scrollIntoView, which can also nudge clipped ancestors sideways
    if (target) {
      const top = target.getBoundingClientRect().top + window.scrollY - 104;
      window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
    }
    firstFieldRef.current?.focus({ preventScroll: true });
  }

  function reset() {
    setBusinessName("");
    setName("");
    setEmail("");
    setMessage("");
    setPkg("");
    setState({ status: "idle" });
  }

  return (
    <div>
      <ul className="grid gap-6 lg:grid-cols-3">
        {spotlightPackages.map((p) => {
          const dark = p.id === "sponsored";
          return (
            <li key={p.id} className="h-full">
              <article
                className={cn(
                  "relative flex h-full flex-col rounded-[1.75rem] border-2 border-espresso p-6 sm:p-7",
                  cardTone[p.id],
                )}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold",
                      p.status === "available" ? "bg-forest text-cream" : dark ? "bg-cream/15 text-cream" : "bg-espresso/10 text-cocoa",
                    )}
                  >
                    {p.status === "available" && <span className="h-1.5 w-1.5 rounded-full bg-cream" aria-hidden />}
                    {p.statusLabel}
                  </span>
                  {p.sponsored && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-sunflower px-2.5 py-1 text-xs font-bold text-espresso">
                      <Sparkles className="h-3 w-3" aria-hidden /> Sponsored
                    </span>
                  )}
                </div>
                {p.id === "community" && (
                  <span className="absolute -top-4 right-5 inline-block rotate-3 rounded-xl border-2 border-espresso bg-pink px-3 py-0.5 font-display text-sm text-espresso shadow-pop-sm">
                    Start here
                  </span>
                )}
                <h3 className="mt-5 font-heading text-2xl font-extrabold leading-tight">{p.name}</h3>
                <p className="mt-3 flex flex-wrap items-baseline gap-x-2">
                  <span className={cn("font-display text-4xl leading-none", dark ? "text-pink" : "text-espresso")}>
                    {p.price}
                  </span>
                  <span className={cn("text-sm font-semibold", dark ? "text-cream/70" : "text-cocoa")}>{p.priceNote}</span>
                </p>
                <p className={cn("mt-4 text-[15px] leading-relaxed", dark ? "text-cream/80" : "text-cocoa")}>{p.summary}</p>
                <ul className="mt-5 space-y-2.5">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-[15px]">
                      <span
                        className={cn(
                          "mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                          dark ? "bg-pink text-espresso" : "bg-espresso text-cream",
                        )}
                      >
                        <Check className="h-3 w-3" aria-hidden />
                      </span>
                      <span className={dark ? "text-cream/90" : "text-cocoa"}>{f}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-7">
                  {p.cta.target === "nominate" ? (
                    <a href="#nominate" className={buttonClasses({ variant: "pink", className: "w-full" })}>
                      {p.cta.label}
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </a>
                  ) : (
                    <a
                      href="#enquire"
                      onClick={(e) => chooseAndGo(e, p.id)}
                      className={buttonClasses({ variant: dark ? "cream" : "outline", className: "w-full" })}
                    >
                      {p.cta.label}
                      <span className="sr-only"> in the {p.name}</span>
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </a>
                  )}
                </div>
              </article>
            </li>
          );
        })}
      </ul>

      <div id="enquire" className="mt-14 grid scroll-mt-28 gap-10 lg:mt-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
        <div>
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-full border-2 border-espresso bg-sunflower">
            <HeartHandshake className="h-6 w-6 text-espresso" aria-hidden />
          </span>
          <h3 className="mt-5 font-heading text-3xl font-extrabold leading-tight text-espresso sm:text-4xl">
            Why sponsored spotlights?
          </h3>
          <div className="mt-4 space-y-4 text-lg leading-relaxed text-cocoa">
            <p>
              Black Owned Sheffield is a Community Interest Company. When sponsored spotlights launch, the money they
              bring in will help fund the work we do for free: promoting Black-owned businesses, the Community Spotlight
              and support for people starting out.
            </p>
            <p>
              The free Community Spotlight isn&apos;t going anywhere. And any paid feature will always carry a clear
              &ldquo;Sponsored&rdquo; label, so readers know the difference.
            </p>
          </div>
          <p className="mt-6 rounded-2xl border-2 border-espresso/15 bg-white/70 px-4 py-3 text-sm text-cocoa">
            Not ready to talk packages? Register your interest and we&apos;ll get in touch when pricing is set. No
            commitment.
          </p>
        </div>

        <div>
          {state.status === "success" ? (
            <FormSuccess
              title="Thanks, we've got it"
              action={
                <Button type="button" variant="outline" onClick={reset}>
                  Send another enquiry
                </Button>
              }
            >
              <p>
                We&apos;ll reply to {email || "you"} soon. In the meantime, follow us on Instagram to see the latest
                Spotlight.
              </p>
            </FormSuccess>
          ) : (
            <form
              ref={formRef}
              aria-labelledby="enquire-heading"
              className="relative rounded-[1.75rem] border-2 border-espresso bg-white p-6 shadow-pop sm:p-8"
              onSubmit={async (e) => {
                e.preventDefault();
                await submit({
                  kind: "package-enquiry",
                  businessName,
                  name,
                  email,
                  package: pkg,
                  packageLabel: packageOptions.find((o) => o.value === pkg)?.label,
                  message,
                  source: "/spotlight#packages",
                });
              }}
            >
              <Honeypot value={honeypot} onChange={setHoneypot} />
              <h3 id="enquire-heading" className="font-heading text-2xl font-extrabold text-espresso">
                Ask about a Spotlight package
              </h3>
              <p className="mt-1 text-sm text-cocoa">Tell us a little about your business and we&apos;ll be in touch.</p>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <TextInput
                  ref={firstFieldRef}
                  id="spotlight-enquiry-business"
                  label="Business name"
                  required
                  autoComplete="organization"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  wrapperClassName="sm:col-span-2"
                />
                <TextInput
                  label="Your name"
                  required
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <TextInput
                  label="Email"
                  type="email"
                  required
                  autoComplete="email"
                  inputMode="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <SelectInput
                  label="Package you're interested in"
                  required
                  placeholder="Choose a package"
                  options={packageOptions}
                  value={pkg}
                  onChange={(e) => setPkg(e.target.value)}
                  wrapperClassName="sm:col-span-2"
                />
                <TextArea
                  label="Anything we should know?"
                  hint="Timing, a launch you're planning, or questions about how it works."
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  wrapperClassName="sm:col-span-2"
                />
              </div>

              <FormError message={state.status === "error" ? state.error : undefined} className="mt-5" />

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <Button type="submit" variant="primary" size="lg" disabled={submitting} iconRight={<Send className="h-4 w-4" aria-hidden />}>
                  {submitting ? "Sending…" : "Send enquiry"}
                </Button>
                <p className="text-xs text-cocoa/80">We&apos;ll only use your details to reply to this enquiry.</p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
