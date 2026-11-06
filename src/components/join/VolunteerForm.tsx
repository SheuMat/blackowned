"use client";

import Link from "next/link";
import { z } from "zod";
import { ArrowRight, Info } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Checkbox, ChoiceChips, Honeypot, SelectInput, TextArea, TextInput } from "@/components/forms/fields";
import { useSubmission } from "@/components/forms/useSubmission";
import { InstagramIcon } from "@/components/icons/SocialIcons";
import { site } from "@/lib/site";
import { consentField, emailField, heardAboutOptions, optionalEmail, optionalPhone, req, useFields } from "./formKit";
import { InlineNote, SubmitBar, SuccessBlock } from "./FormBits";
import { FormCard, FormSection, NextSteps } from "./panels";

const P = "vf";

const ageRanges = [
  { value: "16-17", label: "16 to 17" },
  { value: "18+", label: "18 or over" },
];

const skills = [
  "Events & markets",
  "Social media & content",
  "Photography & video",
  "Admin & data",
  "Mentoring",
  "Web & tech",
  "Fundraising & bids",
  "Research",
].map((v) => ({ value: v, label: v }));

const availability = ["Weekdays", "Evenings", "Weekends", "One-off events"].map((v) => ({ value: v, label: v }));

const schema = z.object({
  name: req("Please tell us your name."),
  email: emailField,
  phone: optionalPhone,
  ageRange: z.enum(["16-17", "18+"], { error: "Please choose your age range." }),
  guardianName: z.string().trim(),
  guardianEmail: optionalEmail,
  skills: z.array(z.string()).min(1, "Pick at least one thing you'd like to help with."),
  availability: z.array(z.string()).min(1, "Let us know when you're usually free."),
  why: z
    .string()
    .trim()
    .min(20, "Tell us a little more: at least 20 characters.")
    .max(1500, "Please keep this under 1,500 characters."),
  experience: z.string().trim().max(1500, "Please keep this under 1,500 characters."),
  heardAbout: z.string(),
  consent: consentField,
});

const initial = {
  name: "",
  email: "",
  phone: "",
  ageRange: "" as string,
  guardianName: "",
  guardianEmail: "",
  skills: [] as string[],
  availability: [] as string[],
  why: "",
  experience: "",
  heardAbout: "",
  consent: false,
};

export function VolunteerForm() {
  const { values, set, errors, validate } = useFields(initial);
  const { submit, state, honeypot, setHoneypot, submitting } = useSubmission("volunteer");
  const under18 = values.ageRange === "16-17";

  if (state.status === "success") {
    const first = values.name.trim().split(/\s+/)[0];
    return (
      <SuccessBlock
        title={`You're a star${first ? `, ${first}` : ""}!`}
        action={
          <div className="flex flex-wrap justify-center gap-3">
            <ButtonLink href={site.socials.instagram} variant="primary" icon={<InstagramIcon size={18} />}>
              Follow us on Instagram
            </ButtonLink>
            <ButtonLink href="/events" variant="outline" iconRight={<ArrowRight className="h-4 w-4" />}>
              See upcoming events
            </ButtonLink>
          </div>
        }
      >
        <p>Thanks for offering your time. It genuinely makes this work possible.</p>
        <NextSteps
          className="mx-auto mt-6 max-w-sm"
          steps={[
            { title: "We match you up", text: "With roles that fit your skills and your diary." },
            { title: "We say hello", text: `Within ${site.replyTime}, by email.` },
            {
              title: under18 ? "We check in with your guardian" : "You get stuck in",
              text: under18 ? "We'll send a consent form before your first session." : "At a market, an event or behind the scenes.",
            },
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
          const { guardianName, guardianEmail, ...rest } = data;
          await submit({
            ...rest,
            ...(data.ageRange === "16-17" ? { guardianName, guardianEmail, guardianConsentNeeded: true } : {}),
            consent: true,
          });
        }}
      >
        <Honeypot value={honeypot} onChange={setHoneypot} />
        <h2 className="sr-only">Volunteer application</h2>

        <FormSection first number={1} title="About you">
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
            value={values.phone}
            onChange={(e) => set("phone", e.target.value)}
            error={errors.phone}
          />
          <div id={`${P}-ageRange`}>
            <ChoiceChips
              name="ageRange"
              label="Age range"
              required
              multiple={false}
              options={ageRanges}
              value={values.ageRange ? [values.ageRange] : []}
              onChange={(v) => set("ageRange", v[0] ?? "")}
              error={errors.ageRange}
            />
          </div>
          {under18 && (
            <>
              <InlineNote className="flex items-start gap-3 sm:col-span-2">
                <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                <span>
                  <strong>Under 18? You&apos;re very welcome.</strong> We&apos;ll need consent from a parent or guardian
                  before you volunteer, so we&apos;ll send them a short form. Add their details if you can.
                </span>
              </InlineNote>
              <TextInput
                id={`${P}-guardianName`}
                label="Parent or guardian's name"
                value={values.guardianName}
                onChange={(e) => set("guardianName", e.target.value)}
                error={errors.guardianName}
              />
              <TextInput
                id={`${P}-guardianEmail`}
                label="Parent or guardian's email"
                type="email"
                value={values.guardianEmail}
                onChange={(e) => set("guardianEmail", e.target.value)}
                error={errors.guardianEmail}
              />
            </>
          )}
        </FormSection>

        <FormSection number={2} title="How you'd like to help">
          <div id={`${P}-skills`} className="sm:col-span-2">
            <ChoiceChips
              name="skills"
              label="Skills and interests"
              required
              hint="Pick as many as you like. No experience needed for most roles."
              options={skills}
              value={values.skills}
              onChange={(v) => set("skills", v)}
              error={errors.skills}
            />
          </div>
          <div id={`${P}-availability`} className="sm:col-span-2">
            <ChoiceChips
              name="availability"
              label="When are you usually free?"
              required
              options={availability}
              value={values.availability}
              onChange={(v) => set("availability", v)}
              error={errors.availability}
            />
          </div>
          <TextArea
            id={`${P}-why`}
            label="Why do you want to volunteer with us?"
            required
            rows={4}
            maxLength={1500}
            value={values.why}
            onChange={(e) => set("why", e.target.value)}
            error={errors.why}
            wrapperClassName="sm:col-span-2"
          />
          <TextArea
            id={`${P}-experience`}
            label="Any relevant experience?"
            hint="Jobs, studies, side projects, anything you're proud of."
            rows={3}
            maxLength={1500}
            value={values.experience}
            onChange={(e) => set("experience", e.target.value)}
            error={errors.experience}
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
                  I&apos;m happy for Black Owned Sheffield to store my details and contact me about volunteering.
                  <span className="ml-0.5 text-rose" aria-hidden>
                    *
                  </span>
                </strong>{" "}
                We won&apos;t share your details.
              </>
            }
          />
        </FormSection>

        <SubmitBar
          label="Offer to volunteer"
          submitting={submitting}
          error={state.status === "error" ? state.error : undefined}
          errorCount={Object.keys(errors).length}
          note={
            <>
              Takes about four minutes. Every bit of time helps. Read our{" "}
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
