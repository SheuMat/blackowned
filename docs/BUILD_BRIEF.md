# Black Owned Sheffield website: build brief

Black Owned Sheffield (BOS) is a Sheffield Community Interest Company. The site must feel like **Sheffield's online hub for discovering, promoting and connecting with Black-owned businesses and the wider community**, not "just another CIC website". Covers Sheffield plus Rotherham, Doncaster and Chesterfield.

Founded 2020 by co-founders **Asha and Rakaia** after the George Floyd protests: "what can we do to help?" → a free platform promoting Black-owned businesses on Instagram/Facebook → pop-up markets (first at Events Central, Fargate, 2022; festive market 17–18 Dec 2022; Cutlery Works markets 2023 and Sun 11 Oct 2026) → Exposed Magazine interview (Dec 2022) → Daily Devotion Podcast (3 parts) → Sadacca Bar re-launch party (23 Aug 2024) → rebrand mixer at Sadacca → presented at South Yorkshire Police's Black History Month event → involvement with Police Race Action Plan → renovating Sadacca Bar and their office (48 Wicker, S3 8JB) → now a CIC launching this website. Goals in their words: encourage the younger generation to feel confident starting businesses; help with employment and education; help businesses get grants and reach customers beyond Sheffield. Instagram: @blackownedsheffield (~2.1k followers). Bio: "Promoting Black Owned Businesses in Sheffield 🤎".

## Stack (read before coding)

- **Next.js 16.4 App Router**, React 19.3, TypeScript, Tailwind CSS v4 (CSS-first `@theme` in `src/app/globals.css`, no tailwind.config). **Read `node_modules/next/dist/docs/` for any API you're not 100% sure of.** Key Next 16 facts:
  - `params` and `searchParams` are **Promises**: `const { slug } = await props.params`. Global type helpers `PageProps<'/directory/[slug]'>` and `LayoutProps<'/'>` need no import (run `npx next typegen` after adding routes if tsc complains).
  - `middleware.ts` is now **`src/proxy.ts`** exporting `proxy()`.
  - `cookies()` / `headers()` are async.
  - **Cache Components is OFF** (`cacheComponents: false`), classic static/dynamic model. Pages are static by default; use `export const dynamic = "force-dynamic"` only for members/admin pages. Pages that split upcoming/past events should `export const revalidate = 3600`.
  - `generateStaticParams` for dynamic content routes; `generateMetadata` for per-item SEO.
  - ESLint uses the React Compiler rules: **no synchronous `setState` inside `useEffect`** (derive state, or adjust state during render with a "previous value" pattern), no reading refs during render.
- Libraries installed: `lucide-react` v1 (**no brand icons**: use `@/components/icons/SocialIcons`), `motion` (import from `"motion/react"`), `leaflet` + `react-leaflet@5` + `leaflet.markercluster`, `fuse.js`, `zod` v4, `clsx`/`tailwind-merge` (`cn()` in `@/lib/utils`), `server-only`.
- Do **not** install new dependencies unless truly necessary; if you must, say so in your report.

## Design system (non-negotiable, this is what makes it feel premium)

Brand: the BOS logo is a round badge, chunky bubbly letters "BLACK OWNED" in a **spectrum of skin tones** (espresso → caramel → latte) with **"SHEFFIELD" in pink** across the middle, on cream. Their market posters are bold and joyful: tangerine, sunflower, teal, navy and pink blobs and squiggles.

- Colours (Tailwind classes): `cream` (page bg), `cream-deep`, `sand`, `line`; skin tones `espresso` (text/dark sections), `cocoa` (body text), `mahogany`, `caramel`, `honey`, `latte`; pinks `blush`, `pink`, `rose`, `rose-ink` (text-safe pink); accents `tangerine`, `sunflower`, `teal`, `navy`, `forest`.
- Fonts: `font-display` (Bagel Fat One: chunky, brand moments only: hero words, big numbers, monograms), `font-heading` (Bricolage Grotesque, extrabold for headings), `font-sans` (DM Sans body).
- Signature look: **2px espresso borders + offset "pop" shadows** (`shadow-pop`, `shadow-pop-sm`, `shadow-pop-pink`), big radii (`rounded-[1.5rem]`, `rounded-[2rem]`, `rounded-full` buttons), warm paper `grain` utility, decorative shapes from `@/components/ui/Shapes` (`Blob`, `Squiggle`, `Sunburst`, `Dots`, `Arc`, `StripeBand` kente-style band). Hover = lift (`hover:-translate-y-1 hover:shadow-pop`).
- `ToneText` (`@/components/ui/ToneText`) colours each letter through the logo's skin tones; `PinkSticker` is the tilted pink "Sheffield" sticker. Use sparingly for brand moments.
- Copy: warm, direct, proud, Sheffield voice. British English (organisation, colour, programme). No lorem ipsum. No em-dash-heavy AI prose; short sentences. No fake statistics presented as real.
- Accessibility: semantic landmarks/headings in order, labels on every control, visible focus (global `:focus-visible` style exists), alt text, colour contrast (use `rose-ink` for pink text on cream, never `pink` text on cream), `prefers-reduced-motion` respected (global CSS handles CSS animations; for `motion`, use `useReducedMotion`).
- Responsive: must look great at 375px. 16px side gutters via `Container`. No horizontal scroll. Tap targets ≥ 44px.

## Shared building blocks (already written; reuse, don't duplicate)

- `@/components/ui/layout`: `Container`, `Section` (tones: cream/deep/sand/espresso/pink/white), `Eyebrow`, `SectionHeading`, `Badge`
- `@/components/ui/Button`: `ButtonLink` (href, external auto-detected), `Button`, `buttonClasses()`; variants primary | pink | sunflower | outline | cream | ghost; sizes sm | md | lg
- `@/components/ui/PageHero`: standard inner-page hero with breadcrumbs (`crumbs`), `eyebrow`, `title`, `description`, `accent`, children slot
- `@/components/ui/CtaBand`: closing CTA panel (tones pink/espresso/sunflower)
- `@/components/ui/YouTubeEmbed`: click-to-load privacy-enhanced player
- `@/components/ui/ToneText`, `@/components/ui/Shapes`
- `@/components/brand/Logo`: `Logo`, `LogoBadge`
- `@/components/cards/BusinessCard` (`compact` variant too), `BusinessArt` (`BusinessCover`, `BusinessLogo`), `EventCard` (+ `EventDateBlock`, `EventTypeBadge`), `StoryCard` (+ `StoryImage`)
- `@/components/icons/CategoryIcon` (`CategoryIcon`, `categoryIconSvg()` raw SVG string for Leaflet divIcons), `@/components/icons/SocialIcons` (`socialMeta` map, `InstagramIcon`, etc.)
- Forms: `@/components/forms/fields` (`TextInput`, `TextArea`, `SelectInput`, `ChoiceChips`, `Checkbox`, `Honeypot`, `Field`), `@/components/forms/useSubmission` (`useSubmission(type)` → `{ submit, state, honeypot, setHoneypot, submitting }`), `@/components/forms/FormStatus` (`FormSuccess`, `FormError`), `@/components/forms/NewsletterForm`
- `POST /api/applications` accepts `{ type, data, website }`; types in `src/lib/submissions.ts` (`business`, `member`, `partner`, `volunteer`, `newsletter`, `contact`, `work-with-us`, `spotlight`, `shop-interest`, `event-booking`, `stall`). `data.email` is required. Stored in `data/submissions.json` + optional webhook.
- `@/lib/session`: signed-cookie sessions: `getSession()`, `hasRole("member" | "admin")`, `checkCredential(role, secret)`, `startSession(role, name?)`, `endSession()`. Dev codes: member `bos-member-2026`, admin `bos-admin-2026` (env `MEMBER_ACCESS_CODE`, `ADMIN_PASSWORD`, `SESSION_SECRET`).
- `@/components/seo/JsonLd`
- `@/lib/utils`: `cn`, `slugify`, `formatDate`, `formatTime`, `formatLongDate`, `dateParts`, `distanceMiles`, `initials`, `telHref`, `displayUrl`
- `@/lib/site`: `site` (name, socials, office, `previewMode`, `showSampleContent`), `mainNav`, `moreNav`, `footerNav`

## Content (src/content, typed in src/content/types.ts)

`businesses.ts` (Care Cove is the first **real** listing; others are `sample: true` demo listings), `categories.ts` (14 categories with icon + colour), `areas.ts` (regions Sheffield/Rotherham/Doncaster/Chesterfield + Sheffield neighbourhoods, centres, `southYorkshireView`), `events.ts` (`eventTypes`, `splitEvents(now)`), `stories.ts`, `spotlights.ts` (`currentSpotlight`), `partners.ts`, `media.ts` (press/video/podcast with YouTube ids, `youtubeThumb()`).

Sample content is allowed for demonstration but must be flagged (`sample: true`) and shown with a small "Sample" tag. **Never invent facts about the real organisations** (BOS, Care Cove, partners). Impact numbers must be real or clearly labelled as targets/"coming soon"; derive counts from content files (e.g. `businesses.filter(b => !b.sample).length`).

## Future revenue (design for it now, without being pushy)

Membership, featured listings (`tier: "featured"`), sponsored spotlights (`sponsored: true`, labelled "Sponsored"), event promotion, advertising, corporate partnerships, sponsorship packages, training bookings, directory upgrades (community/plus/featured tiers). Show these as "coming soon / register interest" where pricing isn't set. Do not invent prices; use "Free", "Coming 2027" or "Ask us".

## Rules for parallel workstreams

- Several agents are building at once in the same working tree. **Only create/edit files you own** (listed in your task). If you need a change in a shared file, don't make it: describe it in your final report.
- Don't run `next build` (concurrent builds clash). Verify with `npx tsc --noEmit`, `npx eslint <your files>`, and by fetching your routes from the dev server already running on **http://localhost:3000** (e.g. `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/events`). A 500 or Next error overlay HTML means it's broken. tsc errors in files you don't own are someone else's work in progress; ignore them.
- Client components need `"use client"`. Keep heavy client code (Leaflet) in client components loaded with `next/dynamic` `{ ssr: false }` from a client wrapper.
- Every page exports `metadata` (or `generateMetadata`) with a specific title and description.
