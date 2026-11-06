# Black Owned Sheffield

Sheffield's online hub for discovering, promoting and connecting with Black-owned businesses and the wider community, across Sheffield, Rotherham, Doncaster and Chesterfield.

Built with Next.js 16, React 19, Tailwind CSS 4, Leaflet/OpenStreetMap and TypeScript.

## Run it locally

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev                   # http://localhost:3000
```

Dev logins (only used when the env vars are empty):

| Area | URL | Code |
| --- | --- | --- |
| Members' Business Support | `/members/login` | `bos-member-2026` |
| Team dashboard | `/admin` | `bos-admin-2026` |

These dev codes only work in development. In production (`npm run build && npm start`, or any host), the members' login and the team dashboard stay **switched off** until `MEMBER_ACCESS_CODE` and `ADMIN_PASSWORD` are set. Without `SESSION_SECRET`, sessions use a temporary random secret and everyone is signed out whenever the server restarts.

## What's where

| Page | Route | Content file |
| --- | --- | --- |
| Home | `/` | pulls from everything below |
| About us | `/about` | page copy |
| Business directory | `/directory`, `/directory/[slug]`, `/directory/category/[category]` | `src/content/businesses.ts` |
| Map of Black-owned Sheffield | `/map` | business `coords` |
| Join us (4 application forms) | `/join`, `/join/business`, `/join/member`, `/join/partner`, `/join/volunteer` | — |
| Events calendar | `/events`, `/events/[slug]`, `/events/stall` | `src/content/events.ts` |
| Business Support (members only) | `/business-support`, `/business-support/[section]`, `/business-support/opportunities` | `src/content/support.ts`, `src/content/opportunities.ts` |
| Stories & news | `/stories`, `/stories/[slug]` | `src/content/stories.ts`, `src/content/media.ts` |
| Business Spotlight | `/spotlight` (+ rotating section on the home page) | `src/content/spotlights.ts` |
| Shop Black Sheffield | `/shop` | `src/content/shop.ts` |
| Research & impact | `/impact` | `src/content/impact.ts` (calculated from content) |
| Community | `/community` | `src/content/community.ts` |
| Partners | `/partners` | `src/content/partners.ts` |
| Work with us | `/work-with-us` | page copy |
| Contact | `/contact` | — |
| Team dashboard | `/admin` | `data/submissions.json` |

Site-wide settings (socials, email, office address, navigation) live in `src/lib/site.ts`.

## Everyday jobs

### Add a business to the directory

1. An application comes in through `/join/business` and shows up in `/admin`.
2. In `/admin`, open it and press **Copy as directory entry**. That copies a ready-made entry.
3. Paste it into the list in `src/content/businesses.ts`, check the wording, and add their logo/photos to `public/businesses/<slug>/`.
4. For the map, look up coordinates at `https://api.postcodes.io/postcodes/<postcode>` and set `coords`.
5. Commit and deploy. The listing, its profile page, map pin and sitemap entry all appear automatically.

### Add an event

Add an entry to `src/content/events.ts`. Times use the UK offset (`+00:00` in winter, `+01:00` in summer). Past events stay on the site as a track record. Add a `ticketUrl` to send people to Eventbrite or similar; leave it out to use the built-in booking form.

### Change this month's Spotlight

Add a new entry at the **top** of `src/content/spotlights.ts`. Set `sponsored: true` for paid spotlight packages (shown with a "Sponsored" label).

### Sample content

Entries marked `sample: true` are demonstration listings, events and stories so the client can see the site full. Before launch, either delete them or set `NEXT_PUBLIC_SHOW_SAMPLES=false`, and set `NEXT_PUBLIC_PREVIEW_MODE=false` to remove the preview banner.

## Forms

Every form posts to `/api/applications`. Each submission is:

- saved to `data/submissions.json` (read by `/admin`), and
- sent to `SUBMISSIONS_WEBHOOK_URL` if set (Zapier/Make/Slack/Google Sheets etc.).

Spam protection: honeypot field, size limits, basic rate limiting.

## Map tiles

The `/map` page and directory map use CARTO's free Voyager basemap when `NEXT_PUBLIC_CARTO_BASEMAPS_KEY` is set (request a key at carto.com/basemaps). Without a key the map uses OpenStreetMap's standard tiles, which are fine for previews but not meant for heavy traffic. To use another provider, set `NEXT_PUBLIC_MAP_TILE_URL` and `NEXT_PUBLIC_MAP_ATTRIBUTION`.

## Deploying

Any Node.js host works. If you want the `/admin` dashboard to read submissions from disk, use a host with a persistent disk (a small VPS, Render, Railway or Fly.io). On serverless hosts such as Vercel, set `SUBMISSIONS_WEBHOOK_URL`, because the file store won't persist there.

```bash
npm run build
npm start
```

## Before launch checklist

- [ ] Replace `public/brand/bos-logo.jpg` with a high-resolution logo (the current file is the 150px Instagram version)
- [ ] Confirm `site.email`, and that BOS owns the TikTok, Facebook and YouTube accounts linked in `src/lib/site.ts`
- [ ] Confirm the company details shown in the footer and on `/privacy` (`companyNumber`, `registeredOffice` in `src/lib/site.ts`, taken from Companies House)
- [ ] Confirm the reply-time promise (`site.replyTime`, used on every form)
- [ ] Care Cove to sign off its listing, the November Spotlight and the "Featured"/"Verified" badges
- [ ] Confirm the services, membership benefits and pricing the site describes (tier table on `/join`, Business Support services, `/work-with-us` offers), the 51% Black-owned eligibility rule, and a safeguarding policy for volunteers aged 16–17
- [ ] Confirm story dates marked as launch placeholders (`2026-11-01` in `src/content/stories.ts`) and the order of milestones in `src/components/about/data.ts`
- [ ] Remove or replace sample listings, events, stories and opportunities, or set `NEXT_PUBLIC_SHOW_SAMPLES=false` and `NEXT_PUBLIC_PREVIEW_MODE=false`
- [ ] Confirm partner organisations are happy to be listed, and add their logos to `public/partners/`
- [ ] Set `SESSION_SECRET`, `MEMBER_ACCESS_CODE`, `ADMIN_PASSWORD` (the logins stay off in production until you do)
- [ ] Get a free CARTO basemaps key and set `NEXT_PUBLIC_CARTO_BASEMAPS_KEY`
- [ ] Set up `SUBMISSIONS_WEBHOOK_URL` so applications reach the team's inbox
- [ ] Add Instagram/TikTok video links for the Christmas market, rebrand mixer, Cutlery Works and South Yorkshire Police events
