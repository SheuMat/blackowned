"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { z } from "zod";
import { ArrowRight } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Checkbox, ChoiceChips, Honeypot, SelectInput, TextArea, TextInput } from "@/components/forms/fields";
import { FormSuccess } from "@/components/forms/FormStatus";
import { useSubmission } from "@/components/forms/useSubmission";
import { SubmitBar } from "@/components/join/FormBits";
import { emailField, optionalPhone, req, useFields } from "@/components/join/formKit";
import { FormCard, FormSection } from "@/components/join/panels";
import { site } from "@/lib/site";
import { budgetOptions, interestOptions, timelineOptions } from "./offerings";

/**
 * Enquiry form for /work-with-us. Posts to /api/applications as "work-with-us".
 * `?interest=<offering id>` (set by the "Ask about this" links on the page)
 * ticks that interest for you.
 */

const P = "wwu";
const validInterest = new Set(interestOptions.map((o) => o.value));

const schema = z.object({
  organisation: req("What's your organisation called?"),
  name: req("Please tell us your name."),
  role: z.string().trim().max(120),
  email: emailField,
  phone: optionalPhone,
  interests: z.array(z.string()).min(1, "Pick at least one thing you're interested in."),
  budget: z.string(),
  timeline: z.string(),
  message: z
    .string()
    .trim()
    .min(20, "Tell us a little more: at least 20 characters.")
    .max(2000, "Please keep this under 2,000 characters."),
  consent: z.literal(true, { error: "Please tick this box so we can reply to your enquiry." }),
});

function makeInitial(interest?: string) {
  return {
    organisation: "",
    name: "",
    role: "",
    email: "",
    phone: "",
    interests: interest ? [interest] : ([] as string[]),
    budget: "",
    timeline: "",
    message: "",
    consent: false,
  };
}

/** Reads ?interest= and passes it on. Render inside <Suspense>. */
export function WorkWithUsFormFromParams() {
  const raw = useSearchParams().get("interest") ?? undefined;
  return <WorkWithUsForm preselect={raw && validInterest.has(raw) ? raw : undefined} />;
}

export function WorkWithUsForm({ preselect }: { preselect?: string }) {
  const { values, setValues, set, errors, validate } = useFields(makeInitial(preselect));
  const { submit, state, setState, honeypot, setHoneypot, submitting } = useSubmission("work-with-us");

  // A different "Ask about this" link was followed: tick that interest too (keeps everything else typed)
  const [seen, setSeen] = useState(preselect);
  if (preselect !== seen) {
    setSeen(preselect);
    if (preselect && !values.interests.includes(preselect)) {
      setValues((v) => ({ ...v, interests: [...v.interests, preselect] }));
    }
  }

  if (state.status === "success") {
    const first = values.name.trim().split(/\s+/)[0];
    return (
      <SentMessage
        title={`Thanks${first ? `, ${first}` : ""}. Let's talk!`}
        organisation={values.organisation.trim()}
        email={values.email.trim()}
        onReset={() => {
          setValues(makeInitial());
          setState({ status: "idle" });
        }}
      />
    );
  }

  return (
    <FormCard>
      <form
        noValidate
        aria-labelledby="enquire-title"
        className="relative"
        onSubmit={async (ev) => {
          ev.preventDefault();
          const data = validate(schema, P);
          if (!data) return;
          await submit({
            ...data,
            interestLabels: data.interests.map((i) => interestOptions.find((o) => o.value === i)?.label ?? i),
            source: "/work-with-us",
          });
        }}
      >
        <Honeypot value={honeypot} onChange={setHoneypot} />
        <h3 id="enquire-title" className="sr-only">
          Work with us enquiry form
        </h3>

        <FormSection first number={1} title="About you">
          <TextInput
            id={`${P}-organisation`}
            label="Organisation"
            required
            autoComplete="organization"
            value={values.organisation}
            onChange={(e) => set("organisation", e.target.value)}
            error={errors.organisation}
            wrapperClassName="sm:col-span-2"
          />
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
            id={`${P}-role`}
            label="Your role"
            autoComplete="organization-title"
            maxLength={120}
            placeholder="e.g. Social value lead"
            value={values.role}
            onChange={(e) => set("role", e.target.value)}
            error={errors.role}
          />
          <TextInput
            id={`${P}-email`}
            label="Work email"
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
            value={values.phone}
            onChange={(e) => set("phone", e.target.value)}
            error={errors.phone}
          />
        </FormSection>

        <FormSection number={2} title="What you're interested in">
          <div id={`${P}-interests`} className="sm:col-span-2">
            <ChoiceChips
              name="interests"
              label="Ways to work together"
              required
              hint="Pick as many as you like. Some are coming in 2027: tell us anyway and we'll keep you posted."
              options={interestOptions}
              value={values.interests}
              onChange={(v) => set("interests", v)}
              error={errors.interests}
            />
          </div>
          <div id={`${P}-budget`} className="sm:col-span-2">
            <ChoiceChips
              name="budget"
              label="Budget range"
              hint="A rough idea helps us suggest the right thing."
              multiple={false}
              options={budgetOptions}
              value={values.budget ? [values.budget] : []}
              onChange={(v) => set("budget", v[0] ?? "")}
            />
          </div>
          <SelectInput
            id={`${P}-timeline`}
            label="Timeline"
            placeholder="Choose one"
            options={timelineOptions}
            value={values.timeline}
            onChange={(e) => set("timeline", e.target.value)}
            wrapperClassName="sm:col-span-2 sm:max-w-sm"
          />
          <TextArea
            id={`${P}-message`}
            label="Tell us more"
            required
            rows={5}
            maxLength={2000}
            placeholder="What you'd like to do, who you'd like to reach, and what a great result looks like for you."
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
                I&apos;m happy for Black Owned Sheffield to store these details and contact me about this enquiry.
                <span className="ml-0.5 text-rose-ink" aria-hidden>
                  *
                </span>
              </strong>
            }
          />
        </FormSection>

        <SubmitBar
          label="Send enquiry"
          submitting={submitting}
          error={state.status === "error" ? state.error : undefined}
          errorCount={Object.keys(errors).length}
          note={
            <>
              No commitment and no hard sell. This just starts the conversation. Read our{" "}
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

function SentMessage({
  title,
  organisation,
  email,
  onReset,
}: {
  title: string;
  organisation: string;
  email: string;
  onReset: () => void;
}) {
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
            <ButtonLink href="/partners" variant="primary" iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}>
              Meet our partners
            </ButtonLink>
            <Button type="button" variant="outline" onClick={onReset}>
              Send another enquiry
            </Button>
          </div>
        }
      >
        <p>
          Your enquiry{organisation ? ` for ${organisation}` : ""} is with the team. We&apos;ll reply to{" "}
          <strong className="text-espresso">{email || "you"}</strong>, within {site.replyTime}.
        </p>
      </FormSuccess>
    </div>
  );
}
