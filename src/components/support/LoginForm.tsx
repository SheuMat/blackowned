"use client";

import { useActionState, useState } from "react";
import { ArrowRight, Eye, EyeOff, KeyRound, Loader2 } from "lucide-react";
import { memberLogin, type LoginState } from "@/app/members/actions";
import { TextInput } from "@/components/forms/fields";
import { FormError } from "@/components/forms/FormStatus";
import { Button } from "@/components/ui/Button";

const initialState: LoginState = {};

export function LoginForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState(memberLogin, initialState);
  const [show, setShow] = useState(false);

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      <input type="hidden" name="next" value={next} />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="member-code" className="font-heading text-sm font-bold text-espresso">
          Access code<span className="ml-0.5 text-rose" aria-hidden>*</span>
        </label>
        <p id="member-code-hint" className="-mt-0.5 text-xs text-cocoa/80">
          It&apos;s in the email we sent when your membership was approved.
        </p>
        <div className="relative">
          <KeyRound className="pointer-events-none absolute top-1/2 left-4 h-[18px] w-[18px] -translate-y-1/2 text-cocoa/60" aria-hidden />
          <input
            id="member-code"
            name="code"
            type={show ? "text" : "password"}
            required
            autoComplete="current-password"
            autoCapitalize="none"
            spellCheck={false}
            aria-describedby={state.error ? "member-code-hint login-error" : "member-code-hint"}
            aria-invalid={state.error ? true : undefined}
            className="h-14 w-full rounded-2xl border-2 border-espresso/15 bg-white pr-14 pl-11 font-heading text-lg tracking-wide text-espresso placeholder:font-sans placeholder:text-base placeholder:tracking-normal placeholder:text-cocoa/50 transition-colors focus:border-espresso focus:outline-none focus-visible:outline-none aria-[invalid=true]:border-rose"
            placeholder="Your access code"
          />
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            aria-label="Show access code"
            aria-pressed={show}
            className="absolute top-1/2 right-1.5 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-xl text-cocoa transition-colors hover:bg-espresso/5 hover:text-espresso"
          >
            {show ? <EyeOff className="h-5 w-5" aria-hidden /> : <Eye className="h-5 w-5" aria-hidden />}
          </button>
        </div>
      </div>

      <TextInput
        label="First name"
        name="name"
        autoComplete="given-name"
        maxLength={40}
        defaultValue={state.name}
        hint="So we can say hello properly."
        placeholder="e.g. Ama"
      />

      <div id="login-error" aria-live="polite" className="empty:-mb-5">
        <FormError message={state.error} />
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={pending}
        className="w-full"
        icon={pending ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> : undefined}
        iconRight={pending ? undefined : <ArrowRight className="h-5 w-5" aria-hidden />}
      >
        {pending ? "Checking your code…" : "Enter the members' area"}
      </Button>
    </form>
  );
}
