"use client";

import type { FormEvent } from "react";
import { Lightbulb, Loader2, Send } from "lucide-react";
import { Honeypot, TextArea, TextInput } from "@/components/forms/fields";
import { FormError } from "@/components/forms/FormStatus";
import { useSubmission } from "@/components/forms/useSubmission";
import { Button } from "@/components/ui/Button";

/** Members suggest a link, guide or programme for a support section */
export function SuggestResourceForm({
  sectionId,
  sectionTitle,
  defaultName,
}: {
  sectionId: string;
  sectionTitle: string;
  defaultName?: string;
}) {
  const { submit, state, setState, honeypot, setHoneypot, submitting } = useSubmission("contact");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const ok = await submit({
      subject: "resource-suggestion",
      section: sectionId,
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      resource: String(fd.get("resource") ?? ""),
      url: String(fd.get("url") ?? ""),
      message: String(fd.get("message") ?? ""),
      source: "business-support",
    });
    if (ok) form.reset();
  }

  return (
    <section
      aria-labelledby="suggest-heading"
      className="rounded-[1.75rem] border-2 border-espresso bg-white p-5 shadow-pop sm:p-6"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-espresso bg-sunflower">
        <Lightbulb className="h-5 w-5 text-espresso" aria-hidden />
      </span>
      <h2 id="suggest-heading" className="mt-4 font-heading text-xl font-extrabold text-espresso">
        Suggest a resource
      </h2>
      <p className="mt-1 text-sm text-cocoa">
        Found something that helped you with {sectionTitle.toLowerCase()}? Share it and we&apos;ll check it out for
        other members.
      </p>

      {state.status === "success" ? (
        <div role="status" className="mt-5 rounded-2xl border-2 border-espresso bg-blush p-4">
          <p className="font-heading font-extrabold text-espresso">Thank you, that&apos;s brilliant.</p>
          <p className="mt-1 text-sm text-cocoa">We&apos;ll check the link and add it if it&apos;s a good fit.</p>
          <button
            type="button"
            onClick={() => setState({ status: "idle" })}
            className="mt-2 min-h-11 text-sm font-semibold text-rose-ink underline underline-offset-4"
          >
            Suggest another
          </button>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="relative mt-5 flex flex-col gap-4">
          <Honeypot value={honeypot} onChange={setHoneypot} />
          <TextInput label="What is it?" name="resource" required placeholder="e.g. a grant, course or guide" />
          <TextInput label="Link" name="url" type="url" inputMode="url" placeholder="https://" />
          <TextArea label="Why is it useful?" name="message" rows={3} />
          <TextInput label="Your name" name="name" autoComplete="name" defaultValue={defaultName} />
          <TextInput
            label="Your email"
            name="email"
            type="email"
            required
            autoComplete="email"
            hint="So we can say thanks or ask a question."
          />
          <FormError message={state.status === "error" ? state.error : undefined} />
          <Button
            type="submit"
            variant="primary"
            disabled={submitting}
            icon={submitting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Send className="h-4 w-4" aria-hidden />}
          >
            {submitting ? "Sending…" : "Send suggestion"}
          </Button>
        </form>
      )}
    </section>
  );
}
