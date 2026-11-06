import type { ReactNode } from "react";
import { AlertCircle, PartyPopper } from "lucide-react";
import { cn } from "@/lib/utils";

export function FormSuccess({
  title = "Thank you!",
  children,
  action,
  className,
}: {
  title?: string;
  children?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      role="status"
      className={cn("rounded-[1.75rem] border-2 border-espresso bg-blush p-8 text-center shadow-pop sm:p-10", className)}
    >
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-espresso bg-sunflower">
        <PartyPopper className="h-8 w-8 text-espresso" />
      </span>
      <h3 className="mt-5 font-heading text-2xl font-extrabold text-espresso sm:text-3xl">{title}</h3>
      {children && <div className="mx-auto mt-3 max-w-md text-cocoa">{children}</div>}
      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </div>
  );
}

export function FormError({ message, className }: { message?: string; className?: string }) {
  if (!message) return null;
  return (
    <div
      role="alert"
      className={cn("flex items-start gap-3 rounded-2xl border-2 border-rose bg-blush px-4 py-3 text-sm font-medium text-rose-ink", className)}
    >
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      {message}
    </div>
  );
}
