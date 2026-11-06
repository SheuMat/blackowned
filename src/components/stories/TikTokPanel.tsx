import { Bookmark, Heart, MessageCircle, Music2, Play, Share2 } from "lucide-react";
import { LogoBadge } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/layout";
import { Blob, Dots, Squiggle } from "@/components/ui/Shapes";
import { InstagramIcon, TikTokIcon } from "@/components/icons/SocialIcons";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

const tiktokHandle = `@${site.socials.tiktok.replace(/\/$/, "").split("@").pop()}`;

/**
 * "Watch us on TikTok": a bold dark panel with a vertical phone mock-up in the
 * brand gradient. The phones are illustrations (no real video or stats).
 */
export function TikTokPanel({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "grain relative overflow-hidden rounded-[2rem] border-2 border-espresso bg-espresso px-6 py-12 text-cream shadow-pop sm:px-12 sm:py-16",
        className,
      )}
    >
      <Blob color="#55321f" className="absolute -top-24 -left-24 h-80 w-80 opacity-70" />
      <Squiggle color="#f2a0bd" className="absolute top-10 right-[40%] hidden h-8 w-28 lg:block" />
      <Dots color="#f6bd3c" className="absolute right-[34%] bottom-10 hidden h-12 w-12 opacity-60 lg:block" />

      <div className="relative grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16">
        <div className="max-w-xl">
          <Eyebrow dark>Watch us on TikTok</Eyebrow>
          <h2 id="tiktok-heading" className="mt-4 font-heading text-4xl font-extrabold leading-[1.02] sm:text-5xl lg:text-6xl">
            Behind the counter, <span className="font-display text-pink">in 60 seconds.</span>
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-cream/80">
            Some stories are better watched than read. On TikTok and Instagram we go behind the counter with founders,
            share market-day highlights and catch launches as they happen.
          </p>
          <ul className="mt-6 flex flex-wrap gap-2 text-sm font-semibold">
            {["Meet the Founder clips", "Market-day highlights", "Black Business of the Month", "Launch news"].map((t) => (
              <li key={t} className="rounded-full border-2 border-cream/20 px-3 py-1.5 text-cream/90">
                {t}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href={site.socials.tiktok} variant="pink" size="lg" icon={<TikTokIcon size={20} />}>
              Follow on TikTok
            </ButtonLink>
            <ButtonLink href={site.socials.instagram} variant="cream" size="lg" icon={<InstagramIcon size={20} />}>
              Follow on Instagram
            </ButtonLink>
          </div>
          <p className="mt-4 text-sm text-cream/60">
            {tiktokHandle} on TikTok · {site.instagramHandle} on Instagram ({site.instagramFollowers} followers)
          </p>
        </div>

        {/* Phones */}
        <div className="relative mx-auto h-[430px] w-[270px] sm:h-[510px] sm:w-[340px]">
          <PhoneMock
            className="absolute top-6 right-0 w-[172px] rotate-[8deg] sm:w-[220px]"
            screen="bg-[linear-gradient(165deg,#167a6f_0%,#1f2a63_100%)]"
            caption="Market-day highlights from our pop-ups"
            headline="Market day"
            ink="text-cream"
            decorative
          />
          <a
            href={site.socials.tiktok}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Watch Black Owned Sheffield on TikTok (${tiktokHandle}, opens in a new tab)`}
            className="group absolute top-0 left-0 block w-[205px] -rotate-[4deg] rounded-[2.4rem] transition-transform duration-300 hover:-rotate-[2deg] hover:-translate-y-1 sm:w-[250px]"
          >
            <PhoneMock
              screen="bg-[linear-gradient(165deg,#f2a0bd_0%,#ee6a35_55%,#f6bd3c_100%)]"
              caption="The people behind Sheffield's Black-owned businesses 🤎"
              headline="Meet the founder"
              ink="text-espresso"
              play
            />
          </a>
        </div>
      </div>
    </div>
  );
}

function PhoneMock({
  className,
  screen,
  headline,
  caption,
  ink,
  play = false,
  decorative = false,
}: {
  className?: string;
  screen: string;
  headline: string;
  caption: string;
  ink: string;
  play?: boolean;
  decorative?: boolean;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "aspect-[9/18.5] rounded-[2.4rem] border-2 border-cream bg-cocoa p-2 shadow-pop-pink",
        decorative && "opacity-90",
        className,
      )}
    >
      <div className={cn("relative h-full w-full overflow-hidden rounded-[1.9rem]", screen)}>
        {/* notch */}
        <span className="absolute top-2 left-1/2 h-4 w-16 -translate-x-1/2 rounded-full bg-espresso" />
        {/* top tabs */}
        <div className={cn("absolute top-9 right-0 left-0 flex justify-center gap-3 text-[11px] font-bold", ink)}>
          <span className="opacity-60">Following</span>
          <span className="border-b-2 border-current pb-0.5">For You</span>
        </div>

        {/* shapes */}
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 200 400" preserveAspectRatio="xMidYMid slice">
          <circle cx="160" cy="110" r="46" fill="#fbf5ec" opacity="0.35" />
          <path
            d="M-10 300c25-22 50-22 75 0s50 22 75 0 50-22 75 0"
            stroke="#2a1910"
            strokeWidth="9"
            fill="none"
            strokeLinecap="round"
            opacity="0.18"
          />
        </svg>

        {/* headline */}
        <div className="absolute top-[19%] right-12 left-4">
          <p className={cn("font-display text-[1.4rem] leading-[0.95] uppercase sm:text-[1.85rem]", ink)}>{headline}</p>
          <span className="mt-3 inline-block -rotate-3 rounded-lg border-2 border-espresso bg-cream px-2 py-0.5 font-display text-sm text-rose-ink">
            Sheffield
          </span>
        </div>

        {play && (
          <span className="absolute top-[50%] left-[42%] flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full border-2 border-espresso bg-cream shadow-pop-sm transition-transform group-hover:scale-110">
            <Play className="ml-0.5 h-6 w-6 fill-espresso text-espresso" />
          </span>
        )}

        {/* right rail */}
        <div className={cn("absolute right-2 bottom-24 flex flex-col items-center gap-2.5 sm:gap-3.5 [&>svg]:h-5 [&>svg]:w-5 sm:[&>svg]:h-6 sm:[&>svg]:w-6", ink)}>
          <LogoBadge size={34} />
          <Heart />
          <MessageCircle />
          <Bookmark />
          <Share2 />
        </div>

        {/* caption */}
        <div className={cn("absolute inset-x-3 bottom-4", ink)}>
          <p className="text-[12px] font-extrabold">{tiktokHandle}</p>
          <p className="mt-0.5 line-clamp-2 pr-10 text-[11px] leading-snug font-medium opacity-90">{caption}</p>
          <p className="mt-1.5 flex items-center gap-1 text-[10px] font-semibold opacity-80">
            <Music2 className="h-3 w-3" /> original sound · Black Owned Sheffield
          </p>
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-current/25">
            <div className="h-full w-2/5 rounded-full bg-current" />
          </div>
        </div>
      </div>
    </div>
  );
}
