import { BadgeCheck, Hourglass, LockKeyhole, Sparkles } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Blob } from "@/components/ui/Shapes";

/**
 * A blurred peek at the members' area for the public teaser. The cards are
 * placeholder shapes only (aria-hidden): no member content is in the HTML.
 */
export function LockedPreview({ loginHref }: { loginHref: string }) {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border-2 border-espresso bg-espresso p-4 shadow-pop-pink sm:p-6">
      <Blob color="#e0628f" className="absolute -top-20 -left-16 h-64 w-64 opacity-40" />
      <Blob color="#a8693d" className="absolute -right-20 -bottom-24 h-72 w-72 opacity-40" />

      <div aria-hidden className="pointer-events-none relative grid select-none gap-4 blur-[5px] sm:grid-cols-2">
        <FakeResource tone="#f6bd3c" badge="BOS service" />
        <FakeOpportunity />
        <FakeResource tone="#167a6f" badge="Guide" verified />
        <FakeOpportunity urgent />
        <FakeResource tone="#e0628f" badge="Link" verified className="hidden sm:block" />
        <FakeResource tone="#1f2a63" badge="Events" className="hidden sm:block" />
      </div>

      <div className="absolute inset-0 flex items-center justify-center bg-espresso/30 p-4">
        <div className="w-full max-w-sm rounded-[1.75rem] border-2 border-espresso bg-cream p-6 text-center shadow-pop sm:p-8">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-espresso bg-pink shadow-pop-sm">
            <LockKeyhole className="h-7 w-7 text-espresso" aria-hidden />
          </span>
          <p className="mt-4 font-heading text-2xl font-extrabold leading-tight text-espresso">The good stuff is inside</p>
          <p className="mt-2 text-sm text-cocoa">
            Sign in to see every resource, request support and browse live opportunities.
          </p>
          <div className="mt-5 flex flex-col gap-2">
            <ButtonLink href="/join/member" variant="pink">
              Become a member
            </ButtonLink>
            <ButtonLink href={loginHref} variant="ghost" size="md">
              I&apos;m a member: log in
            </ButtonLink>
          </div>
        </div>
      </div>
    </div>
  );
}

function Bar({ w, className = "" }: { w: string; className?: string }) {
  return <span className={`block h-3 rounded-full bg-espresso/15 ${className}`} style={{ width: w }} />;
}

function FakeResource({
  tone,
  badge,
  verified,
  className = "",
}: {
  tone: string;
  badge: string;
  verified?: boolean;
  className?: string;
}) {
  return (
    <div className={`rounded-[1.25rem] border-2 border-espresso bg-white p-5 ${className}`}>
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold text-espresso" style={{ backgroundColor: tone }}>
          <Sparkles className="h-3 w-3" />
          {badge}
        </span>
        {verified && <BadgeCheck className="h-4 w-4 text-teal" />}
      </div>
      <Bar w="40%" className="mt-4 h-2.5 bg-rose/40" />
      <Bar w="80%" className="mt-2 h-4 bg-espresso/70" />
      <Bar w="95%" className="mt-3" />
      <Bar w="70%" className="mt-2" />
      <div className="mt-4 flex gap-2">
        <span className="h-6 w-16 rounded-full bg-cream-deep" />
        <span className="h-6 w-20 rounded-full bg-cream-deep" />
      </div>
    </div>
  );
}

function FakeOpportunity({ urgent }: { urgent?: boolean }) {
  return (
    <div className="rounded-[1.25rem] border-2 border-espresso bg-white p-5">
      <div className="flex items-center gap-2">
        <span className="h-6 w-20 rounded-full bg-teal" />
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold text-espresso ${urgent ? "bg-tangerine" : "bg-teal/15"}`}
        >
          <Hourglass className="h-3 w-3" />
          {urgent ? "Closes in 3 days" : "Closes in 4 weeks"}
        </span>
      </div>
      <Bar w="85%" className="mt-4 h-4 bg-espresso/70" />
      <Bar w="50%" className="mt-3" />
      <Bar w="45%" className="mt-2" />
      <Bar w="90%" className="mt-3" />
    </div>
  );
}
