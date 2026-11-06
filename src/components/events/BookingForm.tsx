"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowRight, CalendarPlus, Download } from "lucide-react";
import { z } from "zod";
import { Checkbox, Honeypot, SelectInput, TextArea, TextInput } from "@/components/forms/fields";
import { FormError, FormSuccess } from "@/components/forms/FormStatus";
import { useSubmission } from "@/components/forms/useSubmission";
import { Button } from "@/components/ui/Button";
import type { BosEvent } from "@/content/types";
import { googleCalendarUrl, icsPath } from "./eventUtils";

const schema = z.object({
  name: z.string().trim().min(2, "Please tell us your name."),
  email: z.email("Please enter an email address we can reply to."),
  places: z.coerce.number().int().min(1).max(6, "You can book up to 6 places at once."),
  accessNeeds: z.string().max(1000, "Please keep this under 1,000 characters.").optional(),
  updates: z.boolean(),
  consent: z.literal(true, "Please tick this box so we can manage your booking."),
});

type Errors = Partial<Record<keyof z.infer<typeof schema>, string>>;

const placeOptions = Array.from({ length: 6 }, (_, i) => ({
  value: String(i + 1),
  label: i === 0 ? "1 place" : `${i + 1} places`,
}));

/** Inline booking / registration for events without an external ticket link */
export function BookingForm({ event }: { event: BosEvent }) {
  const { submit, state, honeypot, setHoneypot, submitting } = useSubmission("event-booking");
  const [values, setValues] = useState({ name: "", email: "", places: "1", accessNeeds: "", updates: false, consent: false });
  const [errors, setErrors] = useState<Errors>({});
  const set = <K extends keyof typeof values>(key: K, value: (typeof values)[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };
  const id = (f: string) => `book-${event.slug}-${f}`;
  const successRef = useRef<HTMLDivElement>(null);
  const done = state.status === "success";

  // The form is replaced on success, so move focus to the confirmation
  useEffect(() => {
    if (!done) return;
    successRef.current?.focus({ preventScroll: true });
    successRef.current?.scrollIntoView({ block: "start" });
  }, [done]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof Errors;
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      const first = (["name", "email", "places", "accessNeeds", "consent"] as const).find((k) => next[k]);
      if (first) document.getElementById(id(first))?.focus();
      return;
    }
    await submit({
      ...parsed.data,
      eventSlug: event.slug,
      eventTitle: event.title,
      eventStart: event.start,
      sampleEvent: !!event.sample,
    });
  }

  if (done) {
    const firstName = values.name.trim().split(/\s+/)[0];
    const n = Number(values.places);
    return (
      <div ref={successRef} tabIndex={-1} className="scroll-mt-28 rounded-[1.75rem] focus:outline-none">
        <FormSuccess
          className="bg-white"
          title="You're on the list!"
          action={
            <div className="flex flex-wrap justify-center gap-2">
              <a
                href={icsPath(event)}
                download={`${event.slug}.ics`}
                className="inline-flex h-11 items-center gap-2 rounded-full border-2 border-espresso bg-white px-4 font-heading text-sm font-bold text-espresso hover:bg-sunflower"
              >
                <Download className="h-4 w-4" aria-hidden />
                Add to Apple / Outlook
              </a>
              <a
                href={googleCalendarUrl(event)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-full border-2 border-espresso bg-white px-4 font-heading text-sm font-bold text-espresso hover:bg-sunflower"
              >
                <CalendarPlus className="h-4 w-4" aria-hidden />
                Add to Google Calendar
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </div>
          }
        >
          <p>
            Thanks{firstName ? `, ${firstName}` : ""}. We&apos;ve got your request for {n} {n === 1 ? "place" : "places"} at{" "}
            <strong className="text-espresso">{event.title}</strong>. We&apos;ll email {values.email} to confirm
            {event.online ? " and send the joining details." : "."}
          </p>
        </FormSuccess>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} className="relative space-y-5" aria-describedby={id("intro")}>
      <Honeypot value={honeypot} onChange={setHoneypot} />
      <p id={id("intro")} className="text-sm text-cocoa">
        {event.price.toLowerCase().startsWith("free") && !/£/.test(event.price)
          ? "It's free, but numbers help us plan. "
          : `Price: ${event.price}. We'll confirm the details by email. `}
        Fields marked <span className="text-rose" aria-hidden>*</span>
        <span className="sr-only">with an asterisk</span> are required.
      </p>

      <div className="grid gap-5 sm:grid-cols-2">
        <TextInput
          id={id("name")}
          label="Your name"
          required
          autoComplete="name"
          value={values.name}
          onChange={(e) => set("name", e.target.value)}
          error={errors.name}
        />
        <TextInput
          id={id("email")}
          label="Email"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          value={values.email}
          onChange={(e) => set("email", e.target.value)}
          error={errors.email}
        />
      </div>

      <SelectInput
        id={id("places")}
        label="How many places?"
        required
        options={placeOptions}
        value={values.places}
        onChange={(e) => set("places", e.target.value)}
        error={errors.places}
        wrapperClassName="sm:max-w-[16rem]"
      />

      <TextArea
        id={id("accessNeeds")}
        label="Access needs"
        hint="Step-free access, a quiet space, BSL, dietary needs or anything else that would help you enjoy the day."
        rows={3}
        value={values.accessNeeds}
        onChange={(e) => set("accessNeeds", e.target.value)}
        error={errors.accessNeeds}
      />

      <div className="space-y-3 rounded-2xl bg-cream-deep p-4">
        <Checkbox
          id={id("consent")}
          checked={values.consent}
          onChange={(e) => set("consent", e.target.checked)}
          aria-invalid={!!errors.consent || undefined}
          aria-required
          error={errors.consent}
          label={
            <>
              I&apos;m happy for Black Owned Sheffield to use these details to manage my booking and contact me about
              this event. <span className="text-rose" aria-hidden>*</span>
            </>
          }
        />
        <Checkbox
          checked={values.updates}
          onChange={(e) => set("updates", e.target.checked)}
          label="Send me news about future events too (optional)."
        />
      </div>

      <FormError message={state.status === "error" ? state.error : undefined} />

      <Button
        type="submit"
        variant="pink"
        size="lg"
        disabled={submitting}
        iconRight={<ArrowRight className="h-5 w-5" aria-hidden />}
        className="w-full sm:w-auto"
      >
        {submitting ? "Sending…" : (event.ticketLabel ?? "Book a place")}
      </Button>
    </form>
  );
}
