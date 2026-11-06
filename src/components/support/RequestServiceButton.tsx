"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { CheckCircle2, Loader2, Send, Sparkles, X } from "lucide-react";
import { Honeypot, TextArea, TextInput } from "@/components/forms/fields";
import { FormError } from "@/components/forms/FormStatus";
import { useSubmission } from "@/components/forms/useSubmission";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

/** Stable ref callback: move focus into the form when it opens */
function focusFirstField(el: HTMLFormElement | null) {
  el?.querySelector<HTMLInputElement>('input[name="name"]')?.focus();
}

/**
 * "Request this" for BOS services. Opens a short inline form that sends a
 * contact submission to the team with the service in the subject.
 */
export function RequestServiceButton({
  serviceId,
  serviceTitle,
  section,
  defaultName,
  className,
}: {
  serviceId: string;
  serviceTitle: string;
  section?: string;
  defaultName?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  // When the form closes, put focus back on "Request this" instead of losing it
  const returnFocus = useRef(false);
  const focusTrigger = (el: HTMLButtonElement | null) => {
    if (el && returnFocus.current) {
      returnFocus.current = false;
      el.focus();
    }
  };
  const close = () => {
    returnFocus.current = true;
    setOpen(false);
  };
  const { submit, state, honeypot, setHoneypot, submitting } = useSubmission("contact");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await submit({
      subject: `Member request: ${serviceTitle}`,
      service: serviceId,
      section,
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      message: String(fd.get("message") ?? ""),
      source: "business-support",
    });
  }

  if (state.status === "success") {
    return (
      <p
        role="status"
        className={cn(
          "flex w-full basis-full items-start gap-2 rounded-2xl border-2 border-teal/30 bg-teal/10 px-4 py-3 text-sm font-medium text-espresso",
          className,
        )}
      >
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal" aria-hidden />
        Request sent. Someone from the team will be in touch by email.
      </p>
    );
  }

  return (
    <div className={cn(open ? "w-full basis-full" : "w-auto", className)}>
      {!open && (
        <Button
          ref={focusTrigger}
          type="button"
          variant="pink"
          size="md"
          onClick={() => setOpen(true)}
          icon={<Sparkles className="h-4 w-4" aria-hidden />}
        >
          Request this
        </Button>
      )}
      {open && (
        <form
          id={panelId}
          ref={focusFirstField}
          onSubmit={onSubmit}
          onKeyDown={(e) => {
            if (e.key === "Escape") close();
          }}
          className="relative mt-1 flex flex-col gap-3 rounded-2xl border-2 border-espresso/15 bg-cream p-4"
          aria-label={`Request: ${serviceTitle}`}
        >
          <div className="flex items-start justify-between gap-2">
            <p className="font-heading text-sm font-bold text-espresso">Request: {serviceTitle}</p>
            <button
              type="button"
              onClick={close}
              className="-mt-2 -mr-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-cocoa hover:bg-espresso/5"
              aria-label="Close request form"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          </div>
          <Honeypot value={honeypot} onChange={setHoneypot} />
          <div className="grid gap-3 sm:grid-cols-2">
            <TextInput label="Name" name="name" required autoComplete="name" defaultValue={defaultName} />
            <TextInput label="Email" name="email" type="email" required autoComplete="email" />
          </div>
          <TextArea
            label="Anything we should know?"
            name="message"
            rows={3}
            placeholder="A line or two about your business and what you'd like help with."
          />
          <FormError message={state.status === "error" ? state.error : undefined} />
          <Button
            type="submit"
            size="sm"
            disabled={submitting}
            className="self-start"
            icon={
              submitting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Send className="h-4 w-4" aria-hidden />
            }
          >
            {submitting ? "Sending…" : "Send request"}
          </Button>
        </form>
      )}
    </div>
  );
}
