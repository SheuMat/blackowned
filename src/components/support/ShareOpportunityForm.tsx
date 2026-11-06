"use client";

import type { FormEvent } from "react";
import { Loader2, Megaphone, Send } from "lucide-react";
import { Honeypot, SelectInput, TextArea, TextInput } from "@/components/forms/fields";
import { FormError } from "@/components/forms/FormStatus";
import { useSubmission } from "@/components/forms/useSubmission";
import { Button } from "@/components/ui/Button";
import { opportunityKinds } from "@/content/opportunities";

/** Members and partners share a contract, job or opportunity for the board */
export function ShareOpportunityForm({ defaultName }: { defaultName?: string }) {
  const { submit, state, setState, honeypot, setHoneypot, submitting } = useSubmission("contact");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const get = (k: string) => String(fd.get(k) ?? "");
    const ok = await submit({
      subject: "opportunity",
      title: get("title"),
      kind: get("kind"),
      organisation: get("organisation"),
      deadline: get("deadline"),
      url: get("url"),
      message: get("message"),
      name: get("name"),
      email: get("email"),
      source: "business-support/opportunities",
    });
    if (ok) form.reset();
  }

  return (
    <section
      id="share"
      aria-labelledby="share-heading"
      className="scroll-mt-28 rounded-[2rem] border-2 border-espresso bg-white p-5 shadow-pop sm:p-8"
    >
      <div className="flex items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-espresso bg-pink">
          <Megaphone className="h-6 w-6 text-espresso" aria-hidden />
        </span>
        <div>
          <h2 id="share-heading" className="font-heading text-2xl font-extrabold text-espresso sm:text-3xl">
            Share an opportunity
          </h2>
          <p className="mt-1 text-cocoa">
            Seen a contract, job or call-out that a Black-owned business should go for? Send it over. The BOS team
            checks every one before it goes on the board.
          </p>
        </div>
      </div>

      {state.status === "success" ? (
        <div role="status" className="mt-6 rounded-2xl border-2 border-espresso bg-blush p-5">
          <p className="font-heading text-lg font-extrabold text-espresso">Got it, thank you.</p>
          <p className="mt-1 text-sm text-cocoa">
            We&apos;ll check the details and add it to the board if it&apos;s still open.
          </p>
          <button
            type="button"
            onClick={() => setState({ status: "idle" })}
            className="mt-2 min-h-11 text-sm font-semibold text-rose-ink underline underline-offset-4"
          >
            Share another
          </button>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="relative mt-6 grid gap-4 sm:grid-cols-2">
          <Honeypot value={honeypot} onChange={setHoneypot} />
          <TextInput label="What's the opportunity?" name="title" required wrapperClassName="sm:col-span-2" />
          <SelectInput
            label="Type"
            name="kind"
            required
            placeholder="Choose one"
            options={opportunityKinds.map((k) => ({ value: k.id, label: k.label }))}
          />
          <TextInput label="Organisation" name="organisation" required />
          <TextInput label="Closing date" name="deadline" type="date" />
          <TextInput label="Link to the advert" name="url" type="url" inputMode="url" placeholder="https://" />
          <TextArea
            label="Anything else?"
            name="message"
            rows={3}
            wrapperClassName="sm:col-span-2"
            placeholder="Value, location, who it suits, how you heard about it."
          />
          <TextInput label="Your name" name="name" autoComplete="name" defaultValue={defaultName} />
          <TextInput label="Your email" name="email" type="email" required autoComplete="email" />
          <div className="flex flex-col gap-3 sm:col-span-2">
            <FormError message={state.status === "error" ? state.error : undefined} />
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={submitting}
              className="w-full sm:w-auto sm:self-start"
              icon={submitting ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> : <Send className="h-5 w-5" aria-hidden />}
            >
              {submitting ? "Sending…" : "Send it to the team"}
            </Button>
          </div>
        </form>
      )}
    </section>
  );
}
