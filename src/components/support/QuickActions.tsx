"use client";

import { useState, type FormEvent } from "react";
import { CalendarCheck, HeartHandshake, Loader2, Send } from "lucide-react";
import { Honeypot, SelectInput, TextArea, TextInput } from "@/components/forms/fields";
import { FormError, FormSuccess } from "@/components/forms/FormStatus";
import { useSubmission } from "@/components/forms/useSubmission";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type Mode = "one-to-one" | "mentor";

const modes: Record<
  Mode,
  { label: string; subject: string; Icon: typeof CalendarCheck; intro: string; topicLabel: string; topics: string[] }
> = {
  "one-to-one": {
    label: "Book a 1:1",
    subject: "1:1 business advice session",
    Icon: CalendarCheck,
    intro: "A conversation with the BOS team or someone from our network about whatever is on your mind.",
    topicLabel: "What would you like to talk about?",
    topics: [
      "Funding and grants",
      "Pricing and money",
      "Finding customers",
      "Marketing and social media",
      "Premises",
      "Hiring and staff",
      "Starting out",
      "Something else",
    ],
  },
  mentor: {
    label: "Request a mentor",
    subject: "Mentor request",
    Icon: HeartHandshake,
    intro: "Tell us where you are and where you want to get to. We'll look for a good match and make the introduction.",
    topicLabel: "What would you like a mentor to help with?",
    topics: [
      "Growing sales",
      "Managing money",
      "Leading a team",
      "Scaling up or new premises",
      "Moving online",
      "Confidence and balance",
      "Something else",
    ],
  },
};

const stages = [
  { value: "idea", label: "Just an idea" },
  { value: "new", label: "Trading less than a year" },
  { value: "established", label: "Trading 1 to 3 years" },
  { value: "growing", label: "Trading more than 3 years" },
];

const formats = [
  { value: "either", label: "Either is fine" },
  { value: "online", label: "Online" },
  { value: "in-person", label: "In person in Sheffield" },
];

/** The hub's "Book a 1:1" / "Request a mentor" form */
export function QuickActions({ defaultName }: { defaultName?: string }) {
  const [mode, setMode] = useState<Mode>("one-to-one");
  const { submit, state, setState, honeypot, setHoneypot, submitting } = useSubmission("contact");
  const m = modes[mode];

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const get = (k: string) => String(fd.get(k) ?? "");
    await submit({
      subject: m.subject,
      request: mode,
      name: get("name"),
      email: get("email"),
      business: get("business"),
      stage: get("stage"),
      topic: get("topic"),
      format: get("format"),
      message: get("message"),
      source: "business-support",
    });
  }

  if (state.status === "success") {
    return (
      <FormSuccess
        title={mode === "mentor" ? "Mentor request sent" : "Request sent"}
        action={
          <Button type="button" variant="outline" onClick={() => setState({ status: "idle" })}>
            Make another request
          </Button>
        }
      >
        <p>
          Thanks{defaultName ? `, ${defaultName}` : ""}. Someone from the team will email you to{" "}
          {mode === "mentor" ? "talk through a match" : "find a time that works"}.
        </p>
      </FormSuccess>
    );
  }

  return (
    <div className="rounded-[2rem] border-2 border-espresso bg-white p-5 shadow-pop sm:p-8">
      <div role="group" aria-label="What would you like to request?" className="grid grid-cols-2 gap-2 rounded-full bg-cream-deep p-1.5">
        {(Object.keys(modes) as Mode[]).map((key) => {
          const { label, Icon } = modes[key];
          const active = key === mode;
          return (
            <button
              key={key}
              type="button"
              aria-pressed={active}
              onClick={() => setMode(key)}
              className={cn(
                "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-3 py-2 text-center font-heading text-sm leading-tight font-bold transition-all sm:text-base",
                active ? "bg-espresso text-cream shadow-pop-sm" : "text-cocoa hover:bg-white",
              )}
            >
              <Icon className={cn("h-4 w-4 shrink-0", active ? "text-pink" : "text-rose")} aria-hidden />
              {label}
            </button>
          );
        })}
      </div>

      <p className="mt-5 text-cocoa">{m.intro}</p>

      <form onSubmit={onSubmit} className="relative mt-5 grid gap-4 sm:grid-cols-2">
        <Honeypot value={honeypot} onChange={setHoneypot} />
        <TextInput label="Your name" name="name" required autoComplete="name" defaultValue={defaultName} />
        <TextInput label="Email" name="email" type="email" required autoComplete="email" />
        <TextInput label="Business name" name="business" autoComplete="organization" />
        <SelectInput label="Where are you at?" name="stage" options={stages} placeholder="Choose one" />
        <SelectInput
          key={mode}
          label={m.topicLabel}
          name="topic"
          required
          placeholder="Choose one"
          options={m.topics.map((t) => ({ value: t, label: t }))}
          wrapperClassName={mode === "mentor" ? "sm:col-span-2" : undefined}
        />
        {mode === "one-to-one" && <SelectInput label="Online or in person?" name="format" options={formats} />}
        <TextArea
          label={mode === "mentor" ? "Tell us a bit more" : "What's the question?"}
          name="message"
          rows={4}
          wrapperClassName="sm:col-span-2"
          placeholder={
            mode === "mentor"
              ? "Where you are now, where you want to be in a year, and what's in the way."
              : "The more you tell us, the more useful the session will be."
          }
        />
        <div className="flex flex-col gap-3 sm:col-span-2">
          <FormError message={state.status === "error" ? state.error : undefined} />
          <Button
            type="submit"
            variant="pink"
            size="lg"
            disabled={submitting}
            className="w-full sm:w-auto sm:self-start"
            icon={submitting ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> : <Send className="h-5 w-5" aria-hidden />}
          >
            {submitting ? "Sending…" : mode === "mentor" ? "Request a mentor" : "Request a session"}
          </Button>
        </div>
      </form>
    </div>
  );
}
