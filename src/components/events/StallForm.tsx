"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type FormEvent, type ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { z } from "zod";
import { Checkbox, ChoiceChips, Honeypot, SelectInput, TextArea, TextInput } from "@/components/forms/fields";
import { FormError, FormSuccess } from "@/components/forms/FormStatus";
import { useSubmission } from "@/components/forms/useSubmission";
import { Button, ButtonLink } from "@/components/ui/Button";
import { categories } from "@/content/categories";

export type MarketOption = { value: string; label: string };

const ANY = "any-future-market";

const needOptions = [
  { value: "table", label: "A table" },
  { value: "power", label: "Access to power" },
  { value: "gazebo", label: "Space for my own gazebo" },
  { value: "rail", label: "Space for a clothes rail" },
];

const sizeOptions = [
  { value: "single", label: "Single pitch (one table)" },
  { value: "double", label: "Double pitch (two tables)" },
  { value: "large", label: "Large pitch (gazebo or food stall)" },
  { value: "not-sure", label: "Not sure yet" },
];

const insuranceOptions = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "not-sure", label: "Not sure" },
];

const schema = z.object({
  businessName: z.string().trim().min(2, "Please tell us your business name."),
  contactName: z.string().trim().min(2, "Please tell us who we should speak to."),
  email: z.email("Please enter an email address we can reply to."),
  phone: z
    .string()
    .trim()
    .refine((v) => v === "" || v.replace(/[^\d]/g, "").length >= 10, "That phone number looks too short."),
  category: z.string().min(1, "Please pick the closest category."),
  products: z.string().trim().min(10, "Tell us a little about what you'll sell (a sentence or two is fine)."),
  market: z.string().min(1, "Please choose a market, or any future market."),
  needs: z.array(z.string()),
  spaceSize: z.string().min(1, "Please pick a pitch size, or choose not sure."),
  insurance: z.string().min(1, "Please let us know about insurance."),
  online: z.string().trim().max(200),
  notes: z.string().max(2000, "Please keep this under 2,000 characters."),
  consent: z.literal(true, "Please tick this box so we can process your application."),
});

type Values = Omit<z.input<typeof schema>, "consent"> & { consent: boolean };
type Errors = Partial<Record<keyof Values, string>>;

const order: (keyof Values)[] = [
  "businessName",
  "contactName",
  "email",
  "phone",
  "category",
  "products",
  "market",
  "spaceSize",
  "insurance",
  "consent",
];

const noopSubscribe = () => () => {};
const readMarketParam = () => new URLSearchParams(window.location.search).get("market");

function Group({ title, step, children }: { title: string; step: number; children: ReactNode }) {
  return (
    <fieldset className="space-y-5 rounded-[1.75rem] border-2 border-espresso bg-white p-5 sm:p-7">
      <legend className="sr-only">{title}</legend>
      <div className="flex items-center gap-3" aria-hidden>
        <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-espresso bg-sunflower font-display text-lg leading-none">
          {step}
        </span>
        <span className="font-heading text-xl font-extrabold text-espresso">{title}</span>
      </div>
      {children}
    </fieldset>
  );
}

/** Market stall application. Pass upcoming markets; `?market=slug` preselects one. */
export function StallForm({ markets }: { markets: MarketOption[] }) {
  const { submit, state, honeypot, setHoneypot, submitting } = useSubmission("stall");
  const urlMarket = useSyncExternalStore(noopSubscribe, readMarketParam, () => null);
  const [values, setValues] = useState<Values>({
    businessName: "",
    contactName: "",
    email: "",
    phone: "",
    category: "",
    products: "",
    market: "",
    needs: [],
    spaceSize: "",
    insurance: "",
    online: "",
    notes: "",
    consent: false,
  });
  const [errors, setErrors] = useState<Errors>({});
  const successRef = useRef<HTMLDivElement>(null);
  const done = state.status === "success";

  // The form is replaced on success, so move focus (and the view) to the confirmation
  useEffect(() => {
    if (!done) return;
    successRef.current?.focus({ preventScroll: true });
    successRef.current?.scrollIntoView({ block: "start" });
  }, [done]);

  const marketOptions = [...markets, { value: ANY, label: "Any future market" }];
  // Until the visitor picks, default to the market in the link, else the next market
  const defaultMarket =
    (urlMarket && marketOptions.some((m) => m.value === urlMarket) ? urlMarket : markets[0]?.value) ?? ANY;
  const market = values.market || defaultMarket;

  function set<K extends keyof Values>(key: K, value: Values[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }
  const fid = (k: keyof Values) => `stall-${k}`;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const parsed = schema.safeParse({ ...values, market });
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof Values;
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      const first = order.find((k) => next[k]);
      if (first) {
        const el =
          document.getElementById(fid(first)) ??
          document.querySelector<HTMLInputElement>(`input[name="${fid(first)}"]`);
        el?.focus();
      }
      return;
    }
    const d = parsed.data;
    await submit({
      ...d,
      categoryLabel: categories.find((c) => c.id === d.category)?.label,
      marketLabel: marketOptions.find((m) => m.value === d.market)?.label,
      needs: d.needs.map((n) => needOptions.find((o) => o.value === n)?.label ?? n),
      spaceSize: sizeOptions.find((o) => o.value === d.spaceSize)?.label ?? d.spaceSize,
    });
  }

  if (done) {
    const first = values.contactName.trim().split(/\s+/)[0];
    return (
      <div ref={successRef} tabIndex={-1} className="scroll-mt-28 rounded-[1.75rem] focus:outline-none">
        <FormSuccess
          title="Application in!"
          action={
            <ButtonLink href="/events" variant="primary" iconRight={<ArrowRight className="h-4 w-4" />}>
              Back to events
            </ButtonLink>
          }
        >
          <p>
            Thanks{first ? `, ${first}` : ""}. We&apos;ve got your stall application for{" "}
            <strong className="text-espresso">{values.businessName}</strong>. We&apos;ll be in touch at {values.email} with
            next steps.
          </p>
        </FormSuccess>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} className="relative space-y-6">
      <Honeypot value={honeypot} onChange={setHoneypot} />
      <p className="text-sm text-cocoa">
        Takes about five minutes. Fields marked <span className="text-rose" aria-hidden>*</span>
        <span className="sr-only">with an asterisk</span> are required.
      </p>

      <Group step={1} title="About you">
        <div className="grid gap-5 sm:grid-cols-2">
          <TextInput
            id={fid("businessName")}
            label="Business name"
            required
            autoComplete="organization"
            value={values.businessName}
            onChange={(e) => set("businessName", e.target.value)}
            error={errors.businessName}
          />
          <TextInput
            id={fid("contactName")}
            label="Your name"
            required
            autoComplete="name"
            value={values.contactName}
            onChange={(e) => set("contactName", e.target.value)}
            error={errors.contactName}
          />
          <TextInput
            id={fid("email")}
            label="Email"
            type="email"
            inputMode="email"
            required
            autoComplete="email"
            value={values.email}
            onChange={(e) => set("email", e.target.value)}
            error={errors.email}
          />
          <TextInput
            id={fid("phone")}
            label="Phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={values.phone}
            onChange={(e) => set("phone", e.target.value)}
            error={errors.phone}
          />
        </div>
        <TextInput
          id={fid("online")}
          label="Instagram or website"
          placeholder="@yourbusiness or yourbusiness.co.uk"
          hint="So we can see your products and share your stall."
          value={values.online}
          onChange={(e) => set("online", e.target.value)}
          error={errors.online}
        />
      </Group>

      <Group step={2} title="What you sell">
        <SelectInput
          id={fid("category")}
          label="Category"
          required
          placeholder="Choose the closest fit"
          options={categories.map((c) => ({ value: c.id, label: c.label }))}
          value={values.category}
          onChange={(e) => set("category", e.target.value)}
          error={errors.category}
        />
        <TextArea
          id={fid("products")}
          label="Tell us about your products"
          required
          rows={4}
          hint="What will be on your stall? Rough price range? Anything handmade, local or new?"
          value={values.products}
          onChange={(e) => set("products", e.target.value)}
          error={errors.products}
        />
      </Group>

      <Group step={3} title="Your stall">
        <SelectInput
          id={fid("market")}
          label="Which market?"
          required
          options={marketOptions}
          value={market}
          onChange={(e) => set("market", e.target.value)}
          error={errors.market}
        />
        <ChoiceChips
          name={fid("needs")}
          label="What would you need?"
          hint="Tick all that apply. We'll confirm what each venue can offer."
          options={needOptions}
          value={values.needs}
          onChange={(v) => set("needs", v)}
        />
        <SelectInput
          id={fid("spaceSize")}
          label="Pitch size"
          required
          placeholder="Choose a size"
          options={sizeOptions}
          value={values.spaceSize}
          onChange={(e) => set("spaceSize", e.target.value)}
          error={errors.spaceSize}
        />
        <ChoiceChips
          name={fid("insurance")}
          label="Do you have public liability insurance?"
          required
          multiple={false}
          hint="Not sure? That's fine, we can talk you through it."
          options={insuranceOptions}
          value={values.insurance ? [values.insurance] : []}
          onChange={(v) => set("insurance", v[0] ?? "")}
          error={errors.insurance}
        />
      </Group>

      <Group step={4} title="Anything else">
        <TextArea
          id={fid("notes")}
          label="Anything else we should know?"
          rows={3}
          hint="Access needs, sharing a pitch with another business, selling food, or questions for us."
          value={values.notes}
          onChange={(e) => set("notes", e.target.value)}
          error={errors.notes}
        />
        <div className="rounded-2xl bg-cream-deep p-4">
          <Checkbox
            id={fid("consent")}
            checked={values.consent}
            onChange={(e) => set("consent", e.target.checked)}
            aria-invalid={!!errors.consent || undefined}
            aria-required
            error={errors.consent}
            label={
              <>
                I&apos;m happy for Black Owned Sheffield to store these details and contact me about this application.{" "}
                <span className="text-rose" aria-hidden>*</span>
              </>
            }
          />
        </div>
      </Group>

      <FormError message={state.status === "error" ? state.error : undefined} />
      {Object.values(errors).some(Boolean) && (
        <FormError message="A few details need another look. We've highlighted them above." />
      )}

      <Button
        type="submit"
        variant="pink"
        size="lg"
        disabled={submitting}
        iconRight={<ArrowRight className="h-5 w-5" aria-hidden />}
        className="w-full sm:w-auto"
      >
        {submitting ? "Sending…" : "Send my application"}
      </Button>
    </form>
  );
}
