"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, CloudCheck, CloudOff, Pencil, RotateCcw, Send, Sparkles } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Checkbox, ChoiceChips, Honeypot, SelectInput, TextArea, TextInput } from "@/components/forms/fields";
import { FormError, FormSuccess } from "@/components/forms/FormStatus";
import { useSubmission } from "@/components/forms/useSubmission";
import { InstagramIcon } from "@/components/icons/SocialIcons";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";
import { focusFirstError, formatPostcode, heardAboutOptions, type Errors } from "./formKit";
import { HoursEditor } from "./HoursEditor";
import { summariseHours } from "./hours";
import { FormCard, NextSteps } from "./panels";
import { Stepper } from "./Stepper";
import { Switch } from "./Switch";
import { TagInput } from "./TagInput";
import {
  DESCRIPTION_MAX,
  DESCRIPTION_MIN,
  TAGLINE_MAX,
  areaLabel,
  businessPayload,
  businessSteps,
  categoryLabel,
  categoryOptions,
  emptyBusinessDraft,
  regionLabel,
  regionOptions,
  roleSuggestions,
  serviceIdeas,
  sheffieldAreaOptions,
  validateBusinessStep,
  type BusinessDraft,
} from "./businessSchema";

const DRAFT_KEY = "bos:join-business:v1";
const P = "bf"; // id prefix
const LAST = businessSteps.length - 1;

type StoredDraft = { savedAt: string; step: number; furthest: number; values: BusinessDraft };

function loadDraft(): StoredDraft | null {
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredDraft>;
    if (!parsed.values || typeof parsed.values !== "object") return null;
    const values = { ...emptyBusinessDraft, ...parsed.values, consent: false };
    // Consent is never saved, so a draft left on Review reopens on Extras where the box lives
    const step = Math.min(Math.max(Number(parsed.step) || 0, 0), LAST - 1);
    const furthest = Math.min(Math.max(Number(parsed.furthest) || step, step), LAST);
    return { savedAt: parsed.savedAt ?? new Date().toISOString(), step, furthest, values };
  } catch {
    return null;
  }
}

function saveDraft(d: StoredDraft) {
  try {
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(d));
    return true;
  } catch {
    return false;
  }
}

function clearDraft() {
  try {
    window.localStorage.removeItem(DRAFT_KEY);
  } catch {
    /* storage unavailable: nothing to clear */
  }
}

const noopSubscribe = () => () => {};

/**
 * Renders a skeleton on the server, then mounts the real form on the client
 * so the saved draft (localStorage) can seed the initial state without a
 * hydration mismatch.
 */
export function BusinessApplication() {
  const isClient = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
  if (!isClient) return <FormSkeleton />;
  return <BusinessForm />;
}

function FormSkeleton() {
  return (
    <FormCard>
      <div className="flex items-center gap-3" aria-hidden>
        {businessSteps.map((s) => (
          <span key={s.title} className="h-10 flex-1 rounded-full bg-cream-deep" />
        ))}
      </div>
      <div className="mt-10 h-8 w-2/3 rounded-full bg-cream-deep" aria-hidden />
      <div className="mt-6 grid gap-5 sm:grid-cols-2" aria-hidden>
        {Array.from({ length: 6 }).map((_, i) => (
          <span key={i} className="h-12 rounded-2xl bg-cream-deep" />
        ))}
      </div>
      <p className="mt-8 text-sm text-cocoa">Loading the application form…</p>
      <noscript>
        <p className="mt-2 text-sm font-semibold text-rose-ink">
          This form needs JavaScript switched on. You can also message us on Instagram at {site.instagramHandle}.
        </p>
      </noscript>
    </FormCard>
  );
}

function BusinessForm() {
  const [initial] = useState(loadDraft);
  const [values, setValues] = useState<BusinessDraft>(initial?.values ?? emptyBusinessDraft);
  const [step, setStep] = useState(initial?.step ?? 0);
  const [furthest, setFurthest] = useState(initial?.furthest ?? 0);
  const [errors, setErrors] = useState<Errors>({});
  const [restored, setRestored] = useState<string | null>(initial?.savedAt ?? null);
  const [draftState, setDraftState] = useState<{ status: "idle" | "saved" | "unavailable"; at?: string }>(
    initial ? { status: "saved", at: initial.savedAt } : { status: "idle" },
  );
  const { submit, state, honeypot, setHoneypot, submitting } = useSubmission("business");
  const reduceMotion = useReducedMotion();

  const cardRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const focusOnStep = useRef(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Move focus to the new step's heading after Back/Next/Edit
  useEffect(() => {
    if (!focusOnStep.current) return;
    focusOnStep.current = false;
    headingRef.current?.focus({ preventScroll: true });
    cardRef.current?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  }, [step, reduceMotion]);

  // Announce success and bring it into view
  useEffect(() => {
    if (state.status !== "success") return;
    successRef.current?.focus({ preventScroll: true });
    successRef.current?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  }, [state.status, reduceMotion]);

  useEffect(
    () => () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    },
    [],
  );

  function scheduleSave(nextValues: BusinessDraft, nextStep: number, nextFurthest: number) {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      const at = new Date().toISOString();
      const ok = saveDraft({ savedAt: at, step: nextStep, furthest: nextFurthest, values: { ...nextValues, consent: false } });
      setDraftState(ok ? { status: "saved", at } : { status: "unavailable" });
    }, 600);
  }

  function update(patch: Partial<BusinessDraft>) {
    const next = { ...values, ...patch };
    setValues(next);
    const touched = Object.keys(patch);
    const stale = Object.keys(errors).filter(
      (k) => touched.some((t) => k === t || k.startsWith(`${t}.`)) || (k === "_contact" && step === 3),
    );
    if (stale.length) {
      setErrors((prev) => {
        const out = { ...prev };
        for (const k of stale) delete out[k];
        return out;
      });
    }
    scheduleSave(next, step, furthest);
  }

  function goTo(i: number) {
    const target = Math.min(Math.max(i, 0), LAST);
    const nextFurthest = Math.max(furthest, target);
    focusOnStep.current = true;
    setErrors({});
    setStep(target);
    setFurthest(nextFurthest);
    scheduleSave(values, target, nextFurthest);
  }

  function validateStep(i: number): Errors {
    return validateBusinessStep(i, values);
  }

  /** After someone has reached Review, editing a section sends them straight back to it */
  const backToReview = furthest === LAST && step < LAST;

  function next() {
    const errs = validateStep(step);
    if (Object.keys(errs).length) {
      setErrors(errs);
      focusFirstError(P, errs);
      return;
    }
    goTo(backToReview ? LAST : step + 1);
  }

  async function onSubmit() {
    // Re-check every step before sending
    for (let i = 0; i < LAST; i++) {
      const errs = validateStep(i);
      if (Object.keys(errs).length) {
        goTo(i);
        setErrors(errs);
        return;
      }
    }
    const ok = await submit(businessPayload(values));
    if (ok) {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      clearDraft();
    }
  }

  function startAgain() {
    if (!window.confirm("Clear your saved answers and start again?")) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    clearDraft();
    setValues(emptyBusinessDraft);
    setRestored(null);
    setDraftState({ status: "idle" });
    setErrors({});
    focusOnStep.current = true;
    setStep(0);
    setFurthest(0);
  }

  if (state.status === "success") {
    const first = values.contactName.trim().split(/\s+/)[0];
    return (
      <div ref={successRef} tabIndex={-1} className="scroll-mt-28 focus:outline-none">
        <h2 className="sr-only">Application sent</h2>
        <FormSuccess
          title={`${values.businessName.trim() || "Your business"} is in the queue!`}
          action={
            <div className="flex flex-wrap justify-center gap-3">
              <ButtonLink href={site.socials.instagram} variant="primary" icon={<InstagramIcon size={18} />}>
                Tag us on Instagram
              </ButtonLink>
              <ButtonLink href="/directory" variant="outline" iconRight={<ArrowRight className="h-4 w-4" />}>
                Explore the directory
              </ButtonLink>
            </div>
          }
        >
          <p>
            Thank you{first ? `, ${first}` : ""}. Your application has landed with the team. Here&apos;s what happens next:
          </p>
          <NextSteps
            className="mx-auto mt-6 max-w-sm"
            steps={[
              { title: "We check your details", text: "A real person reads every application." },
              {
                title: "We say hello",
                text: `Within ${site.replyTime}, by email to ${values.email.trim() || "you"}.`,
              },
              { title: "You go live", text: "Your listing appears in the directory and on the map." },
            ]}
          />
          <p className="mt-6 text-sm">
            While you wait, share the news: tag <strong>{site.instagramHandle}</strong> in a story so your customers know
            you&apos;re joining.
          </p>
        </FormSuccess>
      </div>
    );
  }

  const current = businessSteps[step]!;
  const e = (k: string) => errors[k];
  const hoursErrors = Object.fromEntries(
    Object.entries(errors)
      .filter(([k]) => k.startsWith("hours."))
      .map(([k, v]) => [k.slice(6), v]),
  );
  const errorCount = Object.keys(errors).length;

  return (
    <div ref={cardRef} className="scroll-mt-28">
      <FormCard>
        <Stepper steps={[...businessSteps]} current={step} furthest={furthest} onSelect={goTo} />

        {restored && (
          <div className="mt-6 flex flex-col gap-3 rounded-2xl border-2 border-teal bg-teal/10 px-4 py-3 text-sm text-espresso sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-start gap-2">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-teal" aria-hidden />
              <span>
                <strong>Welcome back.</strong> We&apos;ve picked up your saved answers from {formatWhen(restored)}.
              </span>
            </p>
            <button
              type="button"
              onClick={startAgain}
              className="inline-flex min-h-11 items-center gap-1.5 self-start rounded-full px-3 font-semibold text-forest underline underline-offset-4 hover:text-espresso sm:self-auto"
            >
              <RotateCcw className="h-4 w-4" aria-hidden />
              Start again
            </button>
          </div>
        )}

        <form
          noValidate
          className="relative mt-8"
          onSubmit={(ev) => {
            ev.preventDefault();
            if (step === LAST) void onSubmit();
            else next();
          }}
        >
          <Honeypot value={honeypot} onChange={setHoneypot} />

          <header className="mb-7">
            <p className="hidden font-heading text-xs font-bold uppercase tracking-[0.18em] text-rose-ink sm:block">
              Step {step + 1} of {businessSteps.length}
            </p>
            <h2
              ref={headingRef}
              tabIndex={-1}
              className="mt-1.5 font-heading text-2xl font-extrabold text-espresso focus:outline-none sm:text-3xl"
            >
              {current.title}
            </h2>
            <p className="mt-2 text-cocoa">{current.intro}</p>
          </header>

          {errorCount > 0 && (
            <FormError
              className="mb-6"
              message={
                errorCount === 1
                  ? "There's one thing to fix before you carry on."
                  : `There are ${errorCount} things to fix before you carry on.`
              }
            />
          )}

          {step === 0 && (
            <div className="grid gap-5 sm:grid-cols-2">
              <TextInput
                id={`${P}-businessName`}
                label="Business name"
                required
                autoComplete="organization"
                value={values.businessName}
                onChange={(ev) => update({ businessName: ev.target.value })}
                error={e("businessName")}
                wrapperClassName="sm:col-span-2"
              />
              <TextInput
                id={`${P}-contactName`}
                label="Your name"
                required
                autoComplete="name"
                value={values.contactName}
                onChange={(ev) => update({ contactName: ev.target.value })}
                error={e("contactName")}
              />
              <TextInput
                id={`${P}-role`}
                label="Your role"
                required
                list={`${P}-role-list`}
                placeholder="Founder, owner, director…"
                autoComplete="organization-title"
                value={values.role}
                onChange={(ev) => update({ role: ev.target.value })}
                error={e("role")}
              />
              <datalist id={`${P}-role-list`}>
                {roleSuggestions.map((r) => (
                  <option key={r} value={r} />
                ))}
              </datalist>
              <TextInput
                id={`${P}-email`}
                label="Email"
                type="email"
                required
                autoComplete="email"
                hint="Just for us to reply. You choose a public email later."
                value={values.email}
                onChange={(ev) => update({ email: ev.target.value })}
                error={e("email")}
              />
              <TextInput
                id={`${P}-phone`}
                label="Phone"
                type="tel"
                autoComplete="tel"
                hint="In case we need a quick chat."
                value={values.phone}
                onChange={(ev) => update({ phone: ev.target.value })}
                error={e("phone")}
              />
              <TextInput
                id={`${P}-established`}
                label="Year established"
                inputMode="numeric"
                maxLength={4}
                placeholder={`e.g. ${new Date().getFullYear() - 2}`}
                value={values.established}
                onChange={(ev) => update({ established: ev.target.value.replace(/\D/g, "") })}
                error={e("established")}
              />
              <div className="rounded-2xl border-2 border-espresso bg-blush/60 p-4 sm:col-span-2">
                <Checkbox
                  id={`${P}-blackOwned`}
                  checked={values.blackOwned}
                  onChange={(ev) => update({ blackOwned: ev.target.checked })}
                  error={e("blackOwned")}
                  aria-invalid={!!e("blackOwned") || undefined}
                  label={
                    <>
                      <strong className="text-espresso">
                        My business is at least 51% Black-owned or Black-led.
                        <span className="ml-0.5 text-rose" aria-hidden>
                          *
                        </span>
                      </strong>{" "}
                      We take your word for it: this is self-declared.
                    </>
                  }
                />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="grid gap-6">
              <SelectInput
                id={`${P}-category`}
                label="Main category"
                required
                placeholder="Choose a category"
                options={categoryOptions}
                value={values.category}
                onChange={(ev) =>
                  update({
                    category: ev.target.value,
                    secondaryCategories: values.secondaryCategories.filter((c) => c !== ev.target.value),
                  })
                }
                error={e("category")}
              />
              <div id={`${P}-secondaryCategories`}>
                <ChoiceChips
                  name="secondaryCategories"
                  label="Also fits under"
                  hint="Pick up to two more, if they fit."
                  options={categoryOptions.filter((c) => c.value !== values.category)}
                  value={values.secondaryCategories}
                  onChange={(v) => {
                    if (v.length > 2) {
                      setErrors((prev) => ({ ...prev, secondaryCategories: "You can pick up to two extra categories." }));
                      return;
                    }
                    update({ secondaryCategories: v });
                  }}
                  error={e("secondaryCategories")}
                />
              </div>
              <div>
                <TextInput
                  id={`${P}-tagline`}
                  label="Tagline"
                  required
                  maxLength={TAGLINE_MAX}
                  placeholder="e.g. West African comfort food, cooked low and slow."
                  hint="One line that sums you up."
                  aria-describedby={`${P}-tagline-count`}
                  value={values.tagline}
                  onChange={(ev) => update({ tagline: ev.target.value })}
                  error={e("tagline")}
                />
                <Counter id={`${P}-tagline-count`} warn={values.tagline.length > TAGLINE_MAX - 10}>
                  {values.tagline.length}/{TAGLINE_MAX} characters
                </Counter>
              </div>
              <div>
                <TextArea
                  id={`${P}-description`}
                  label="Describe your business"
                  required
                  rows={6}
                  maxLength={DESCRIPTION_MAX}
                  placeholder="What you do, who it's for, what makes you different, and the story behind it."
                  aria-describedby={`${P}-description-count`}
                  value={values.description}
                  onChange={(ev) => update({ description: ev.target.value })}
                  error={e("description")}
                />
                <Counter id={`${P}-description-count`} ok={values.description.trim().length >= DESCRIPTION_MIN}>
                  {values.description.trim().length >= DESCRIPTION_MIN
                    ? `${values.description.trim().length} characters. Looking good.`
                    : `${values.description.trim().length} of ${DESCRIPTION_MIN} characters minimum`}
                </Counter>
              </div>
              <TagInput
                id={`${P}-services`}
                label="Services and products"
                required
                hint="What can people buy or book? Add each one separately."
                placeholder="e.g. Event catering"
                value={values.services}
                onChange={(v) => update({ services: v })}
                error={e("services")}
                suggestions={serviceIdeas[values.category]}
              />
              <TagInput
                id={`${P}-keywords`}
                label="Search keywords"
                hint="Words people might search for: dishes, styles, languages, specialisms."
                placeholder="e.g. jollof, halal, braids"
                max={15}
                value={values.keywords}
                onChange={(v) => update({ keywords: v })}
                error={e("keywords")}
              />
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-6">
              <div id={`${P}-region`}>
                <ChoiceChips
                  name="region"
                  label="Where are you based?"
                  required
                  multiple={false}
                  options={regionOptions}
                  value={values.region ? [values.region] : []}
                  onChange={(v) => update({ region: v[0] ?? "", area: v[0] === "sheffield" ? values.area : "" })}
                  error={e("region")}
                />
              </div>
              <Switch
                id={`${P}-onlineOnly`}
                checked={values.onlineOnly}
                onChange={(v) => update({ onlineOnly: v })}
                label="We're online or mobile only"
                description="No shopfront? No problem. Mobile hairdressers, online shops and home kitchens are all welcome."
              />
              {values.region === "sheffield" && (
                <SelectInput
                  id={`${P}-area`}
                  label="Which part of Sheffield?"
                  required={!values.onlineOnly}
                  placeholder="Choose an area"
                  options={sheffieldAreaOptions}
                  value={values.area}
                  onChange={(ev) => update({ area: ev.target.value })}
                  error={e("area")}
                />
              )}
              <div className="grid gap-5 sm:grid-cols-3">
                <TextInput
                  id={`${P}-address`}
                  label="Address"
                  required={!values.onlineOnly}
                  autoComplete="street-address"
                  placeholder="Unit, street and town"
                  hint={values.onlineOnly ? "Only if you have a base customers can visit." : "Where customers can find you."}
                  value={values.address}
                  onChange={(ev) => update({ address: ev.target.value })}
                  error={e("address")}
                  wrapperClassName="sm:col-span-2"
                />
                <TextInput
                  id={`${P}-postcode`}
                  label="Postcode"
                  required={!values.onlineOnly}
                  autoComplete="postal-code"
                  autoCapitalize="characters"
                  placeholder="S3 8JB"
                  hint={values.onlineOnly ? "Or just the first half." : "Puts you on the map."}
                  value={values.postcode}
                  onChange={(ev) => update({ postcode: ev.target.value })}
                  onBlur={() => values.postcode && update({ postcode: formatPostcode(values.postcode) })}
                  error={e("postcode")}
                />
              </div>
              <TextInput
                id={`${P}-serviceArea`}
                label={values.onlineOnly ? "Where do you work or deliver?" : "Service area"}
                required={values.onlineOnly}
                placeholder="e.g. Sheffield and South Yorkshire, or UK-wide delivery"
                value={values.serviceArea}
                onChange={(ev) => update({ serviceArea: ev.target.value })}
                error={e("serviceArea")}
              />
            </div>
          )}

          {step === 3 && (
            <div id={`${P}-_contact`} className="grid gap-6">
              {e("_contact") && (
                <p role="alert" className="rounded-2xl border-2 border-rose bg-blush px-4 py-3 text-sm font-semibold text-rose-ink">
                  {e("_contact")}
                </p>
              )}
              <div className="grid gap-5 sm:grid-cols-2">
                <TextInput
                  id={`${P}-website`}
                  label="Website"
                  type="url"
                  inputMode="url"
                  autoComplete="url"
                  placeholder="www.yourbusiness.co.uk"
                  value={values.website}
                  onChange={(ev) => update({ website: ev.target.value })}
                  error={e("website")}
                />
                <TextInput
                  id={`${P}-bookingUrl`}
                  label="Booking or shop link"
                  type="url"
                  inputMode="url"
                  placeholder="Fresha, Booksy, Etsy, Shopify…"
                  value={values.bookingUrl}
                  onChange={(ev) => update({ bookingUrl: ev.target.value })}
                  error={e("bookingUrl")}
                />
              </div>
              <div>
                <h3 className="font-heading text-base font-bold text-espresso">Socials</h3>
                <p className="mt-0.5 text-xs text-cocoa/80">Your @handle or a full link. We&apos;ll tidy them up.</p>
                <div className="mt-3 grid gap-5 sm:grid-cols-2">
                  <TextInput
                    id={`${P}-instagram`}
                    label="Instagram"
                    placeholder="@yourbusiness"
                    autoCapitalize="none"
                    value={values.instagram}
                    onChange={(ev) => update({ instagram: ev.target.value })}
                    error={e("instagram")}
                  />
                  <TextInput
                    id={`${P}-tiktok`}
                    label="TikTok"
                    placeholder="@yourbusiness"
                    autoCapitalize="none"
                    value={values.tiktok}
                    onChange={(ev) => update({ tiktok: ev.target.value })}
                    error={e("tiktok")}
                  />
                  <TextInput
                    id={`${P}-facebook`}
                    label="Facebook"
                    placeholder="Page name or link"
                    autoCapitalize="none"
                    value={values.facebook}
                    onChange={(ev) => update({ facebook: ev.target.value })}
                    error={e("facebook")}
                  />
                  <TextInput
                    id={`${P}-linkedin`}
                    label="LinkedIn"
                    placeholder="Company page link"
                    autoCapitalize="none"
                    value={values.linkedin}
                    onChange={(ev) => update({ linkedin: ev.target.value })}
                    error={e("linkedin")}
                  />
                </div>
              </div>
              <div>
                <h3 className="font-heading text-base font-bold text-espresso">Public contact details</h3>
                <p className="mt-0.5 text-xs text-cocoa/80">These show on your listing. Leave blank to keep them private.</p>
                <div className="mt-3 grid gap-5 sm:grid-cols-2">
                  <TextInput
                    id={`${P}-publicPhone`}
                    label="Public phone"
                    type="tel"
                    value={values.publicPhone}
                    onChange={(ev) => update({ publicPhone: ev.target.value })}
                    error={e("publicPhone")}
                  />
                  <TextInput
                    id={`${P}-publicEmail`}
                    label="Public email"
                    type="email"
                    value={values.publicEmail}
                    onChange={(ev) => update({ publicEmail: ev.target.value })}
                    error={e("publicEmail")}
                  />
                </div>
                {values.email && !values.publicEmail && (
                  <button
                    type="button"
                    onClick={() => update({ publicEmail: values.email.trim(), ...(values.phone && !values.publicPhone ? { publicPhone: values.phone.trim() } : {}) })}
                    className="mt-3 inline-flex min-h-11 items-center gap-1.5 rounded-full text-sm font-semibold text-rose-ink underline underline-offset-4 hover:text-espresso"
                  >
                    Use the details from step 1
                  </button>
                )}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="grid gap-8">
              <HoursEditor
                id={`${P}-hours`}
                value={values.hours}
                onChange={(h) => update({ hours: h })}
                errors={hoursErrors}
              />

              <div className="grid gap-4">
                <Switch
                  id={`${P}-hasOffer`}
                  checked={values.hasOffer}
                  onChange={(v) => update({ hasOffer: v })}
                  label="Add a special offer for BOS visitors and members"
                  description="A discount or extra that's offered through us. It shows on your listing and helps new customers take the first step."
                />
                {values.hasOffer && (
                  <div className="grid gap-5 rounded-2xl border-2 border-dashed border-espresso/25 bg-cream p-4 sm:grid-cols-2 sm:p-5">
                    <TextInput
                      id={`${P}-offerTitle`}
                      label="Offer title"
                      required
                      maxLength={60}
                      placeholder="e.g. 10% off your first order"
                      value={values.offerTitle}
                      onChange={(ev) => update({ offerTitle: ev.target.value })}
                      error={e("offerTitle")}
                    />
                    <TextInput
                      id={`${P}-offerCode`}
                      label="Discount code"
                      maxLength={30}
                      placeholder="e.g. BOS10"
                      autoCapitalize="characters"
                      value={values.offerCode}
                      onChange={(ev) => update({ offerCode: ev.target.value })}
                      error={e("offerCode")}
                    />
                    <TextArea
                      id={`${P}-offerDetails`}
                      label="How it works"
                      required
                      rows={3}
                      maxLength={300}
                      placeholder="e.g. Mention Black Owned Sheffield when you book. Not valid with other offers."
                      value={values.offerDetails}
                      onChange={(ev) => update({ offerDetails: ev.target.value })}
                      error={e("offerDetails")}
                      wrapperClassName="sm:col-span-2"
                    />
                  </div>
                )}
              </div>

              <div className="grid gap-4">
                <div id={`${P}-photos`}>
                  <ChoiceChips
                    name="photos"
                    label="Logo and photos"
                    hint="Great photos make a listing. Square logos and bright, landscape photos work best."
                    required
                    multiple={false}
                    options={[
                      { value: "email", label: "Email me about photos" },
                      { value: "links", label: "I'll add links now" },
                    ]}
                    value={[values.photos]}
                    onChange={(v) => update({ photos: (v[0] as BusinessDraft["photos"]) ?? "email" })}
                  />
                </div>
                {values.photos === "links" && (
                  <div className="grid gap-5 sm:grid-cols-2">
                    <TextInput
                      id={`${P}-logoUrl`}
                      label="Link to your logo"
                      type="url"
                      inputMode="url"
                      placeholder="Google Drive, Dropbox or your website"
                      value={values.logoUrl}
                      onChange={(ev) => update({ logoUrl: ev.target.value })}
                      error={e("logoUrl")}
                      wrapperClassName="sm:col-span-2"
                    />
                    <TextArea
                      id={`${P}-photoLinks`}
                      label="Links to photos"
                      hint="One per line. A shared folder or Instagram posts are fine."
                      rows={3}
                      value={values.photoLinks}
                      onChange={(ev) => update({ photoLinks: ev.target.value })}
                      error={e("photoLinks")}
                      wrapperClassName="sm:col-span-2"
                    />
                  </div>
                )}
              </div>

              <SelectInput
                id={`${P}-heardAbout`}
                label="How did you hear about us?"
                placeholder="Choose one"
                options={heardAboutOptions}
                value={values.heardAbout}
                onChange={(ev) => update({ heardAbout: ev.target.value })}
              />

              <div className="grid gap-4 rounded-2xl border-2 border-espresso bg-cream-deep p-4 sm:p-5">
                <Checkbox
                  id={`${P}-upgradeInterest`}
                  checked={values.upgradeInterest}
                  onChange={(ev) => update({ upgradeInterest: ev.target.checked })}
                  label="Tell me when Plus and Featured listings launch in 2027."
                />
                <Checkbox
                  id={`${P}-consent`}
                  checked={values.consent}
                  onChange={(ev) => update({ consent: ev.target.checked })}
                  error={e("consent")}
                  aria-invalid={!!e("consent") || undefined}
                  label={
                    <>
                      <strong className="text-espresso">
                        I&apos;m happy for this business to be listed publicly in the Black Owned Sheffield directory, and for
                        the team to contact me about my listing.
                        <span className="ml-0.5 text-rose" aria-hidden>
                          *
                        </span>
                      </strong>{" "}
                      Only the public details you&apos;ve given will appear on your listing.
                    </>
                  }
                />
                <p className="pl-8 text-xs text-cocoa">
                  Read how we look after your details in our{" "}
                  <Link href="/privacy" className="font-semibold text-rose-ink underline underline-offset-2">
                    privacy notice
                  </Link>
                  .
                </p>
              </div>
            </div>
          )}

          {step === LAST && <Review values={values} onEdit={goTo} />}

          {state.status === "error" && <FormError className="mt-6" message={state.error} />}

          <div className="mt-10 flex flex-col-reverse gap-4 border-t-2 border-dashed border-espresso/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <DraftIndicator state={draftState} />
            <div className="flex gap-3">
              {step > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => goTo(step - 1)}
                  icon={<ArrowLeft className="h-4 w-4" aria-hidden />}
                  // Icon-only on phones so "Send application" fits beside it at 375px
                  className="w-14 shrink-0 gap-0 px-0 sm:w-auto sm:gap-2 sm:px-7"
                >
                  <span className="sr-only sm:not-sr-only">Back</span>
                </Button>
              )}
              {step < LAST ? (
                <Button
                  type="submit"
                  size="lg"
                  iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}
                  className="flex-1 sm:flex-none"
                >
                  {backToReview ? "Back to review" : step === LAST - 1 ? "Review" : "Next"}
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="pink"
                  size="lg"
                  disabled={submitting}
                  iconRight={<Send className="h-4 w-4" aria-hidden />}
                  className="flex-1 sm:flex-none"
                >
                  {submitting ? "Sending…" : "Send application"}
                </Button>
              )}
            </div>
          </div>
        </form>
      </FormCard>
    </div>
  );
}

function Counter({ id, children, warn, ok }: { id: string; children: ReactNode; warn?: boolean; ok?: boolean }) {
  return (
    <p
      id={id}
      className={cn(
        "mt-1.5 text-right text-xs font-semibold",
        warn ? "text-rose-ink" : ok ? "text-forest" : "text-cocoa/80",
      )}
    >
      {children}
    </p>
  );
}

function formatWhen(iso: string) {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return "earlier";
  }
}

function DraftIndicator({ state }: { state: { status: "idle" | "saved" | "unavailable"; at?: string } }) {
  if (state.status === "unavailable") {
    return (
      <p className="flex items-center gap-2 text-xs font-medium text-cocoa/80" role="status">
        <CloudOff className="h-4 w-4 shrink-0" aria-hidden />
        We can&apos;t save a draft in this browser, so finish in one go.
      </p>
    );
  }
  if (state.status === "saved" && state.at) {
    return (
      <p className="flex items-center gap-2 text-xs font-semibold text-forest" role="status">
        <CloudCheck className="h-4 w-4 shrink-0" aria-hidden />
        Draft saved on this device · {new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit" }).format(new Date(state.at))}
      </p>
    );
  }
  return (
    <p className="flex items-center gap-2 text-xs font-medium text-cocoa/80">
      <CloudCheck className="h-4 w-4 shrink-0" aria-hidden />
      Your answers save on this device as you go.
    </p>
  );
}

// ─── Review step ────────────────────────────────────────────────────────────

function Review({ values: v, onEdit }: { values: BusinessDraft; onEdit: (step: number) => void }) {
  const sections: { step: number; rows: [string, ReactNode][] }[] = [
    {
      step: 0,
      rows: [
        ["Business name", v.businessName],
        ["Your name", v.contactName],
        ["Your role", v.role],
        ["Email", v.email],
        ["Phone", v.phone],
        ["Year established", v.established],
        ["Black-owned or Black-led", v.blackOwned ? "Yes, at least 51% (self-declared)" : "Not confirmed"],
      ],
    },
    {
      step: 1,
      rows: [
        ["Main category", v.category ? categoryLabel(v.category) : ""],
        ["Also fits under", v.secondaryCategories.map(categoryLabel).join(", ")],
        ["Tagline", v.tagline],
        ["Description", <span key="d" className="whitespace-pre-line">{v.description}</span>],
        ["Services", v.services.length ? <Chips key="s" items={v.services} /> : ""],
        ["Keywords", v.keywords.length ? <Chips key="k" items={v.keywords} /> : ""],
      ],
    },
    {
      step: 2,
      rows: [
        ["Based in", v.region ? regionLabel(v.region) : ""],
        ["Area", v.region === "sheffield" && v.area ? areaLabel(v.area) : ""],
        ["Online or mobile only", v.onlineOnly ? "Yes" : "No"],
        ["Address", v.address],
        ["Postcode", v.postcode ? formatPostcode(v.postcode) : ""],
        ["Service area", v.serviceArea],
      ],
    },
    {
      step: 3,
      rows: [
        ["Website", v.website],
        ["Booking or shop link", v.bookingUrl],
        ["Instagram", v.instagram],
        ["TikTok", v.tiktok],
        ["Facebook", v.facebook],
        ["LinkedIn", v.linkedin],
        ["Public phone", v.publicPhone],
        ["Public email", v.publicEmail],
      ],
    },
    {
      step: 4,
      rows: [
        ["Opening hours", summariseHours(v.hours)],
        [
          "Special offer",
          v.hasOffer ? `${v.offerTitle}${v.offerCode ? ` (code ${v.offerCode})` : ""}. ${v.offerDetails}` : "",
        ],
        ["Photos", v.photos === "links" ? [v.logoUrl, v.photoLinks].filter(Boolean).join("\n") || "Links to follow" : "Email me about photos"],
        ["How you heard about us", v.heardAbout],
        ["Plus and Featured updates", v.upgradeInterest ? "Yes please" : ""],
        ["Public listing consent", v.consent ? "Yes" : "Not yet ticked"],
      ],
    },
  ];

  return (
    <div className="grid gap-5">
      {sections.map((s) => {
        const rows = s.rows.filter(([, val]) => val !== "" && val !== undefined);
        const title = businessSteps[s.step]!.title;
        return (
          <section key={s.step} className="rounded-2xl border-2 border-espresso/15 bg-cream/60 p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-heading text-lg font-extrabold text-espresso">{title}</h3>
              <button
                type="button"
                onClick={() => onEdit(s.step)}
                className="inline-flex min-h-11 items-center gap-1.5 rounded-full border-2 border-espresso bg-white px-3.5 text-sm font-bold text-espresso transition-all hover:-translate-y-0.5 hover:shadow-pop-sm"
              >
                <Pencil className="h-3.5 w-3.5" aria-hidden />
                Edit<span className="sr-only"> {title}</span>
              </button>
            </div>
            {rows.length ? (
              <dl className="mt-3 divide-y divide-espresso/10">
                {rows.map(([label, val]) => (
                  <div key={label} className="grid gap-1 py-2.5 sm:grid-cols-[11rem_1fr] sm:gap-4">
                    <dt className="text-xs font-bold uppercase tracking-wide text-cocoa/80">{label}</dt>
                    <dd className="text-sm break-words whitespace-pre-line text-espresso">{val}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="mt-2 text-sm text-cocoa">Nothing added yet.</p>
            )}
          </section>
        );
      })}
    </div>
  );
}

function Chips({ items }: { items: string[] }) {
  return (
    <span className="flex flex-wrap gap-1.5">
      {items.map((i) => (
        <span key={i} className="rounded-full bg-espresso px-2.5 py-1 text-xs font-semibold text-cream">
          {i}
        </span>
      ))}
    </span>
  );
}
