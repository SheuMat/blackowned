"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FormError, FormSuccess } from "@/components/forms/FormStatus";
import { cn } from "@/lib/utils";

/** Focus + scroll to the success message once a form has been sent */
export function SuccessBlock({ title, children, action }: { title: string; children?: ReactNode; action?: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.focus({ preventScroll: true });
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }, []);
  return (
    <div ref={ref} tabIndex={-1} className="scroll-mt-28 focus:outline-none">
      <h2 className="sr-only">Application sent</h2>
      <FormSuccess title={title} action={action}>
        {children}
      </FormSuccess>
    </div>
  );
}

/** Error summary + submit button at the foot of a single-page form */
export function SubmitBar({
  label,
  submitting,
  error,
  errorCount,
  note,
  className,
}: {
  label: string;
  submitting: boolean;
  error?: string;
  errorCount: number;
  note?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mt-10 border-t-2 border-dashed border-espresso/15 pt-6", className)}>
      {errorCount > 0 && (
        <FormError
          className="mb-4"
          message={
            errorCount === 1
              ? "There's one thing to fix above before you send."
              : `There are ${errorCount} things to fix above before you send.`
          }
        />
      )}
      {error && <FormError className="mb-4" message={error} />}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {note && <p className="text-xs text-cocoa/80 sm:max-w-xs">{note}</p>}
        <Button
          type="submit"
          variant="pink"
          size="lg"
          disabled={submitting}
          iconRight={<Send className="h-4 w-4" aria-hidden />}
          className="w-full sm:ml-auto sm:w-auto"
        >
          {submitting ? "Sending…" : label}
        </Button>
      </div>
    </div>
  );
}

/** Small "who this is for" note shown inside a form section */
export function InlineNote({ children, tone = "sunflower", className }: { children: ReactNode; tone?: "sunflower" | "teal" | "pink"; className?: string }) {
  const tones = {
    sunflower: "border-sunflower bg-sunflower/20",
    teal: "border-teal bg-teal/10",
    pink: "border-pink bg-blush",
  } as const;
  return (
    <div className={cn("rounded-2xl border-2 px-4 py-3 text-sm text-espresso", tones[tone], className)}>{children}</div>
  );
}
