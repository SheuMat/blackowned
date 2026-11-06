"use client";

import Link from "next/link";
import { z } from "zod";
import { ArrowRight, KeyRound } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Checkbox, ChoiceChips, Honeypot, SelectInput, TextArea, TextInput } from "@/components/forms/fields";
import { useSubmission } from "@/components/forms/useSubmission";
import { site } from "@/lib/site";
import { consentField, emailField, heardAboutOptions, optionalPhone, req, useFields } from "./formKit";
import { InlineNote, SubmitBar, SuccessBlock } from "./FormBits";
import { FormCard, FormSection, NextSteps } from "./panels";

const P = "mf";

export const memberStages = [
  "Just an idea",
  "Starting up",
  "Trading under 2 years",
  "Established 2+ years",
  "Not a business owner, just want to support",
].map((v) => ({ value: v, label: v }));

export const memberSupport = [
  "Funding & grants",
  "Mentoring",
  "Training & workshops",
  "Networking",
  "Marketing",
  "Legal & accounting",
  "Business opportunities",
].map((v) => ({ value: v, label: v }));

const schema = z.object({
  name: req("Please tell us your name."),
  email: emailField,
  phone: optionalPhone,
  businessName: z.string().trim(),
  stage: z.string().min(1, "Choose the option that fits you best."),
  support: z.array(z.string()),
  about: z.string().trim().max(1500, "Please keep this under 1,500 characters."),
  heardAbout: z.string(),
  consent: consentField,
});

const initial = {
  name: "",
  email: "",
  phone: "",
  businessName: "",
  stage: "",
  support: [] as string[],
  about: "",
  heardAbout: "",
  consent: false,
};

export function MemberForm() {
  const { values, set, errors, validate } = useFields(initial);
  const { submit, state, honeypot, setHoneypot, submitting } = useSubmission("member");

  if (state.status === "success") {
    const first = values.name.trim().split(/\s+/)[0];
    return (
      <SuccessBlock
        title={`Welcome to the family${first ? `, ${first}` : ""}!`}
        action={
          <div className="flex flex-wrap justify-center gap-3">
            <ButtonLink href="/events" variant="primary" iconRight={<ArrowRight className="h-4 w-4" />}>
              See what&apos;s on
            </ButtonLink>
            <ButtonLink href="/directory" variant="outline">
              Explore the directory
            </ButtonLink>
          </div>
        }
      >
        <p>Your membership application is with the team.</p>
        <NextSteps
          className="mx-auto mt-6 max-w-sm"
          steps={[
            { title: "We check your details", text: "A real person reads every application." },
            { title: "We say hello", text: `Within ${site.replyTime}, by email.` },
            { title: "You get your access code", text: "It unlocks the members-only Business Support area." },
          ]}
        />
      </SuccessBlock>
    );
  }

  const isSupporter = values.stage === memberStages[4]!.value;

  return (
    <FormCard>
      <form
        noValidate
        className="relative"
        onSubmit={async (ev) => {
          ev.preventDefault();
          const data = validate(schema, P);
          if (!data) return;
          await submit({ ...data, consent: true });
        }}
      >
        <Honeypot value={honeypot} onChange={setHoneypot} />
        <h2 className="sr-only">Membership application</h2>

        <FormSection first number={1} title="About you">
          <TextInput
            id={`${P}-name`}
            label="Your name"
            required
            autoComplete="name"
            hint="Your first name is fine."
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
            hint="We'll send your access code here."
            value={values.email}
            onChange={(e) => set("email", e.target.value)}
            error={errors.email}
          />
          <TextInput
            id={`${P}-phone`}
            label="Phone"
            type="tel"
            autoComplete="tel"
            hint="In case we need a quick chat."
            value={values.phone}
            onChange={(e) => set("phone", e.target.value)}
            error={errors.phone}
          />
          <TextInput
            id={`${P}-businessName`}
            label="Business name"
            autoComplete="organization"
            hint="If you have one. Ideas count too."
            value={values.businessName}
            onChange={(e) => set("businessName", e.target.value)}
            error={errors.businessName}
          />
        </FormSection>

        <FormSection number={2} title="Where you're at">
          <div id={`${P}-stage`} className="sm:col-span-2">
            <ChoiceChips
              name="stage"
              label="Which best describes you?"
              required
              multiple={false}
              options={memberStages}
              value={values.stage ? [values.stage] : []}
              onChange={(v) => set("stage", v[0] ?? "")}
              error={errors.stage}
            />
          </div>
          {isSupporter && (
            <InlineNote tone="teal" className="sm:col-span-2">
              Brilliant. Supporters are just as welcome. You&apos;ll hear about events, markets and ways to back Black-owned
              business in the city.
            </InlineNote>
          )}
          <div id={`${P}-support`} className="sm:col-span-2">
            <ChoiceChips
              name="support"
              label={isSupporter ? "Anything you'd like to get involved in?" : "What support would help?"}
              hint="Pick as many as you like. It helps us plan workshops and opportunities."
              options={memberSupport}
              value={values.support}
              onChange={(v) => set("support", v)}
              error={errors.support}
            />
          </div>
          <TextArea
            id={`${P}-about`}
            label={isSupporter ? "Anything else you'd like to tell us?" : "Tell us about your business or idea"}
            rows={4}
            maxLength={1500}
            placeholder={isSupporter ? "" : "What you do or want to do, and where you'd like to be in a year."}
            value={values.about}
            onChange={(e) => set("about", e.target.value)}
            error={errors.about}
            wrapperClassName="sm:col-span-2"
          />
        </FormSection>

        <FormSection number={3} title="Last bits">
          <SelectInput
            id={`${P}-heardAbout`}
            label="How did you hear about us?"
            placeholder="Choose one"
            options={heardAboutOptions}
            value={values.heardAbout}
            onChange={(e) => set("heardAbout", e.target.value)}
            wrapperClassName="sm:col-span-2"
          />
          <InlineNote className="flex items-start gap-3 sm:col-span-2">
            <KeyRound className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            <span>
              Once you&apos;re approved we&apos;ll email you an <strong>access code</strong> for the members-only Business
              Support area.
            </span>
          </InlineNote>
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
                  I&apos;m happy for Black Owned Sheffield to store my details and contact me about membership.
                  <span className="ml-0.5 text-rose" aria-hidden>
                    *
                  </span>
                </strong>{" "}
                We won&apos;t share your details or show them publicly.
              </>
            }
          />
        </FormSection>

        <SubmitBar
          label="Apply for membership"
          submitting={submitting}
          error={state.status === "error" ? state.error : undefined}
          errorCount={Object.keys(errors).length}
          note={
            <>
              Membership is free while we launch. It takes about three minutes. Read our{" "}
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
