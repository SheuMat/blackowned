"use client";

import { useActionState } from "react";
import { ArrowRight, Lock } from "lucide-react";
import { LogoBadge } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { TextInput } from "@/components/forms/fields";
import { login, type LoginState } from "@/app/admin/actions";

const initial: LoginState = {};

export function LoginCard() {
  const [state, formAction, pending] = useActionState(login, initial);
  return (
    <div className="relative mx-auto w-full max-w-md rounded-[2rem] border-2 border-espresso bg-white p-6 shadow-pop sm:p-10">
      <div className="flex items-center gap-4">
        <LogoBadge size={56} />
        <div>
          <p className="font-heading text-xs font-bold uppercase tracking-[0.18em] text-rose-ink">Team only</p>
          <h1 className="font-heading text-2xl font-extrabold text-espresso sm:text-3xl">Team dashboard</h1>
        </div>
      </div>
      <p className="mt-5 text-sm text-cocoa">
        Sign in to see applications and messages from the website. This area is for the Black Owned Sheffield team.
      </p>
      <form action={formAction} className="mt-6 flex flex-col gap-4">
        <TextInput
          id="admin-password"
          name="password"
          type="password"
          label="Team password"
          required
          autoComplete="current-password"
          error={state.error}
        />
        <Button
          type="submit"
          size="lg"
          disabled={pending}
          icon={<Lock className="h-4 w-4" aria-hidden />}
          iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}
        >
          {pending ? "Checking…" : "Sign in"}
        </Button>
      </form>
      <p className="mt-6 text-xs text-cocoa/80">Forgotten it? Ask whoever looks after the website to reset it for you.</p>
    </div>
  );
}
