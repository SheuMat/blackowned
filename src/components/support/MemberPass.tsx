import { LockKeyhole } from "lucide-react";
import { supportSections } from "@/content/support";
import { LogoBadge } from "@/components/brand/Logo";
import { cn } from "@/lib/utils";
import { SupportIcon } from "./SupportIcon";

/** Decorative "members' pass" card for the Business Support teaser hero */
export function MemberPass({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none relative select-none", className)}>
      <div className="absolute inset-0 translate-x-6 translate-y-4 rotate-6 rounded-[2rem] border-2 border-cream/80 bg-sunflower" />
      <div className="absolute inset-0 -translate-x-4 translate-y-2 -rotate-3 rounded-[2rem] border-2 border-cream/80 bg-teal" />
      <div className="grain relative rotate-[-1.5deg] overflow-hidden rounded-[2rem] border-2 border-cream bg-pink p-7 text-espresso shadow-[8px_8px_0_0_#fbf5ec]">
        <div className="flex items-center justify-between">
          <LogoBadge size={56} />
          <span className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-espresso bg-cream">
            <LockKeyhole className="h-5 w-5" />
          </span>
        </div>
        <p className="mt-8 font-heading text-xs font-bold uppercase tracking-[0.22em] text-espresso/70">
          Black Owned Sheffield
        </p>
        <p className="mt-1 font-display text-4xl leading-none">Members&apos; pass</p>
        <p className="mt-2 font-heading text-sm font-bold">Business Support</p>
        <div className="mt-7 grid grid-cols-5 gap-2">
          {supportSections.map((s) => (
            <span
              key={s.id}
              className="flex aspect-square items-center justify-center rounded-xl border-2 border-espresso"
              style={{ backgroundColor: s.color, color: s.ink }}
            >
              <SupportIcon name={s.icon} className="h-5 w-5" />
            </span>
          ))}
        </div>
        <div className="mt-7 flex items-end justify-between border-t-2 border-dashed border-espresso/30 pt-4">
          <span className="font-heading text-xs font-bold uppercase tracking-[0.18em]">Access: approved members</span>
          <span className="font-display text-2xl">BOS</span>
        </div>
      </div>
    </div>
  );
}
