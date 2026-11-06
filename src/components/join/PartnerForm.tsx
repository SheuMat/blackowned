"use client";

import Link from "next/link";
import { z } from "zod";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Checkbox, ChoiceChips, Honeypot, TextArea, TextInput } from "@/components/forms/fields";
import { useSubmission } from "@/components/forms/useSubmission";
import { site } from "@/lib/site";
import { consentField, emailField, optionalPhone, optionalUrl, req, useFields, withProtocol } from "./formKit";
import { SubmitBar, SuccessBlock } from "./FormBits";
import { FormCard, FormSection, NextSteps } from "./panels";

const P = "pf";

const orgTypes = [
  "Corporate",
  "Public sector / council",
  "Funder",
  "Charity / community",
  "Venue",
  "Media",
  "Education",
].map((v) => ({ value: v, label: v }));

const interests = [
  "Sponsorship",
  "Event partnership",
  "Venue",
  "Funding",
  "Supplier diversity / procurement",
  "Corporate volunteering",
  "Media / promotion",
  "Research",
].map((v) => ({ value: v, label: v }));

const schema = z.object({
  organisationName: req("What's your organisation called?"),
  organisationType: z.string().min(1, "Choose the type that fits best."),
  organisationWebsite: optionalUrl,
  contactName: req("Please tell us your name."),
  role: z.string().trim(),
  email: emailField,
  phone: optionalPhone,
  interests: z.array(z.string()).min(1, "Pick at least one area you're interested in."),
  message: z
    .string()
    .trim()
    .min(20, "Tell us a little more: at least 20 characters.")
    .max(2000, "Please keep this under 2,000 characters."),
  consent: consentField,
});

const initial = {
  organisationName: "",
  organisationType: "",
  organisationWebsite: "",
  contactName: "",
  role: "",
  email: "",
  phone: "",
  interests: [] as string[],
  message: "",
  consent: false,
};

export function PartnerForm() {
  const { values, set, errors, validate } = useFields(initial);
  const { submit, state, honeypot, setHoneypot, submitting } = useSubmission("partner");

  if (state.status === "success") {
    const first = values.contactName.trim().split(/\s+/)[0];
    return (
      <SuccessBlock
        title={`Thanks${first ? `, ${first}` : ""}. Let's talk!`}
        action={
          <div className="flex flex-wrap justify-center gap-3">
            <ButtonLink href="/partners" variant="primary" iconRight={<ArrowRight className="h-4 w-4" />}>
              Meet our partners
            </ButtonLink>
            <ButtonLink href="/impact" variant="outline">
              See our impact
            </ButtonLink>
          </div>
        }
      >
        <p>Your enquiry for {values.organisationName.trim() || "your organisation"} is with the team.</p>
        <NextSteps
          className="mx-auto mt-6 max-w-sm"
          steps={[
            { title: "We read it properly", text: "And think about where we could work together." },
            { title: "We get in touch", text: `Within ${site.replyTime}, to book a chat.` },
            { title: "We shape it together", text: "A partnership that works for you and the community." },
          ]}
        />
      </SuccessBlock>
    );
  }

  return (
    <FormCard>
      <form
        noValidate
        className="relative"
        onSubmit={async (ev) => {
          ev.preventDefault();
          const data = validate(schema, P);
          if (!data) return;
          await submit({ ...data, organisationWebsite: withProtocol(data.organisationWebsite), consent: true });
        }}
      >
        <Honeypot value={honeypot} onChange={setHoneypot} />
        <h2 className="sr-only">Partnership enquiry</h2>

        <FormSection first number={1} title="Your organisation">
          <TextInput
            id={`${P}-organisationName`}
            label="Organisation name"
            required
            autoComplete="organization"
            value={values.organisationName}
            onChange={(e) => set("organisationName", e.target.value)}
            error={errors.organisationName}
          />
          <TextInput
            id={`${P}-organisationWebsite`}
            label="Website"
            type="url"
            inputMode="url"
            placeholder="www.example.org"
            value={values.organisationWebsite}
            onChange={(e) => set("organisationWebsite", e.target.value)}
            error={errors.organisationWebsite}
          />
          <div id={`${P}-organisationType`} className="sm:col-span-2">
            <ChoiceChips
              name="organisationType"
              label="Type of organisation"
              required
              multiple={false}
              options={orgTypes}
              value={values.organisationType ? [values.organisationType] : []}
              onChange={(v) => set("organisationType", v[0] ?? "")}
              error={errors.organisationType}
            />
          </div>
        </FormSection>

        <FormSection number={2} title="Your details">
          <TextInput
            id={`${P}-contactName`}
            label="Your name"
            required
            autoComplete="name"
            value={values.contactName}
            onChange={(e) => set("contactName", e.target.value)}
            error={errors.contactName}
          />
          <TextInput
            id={`${P}-role`}
            label="Your role"
            autoComplete="organization-title"
            placeholder="e.g. Community partnerships lead"
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

        <FormSection number={3} title="What you have in mind">
          <div id={`${P}-interests`} className="sm:col-span-2">
            <ChoiceChips
              name="interests"
              label="Partnership interests"
              required
              hint="Pick as many as you like."
              options={interests}
              value={values.interests}
              onChange={(v) => set("interests", v)}
              error={errors.interests}
            />
          </div>
          <TextArea
            id={`${P}-message`}
            label="Tell us more"
            required
            rows={5}
            maxLength={2000}
            placeholder="What you'd like to do, any timings or budgets, and what success looks like for you."
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
              <>
                <strong className="text-espresso">
                  I&apos;m happy for Black Owned Sheffield to store these details and contact me about a partnership.
                  <span className="ml-0.5 text-rose" aria-hidden>
                    *
                  </span>
                </strong>
              </>
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
              No commitment. This just starts the conversation. Read our{" "}
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
