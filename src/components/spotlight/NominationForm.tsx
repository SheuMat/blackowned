"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Checkbox, ChoiceChips, Honeypot, SelectInput, TextArea, TextInput } from "@/components/forms/fields";
import { FormError, FormSuccess } from "@/components/forms/FormStatus";
import { useSubmission } from "@/components/forms/useSubmission";
import { regions } from "@/content/areas";
import { cn } from "@/lib/utils";

const relationshipOptions = [
  { value: "customer", label: "I'm a customer or fan" },
  { value: "owner", label: "It's my business" },
  { value: "staff", label: "I work there" },
  { value: "other", label: "Something else" },
];

const whereOptions = [
  ...regions.map((r) => ({ value: r.id, label: r.label })),
  { value: "online", label: "Online / no fixed location" },
  { value: "elsewhere", label: "Somewhere else in South Yorkshire" },
];

/** "Nominate a business" for the Community Spotlight. Posts as a spotlight submission with kind: "nomination". */
export function NominationForm({ className }: { className?: string }) {
  const [businessName, setBusinessName] = useState("");
  const [link, setLink] = useState("");
  const [where, setWhere] = useState("");
  const [why, setWhy] = useState("");
  const [relationship, setRelationship] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [okToContact, setOkToContact] = useState(false);
  const { submit, state, setState, honeypot, setHoneypot, submitting } = useSubmission("spotlight");

  function reset() {
    setBusinessName("");
    setLink("");
    setWhere("");
    setWhy("");
    setRelationship([]);
    setState({ status: "idle" });
  }

  if (state.status === "success") {
    return (
      <FormSuccess
        title="Nomination received"
        className={className}
        action={
          <Button type="button" variant="outline" onClick={reset}>
            Nominate another business
          </Button>
        }
      >
        <p>
          Thank you for shouting about {businessName || "them"}. We&apos;ll be in touch if we need anything else.
        </p>
      </FormSuccess>
    );
  }

  return (
    <form
      aria-labelledby="nominate-form-heading"
      className={cn("relative rounded-[1.75rem] border-2 border-espresso bg-white p-6 shadow-pop sm:p-8", className)}
      onSubmit={async (e) => {
        e.preventDefault();
        await submit({
          kind: "nomination",
          businessName,
          businessLink: link,
          where,
          why,
          relationship: relationship[0],
          name,
          email,
          okToContactBusiness: okToContact,
          source: "/spotlight#nominate",
        });
      }}
    >
      <Honeypot value={honeypot} onChange={setHoneypot} />
      <h3 id="nominate-form-heading" className="font-heading text-2xl font-extrabold text-espresso">
        Your nomination
      </h3>

      <fieldset className="mt-6">
        <legend className="mb-4 font-heading text-xs font-bold uppercase tracking-[0.18em] text-rose-ink">
          The business
        </legend>
        <div className="grid gap-5 sm:grid-cols-2 sm:items-end">
          <TextInput
            label="Business name"
            required
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            wrapperClassName="sm:col-span-2"
          />
          <TextInput
            label="Instagram or website"
            type="text"
            inputMode="url"
            placeholder="@handle or link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
          <SelectInput
            label="Where are they?"
            placeholder="Choose a place"
            options={whereOptions}
            value={where}
            onChange={(e) => setWhere(e.target.value)}
          />
          <TextArea
            label="Why should they be in the Spotlight?"
            hint="What makes them special? A great product, brilliant service, the difference they make locally."
            required
            rows={5}
            value={why}
            onChange={(e) => setWhy(e.target.value)}
            wrapperClassName="sm:col-span-2"
          />
          <ChoiceChips
            label="How do you know them?"
            name="relationship"
            multiple={false}
            options={relationshipOptions}
            value={relationship}
            onChange={setRelationship}
            className="sm:col-span-2"
          />
        </div>
      </fieldset>

      <div className="mt-8 border-t-2 border-espresso/10 pt-6">
      <fieldset>
        <legend className="mb-4 font-heading text-xs font-bold uppercase tracking-[0.18em] text-rose-ink">
          About you
        </legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <TextInput label="Your name" required autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
          <TextInput
            label="Your email"
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Checkbox
            label="It's fine to tell the business who nominated them."
            checked={okToContact}
            onChange={(e) => setOkToContact(e.target.checked)}
            className="sm:col-span-2"
          />
        </div>
      </fieldset>
      </div>

      <FormError message={state.status === "error" ? state.error : undefined} className="mt-5" />

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <Button type="submit" variant="pink" size="lg" disabled={submitting} iconRight={<Send className="h-4 w-4" aria-hidden />}>
          {submitting ? "Sending…" : "Send nomination"}
        </Button>
        <p className="text-xs text-cocoa/80">We&apos;ll only use your email to follow up on this nomination.</p>
      </div>
    </form>
  );
}
