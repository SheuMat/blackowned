"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { z } from "zod";
import { ArrowRight, Lightbulb } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Checkbox, Honeypot, SelectInput, TextArea, TextInput } from "@/components/forms/fields";
import { FormSuccess } from "@/components/forms/FormStatus";
import { useSubmission } from "@/components/forms/useSubmission";
import { SubmitBar } from "@/components/join/FormBits";
import { emailField, optionalPhone, req, useFields } from "@/components/join/formKit";
import { FormCard } from "@/components/join/panels";
import { InstagramIcon } from "@/components/icons/SocialIcons";
import { site } from "@/lib/site";

/**
 * The /contact form. Posts to /api/applications as "contact".
 * Link here with ?subject=listing|suggest|story|press|events|partnership (and a
 * few aliases below) to pre-select the subject.
 */

const P = "contact";

export const subjects = [
  { value: "general", label: "General enquiry" },
  { value: "suggest", label: "Suggest a business" },
  { value: "listing", label: "Directory listing (claim/update)" },
  { value: "membership", label: "Membership" },
  { value: "events", label: "Events & stalls" },
  { value: "press", label: "Press & media" },
  { value: "partnership", label: "Partnerships" },
  { value: "story", label: "Share a story" },
  { value: "other", label: "Something else" },
] as const;

type SubjectId = (typeof subjects)[number]["value"];

/** ?subject= values other pages use, mapped to a subject */
const aliases: Record<string, SubjectId> = {
  general: "general",
  suggest: "suggest",
  recommend: "suggest",
  suggestion: "suggest",
  listing: "listing",
  claim: "listing",
  update: "listing",
  directory: "listing",
  membership: "membership",
  member: "membership",
  events: "events",
  event: "events",
  stall: "events",
  stalls: "events",
  press: "press",
  media: "press",
  partnership: "partnership",
  partner: "partnership",
  sponsor: "partnership",
  story: "story",
  launch: "story",
  other: "other",
};

export function subjectFromParam(v: string | null | undefined): SubjectId | "" {
  return (v && aliases[v.toLowerCase()]) || "";
}

/** A nudge shown under the subject when there's a quicker route */
const tips: Partial<Record<SubjectId, { text: ReactNode; href: string; cta: string }>> = {
  suggest: {
    text: "Know a Black-owned business that should be in the directory? Tell us below. If it's your own, adding it yourself is free and quicker.",
    href: "/join/business",
    cta: "Join the directory",
  },
  listing: {
    text: "Adding a new business? The directory form is quicker and it's free. Use this form to claim or update an existing listing.",
    href: "/join/business",
    cta: "Join the directory",
  },
  membership: {
    text: "Ready to sign up? Membership is free while we launch.",
    href: "/join/member",
    cta: "Become a member",
  },
  events: {
    text: "Want a stall at one of our markets? Apply directly with the stall form.",
    href: "/events/stall",
    cta: "Apply for a stall",
  },
  partnership: {
    text: "For sponsorship, advertising and other ways to work together, see what's on offer.",
    href: "/work-with-us",
    cta: "Work with us",
  },
};

const placeholders: Partial<Record<SubjectId, string>> = {
  suggest: "Their name, where they trade, and a link if they have one.",
  listing: "Which business is it, and what would you like us to add or change?",
  press: "Who you write for, what you're working on and your deadline.",
  story: "Opened something new, hit a milestone, or know a founder Sheffield should meet? Tell us about it.",
  events: "Which event is it about, and how can we help?",
  partnership: "Your organisation and what you have in mind.",
};

const schema = z.object({
  subject: z.string().min(1, "Choose what your message is about."),
  name: req("Please tell us your name."),
  email: emailField,
  phone: optionalPhone,
  business: z.string().trim().max(160),
  message: z
    .string()
    .trim()
    .min(10, "Tell us a little more: at least 10 characters.")
    .max(3000, "Please keep this under 3,000 characters."),
  consent: z.literal(true, { error: "Please tick this box so we can reply to you." }),
});

function makeInitial(subject: SubjectId | "", business = "") {
  return { subject: subject as string, name: "", email: "", phone: "", business, message: "", consent: false };
}

/**
 * Reads ?subject= (and ?business=<directory slug>, sent by "Claim or update
 * this listing" on profiles) and pre-fills them. Render inside <Suspense>.
 * Only known slugs are accepted, so the URL can't put arbitrary text in the form.
 */
export function ContactFormFromParams({ businessNames = {} }: { businessNames?: Record<string, string> }) {
  const params = useSearchParams();
  const subject = subjectFromParam(params.get("subject"));
  const slug = params.get("business") ?? "";
  const business = Object.hasOwn(businessNames, slug) ? businessNames[slug] : undefined;
  return <ContactForm initialSubject={subject} initialBusiness={business} />;
}

export function ContactForm({
  initialSubject = "",
  initialBusiness = "",
}: {
  initialSubject?: SubjectId | "";
  initialBusiness?: string;
}) {
  const { values, setValues, set, errors, validate } = useFields(makeInitial(initialSubject, initialBusiness));
  const { submit, state, setState, honeypot, setHoneypot, submitting } = useSubmission("contact");

  // Followed a link to a different ?subject= (or ?business=) while on the page: switch to it, keep what's typed
  const key = `${initialSubject}|${initialBusiness}`;
  const [seen, setSeen] = useState(key);
  if (key !== seen) {
    setSeen(key);
    setValues((v) => ({
      ...v,
      ...(initialSubject ? { subject: initialSubject } : {}),
      ...(initialBusiness ? { business: initialBusiness } : {}),
    }));
  }

  const subject = values.subject as SubjectId | "";
  const tip = subject ? tips[subject] : undefined;
  const subjectLabel = subjects.find((s) => s.value === subject)?.label;

  if (state.status === "success") {
    const first = values.name.trim().split(/\s+/)[0];
    return (
      <Sent
        title={`Thanks${first ? `, ${first}` : ""}! Message received.`}
        email={values.email.trim()}
        onReset={() => {
          setValues(makeInitial(""));
          setState({ status: "idle" });
        }}
      />
    );
  }

  return (
    <FormCard>
      <form
        noValidate
        aria-labelledby="contact-form-title"
        className="relative"
        onSubmit={async (ev) => {
          ev.preventDefault();
          const data = validate(schema, P);
          if (!data) return;
          await submit({ ...data, subjectLabel, source: "/contact" });
        }}
      >
        <Honeypot value={honeypot} onChange={setHoneypot} />
        <h2 id="contact-form-title" className="font-heading text-2xl font-extrabold text-espresso sm:text-3xl">
          Send us a message
        </h2>
        <p className="mt-1 text-sm text-cocoa">
          Fields marked <span className="text-rose-ink" aria-hidden>*</span>
          <span className="sr-only">with an asterisk</span> are required.
        </p>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <SelectInput
            id={`${P}-subject`}
            label="What's it about?"
            required
            placeholder="Choose a subject"
            options={[...subjects]}
            value={values.subject}
            onChange={(e) => set("subject", e.target.value)}
            error={errors.subject}
            wrapperClassName="sm:col-span-2"
          />
          {/* The live region is always mounted so a new tip is announced when the subject changes */}
          <div aria-live="polite" className={tip ? "sm:col-span-2" : "sr-only"}>
            {tip && (
              <div className="flex flex-col gap-3 rounded-2xl border-2 border-sunflower bg-sunflower/20 px-4 py-3 text-sm text-espresso sm:flex-row sm:items-center sm:justify-between">
                <p className="flex items-start gap-2">
                  <Lightbulb className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                  <span>{tip.text}</span>
                </p>
                <Link
                  href={tip.href}
                  className="inline-flex min-h-11 shrink-0 items-center gap-1.5 font-heading font-bold underline decoration-2 underline-offset-4"
                >
                  {tip.cta}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>
            )}
          </div>
          <TextInput
            id={`${P}-name`}
            label="Your name"
            required
            autoComplete="name"
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
            error={errors.name}
          />
          <TextInput
            id={`${P}-email`}
            label="Email"
            type="email"
            required
            autoComplete="email"
            value={values.email}
            onChange={(e) => set("email", e.target.value)}
            error={errors.email}
          />
          <TextInput
            id={`${P}-phone`}
            label="Phone"
            type="tel"
            autoComplete="tel"
            hint="Only if you'd like a call back."
            value={values.phone}
            onChange={(e) => set("phone", e.target.value)}
            error={errors.phone}
          />
          <TextInput
            id={`${P}-business`}
            label="Business or organisation"
            autoComplete="organization"
            maxLength={160}
            hint="If your message is about one."
            value={values.business}
            onChange={(e) => set("business", e.target.value)}
            error={errors.business}
          />
          <TextArea
            id={`${P}-message`}
            label="Your message"
            required
            rows={6}
            maxLength={3000}
            placeholder={(subject && placeholders[subject]) || "How can we help?"}
            value={values.message}
            onChange={(e) => set("message", e.target.value)}
            error={errors.message}
            wrapperClassName="sm:col-span-2"
          />
          <Checkbox
            id={`${P}-consent`}
            checked={values.consent}
            onChange={(e) => set("consent", e.target.checked)}
            error={errors.consent}
            aria-invalid={!!errors.consent || undefined}
            className="sm:col-span-2"
            label={
              <strong className="text-espresso">
                I&apos;m happy for Black Owned Sheffield to store these details and use them to reply to me.
                <span className="ml-0.5 text-rose-ink" aria-hidden>
                  *
                </span>
              </strong>
            }
          />
        </div>

        <SubmitBar
          className="mt-8"
          label="Send message"
          submitting={submitting}
          error={state.status === "error" ? state.error : undefined}
          errorCount={Object.keys(errors).length}
          note={
            <>
              We&apos;re a small team. We&apos;ll reply within {site.replyTime}. Read our{" "}
              <Link href="/privacy" className="font-semibold text-rose-ink underline underline-offset-2">
                privacy notice
              </Link>
              .
            </>
          }
        />
      </form>
    </FormCard>
  );
}

function Sent({ title, email, onReset }: { title: string; email: string; onReset: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.focus({ preventScroll: true });
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }, []);
  return (
    <div ref={ref} tabIndex={-1} className="scroll-mt-28 focus:outline-none">
      <FormSuccess
        title={title}
        action={
          <div className="flex flex-wrap justify-center gap-3">
            <ButtonLink
              href={site.socials.instagram}
              variant="primary"
              icon={<InstagramIcon size={18} />}
              aria-label={`Follow ${site.instagramHandle} on Instagram (opens in a new tab)`}
            >
              Follow us
            </ButtonLink>
            <Button type="button" variant="outline" onClick={onReset}>
              Send another message
            </Button>
          </div>
        }
      >
        <p>
          We&apos;ll reply to <strong className="text-espresso">{email || "you"}</strong> within {site.replyTime}. If
          it&apos;s urgent, a DM on Instagram is usually quickest.
        </p>
      </FormSuccess>
    </div>
  );
}
