"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FormError, FormSuccess } from "@/components/forms/FormStatus";
import { Checkbox, ChoiceChips, Honeypot, SelectInput, TextArea, TextInput } from "@/components/forms/fields";
import { useSubmission } from "@/components/forms/useSubmission";
import { emailField } from "@/components/join/formKit";
import { Button } from "@/components/ui/Button";
import { fulfilmentOptions, giftBoxes, quantityOptions } from "@/content/shop";

const SELECT_EVENT = "bos:shop-box";

type FieldErrors = { name?: string; email?: string; boxes?: string };

/** Moves focus to the thank-you message, so keyboard and screen reader users land on it */
function Sent({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.focus({ preventScroll: true });
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
  }, []);
  return (
    <div ref={ref} tabIndex={-1} className="scroll-mt-28 focus:outline-none">
      {children}
    </div>
  );
}

/**
 * "Register interest" link on each gift box card. Without JavaScript it just
 * jumps to the form; with it, the box is also ticked in the form.
 */
export function InterestButton({ boxId, children, className }: { boxId: string; children: ReactNode; className?: string }) {
  return (
    <a
      href="#register"
      className={className}
      onClick={() => window.dispatchEvent(new CustomEvent<string>(SELECT_EVENT, { detail: boxId }))}
    >
      {children}
    </a>
  );
}

const boxOptions = giftBoxes.map((b) => ({ value: b.id, label: b.name.replace(/^The /, "") }));
const yesNo = [
  { value: "no", label: "No, it's for me" },
  { value: "yes", label: "Yes, for my organisation" },
];

export function ShopInterestForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [boxes, setBoxes] = useState<string[]>([]);
  const [fulfilment, setFulfilment] = useState<string[]>([]);
  const [quantity, setQuantity] = useState("");
  const [corporate, setCorporate] = useState<string[]>([]);
  const [organisation, setOrganisation] = useState("");
  const [notes, setNotes] = useState("");
  const [newsletter, setNewsletter] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [highlight, setHighlight] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const { submit, state, honeypot, setHoneypot, submitting } = useSubmission("shop-interest");

  // Ticks the box someone chose from a gift box card
  useEffect(() => {
    let timer: number | undefined;
    function onSelect(e: Event) {
      const id = (e as CustomEvent<string>).detail;
      setBoxes((prev) => (prev.includes(id) ? prev : [...prev, id]));
      setErrors((prev) => {
        if (!prev.boxes) return prev;
        const next = { ...prev };
        delete next.boxes;
        return next;
      });
      if (id === "corporate") setCorporate(["yes"]);
      setHighlight(true);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setHighlight(false), 1600);
    }
    window.addEventListener(SELECT_EVENT, onSelect);
    return () => {
      window.removeEventListener(SELECT_EVENT, onSelect);
      window.clearTimeout(timer);
    };
  }, []);

  const isCorporate = corporate[0] === "yes";
  const clearError = (key: keyof FieldErrors) =>
    setErrors((e) => {
      if (!e[key]) return e;
      const next = { ...e };
      delete next[key];
      return next;
    });

  if (state.status === "success") {
    const first = name.trim().split(/\s+/)[0];
    return (
      <Sent>
        <FormSuccess
          title={first ? `You're on the list, ${first}!` : "You're on the list!"}
          action={
            <Link
              href="#shop-directory"
              className="inline-flex h-11 items-center gap-2 rounded-full border-2 border-espresso bg-espresso px-5 font-heading text-[15px] font-semibold text-cream"
            >
              Shop the directory now <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          }
        >
          <p>
            Thanks for registering interest. We&apos;ll email you when gift boxes are ready, and your answers help us
            decide which ones to make first.
          </p>
        </FormSuccess>
      </Sent>
    );
  }

  return (
    <form
      ref={formRef}
      noValidate
      aria-label="Register interest in gift boxes"
      className={`relative space-y-6 rounded-[1.75rem] border-2 border-espresso bg-white p-5 shadow-pop transition-shadow sm:p-8 ${
        highlight ? "ring-4 ring-pink" : ""
      }`}
      onSubmit={async (e) => {
        e.preventDefault();
        // Same inline errors as the site's other forms, rather than the browser's own bubbles
        const next: FieldErrors = {};
        if (!name.trim()) next.name = "Please tell us your name.";
        const em = emailField.safeParse(email);
        if (!em.success) next.email = em.error.issues[0]?.message ?? "Please add your email address.";
        if (boxes.length === 0) next.boxes = "Pick at least one box you'd be interested in.";
        if (Object.keys(next).length > 0) {
          setErrors(next);
          const target = next.name ? "#shop-name" : next.email ? "#shop-email" : 'input[name="boxes"]';
          formRef.current?.querySelector<HTMLElement>(target)?.focus();
          return;
        }
        await submit({
          name: name.trim(),
          email: email.trim(),
          boxes,
          boxNames: boxes.map((id) => giftBoxes.find((b) => b.id === id)?.name ?? id),
          fulfilment: fulfilment[0] ?? "",
          quantity,
          corporate: isCorporate,
          organisation: isCorporate ? organisation.trim() : "",
          notes: notes.trim(),
          newsletter,
          source: "shop-page",
        });
      }}
    >
      <Honeypot value={honeypot} onChange={setHoneypot} />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextInput
          id="shop-name"
          label="Your name"
          required
          autoComplete="name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            clearError("name");
          }}
          error={errors.name}
        />
        <TextInput
          id="shop-email"
          label="Email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            clearError("email");
          }}
          error={errors.email}
        />
      </div>

      <ChoiceChips
        label="Which boxes would you buy?"
        hint="Pick as many as you like."
        required
        name="boxes"
        options={boxOptions}
        value={boxes}
        onChange={(v) => {
          setBoxes(v);
          if (v.length) clearError("boxes");
        }}
        error={errors.boxes}
      />

      <ChoiceChips
        label="Delivery or collection?"
        name="fulfilment"
        multiple={false}
        options={fulfilmentOptions}
        value={fulfilment}
        onChange={setFulfilment}
        hint="Collection would be from our office at Sadacca, 48 Wicker, S3 8JB."
      />

      <SelectInput
        label="Roughly how many boxes?"
        placeholder="Choose an estimate"
        options={quantityOptions}
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />

      <ChoiceChips
        label="Is this a corporate order?"
        name="corporate"
        multiple={false}
        options={yesNo}
        value={corporate}
        onChange={setCorporate}
      />

      {isCorporate && (
        <TextInput
          label="Organisation"
          autoComplete="organization"
          value={organisation}
          onChange={(e) => setOrganisation(e.target.value)}
          hint="So we can talk about branding, bulk orders and invoices."
        />
      )}

      <TextArea
        label="Anything else?"
        rows={3}
        placeholder="An occasion, a date, dietary needs, or an idea for a box"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      <Checkbox
        label="Also send me the Black Owned Sheffield newsletter: new businesses, events and opportunities."
        checked={newsletter}
        onChange={(e) => setNewsletter(e.target.checked)}
      />

      <FormError message={state.status === "error" ? state.error : undefined} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-cocoa/90">
          No payment, no commitment. We&apos;ll only use your details to tell you about gift boxes.{" "}
          <Link href="/privacy" className="font-semibold text-rose-ink underline underline-offset-2">
            Privacy notice
          </Link>
        </p>
        <Button type="submit" variant="pink" size="lg" disabled={submitting} iconRight={<ArrowRight className="h-5 w-5" />}>
          {submitting ? "Sending…" : "Register interest"}
        </Button>
      </div>
    </form>
  );
}
