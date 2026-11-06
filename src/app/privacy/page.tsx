import type { Metadata } from "next";
import { Cookie, Eye, Mail, ShieldCheck, Trash2, UserCheck } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/layout";
import { PageHero } from "@/components/ui/PageHero";
import { site, ogBase } from "@/lib/site";

/*
 * PRIVACY NOTICE
 * Plain-English notice for the website. Before launch, the team should
 * confirm: the retention periods below, the public inbox in src/lib/site.ts,
 * and which form/email tools receive submissions (SUBMISSIONS_WEBHOOK_URL).
 * Update LAST_UPDATED whenever this page changes.
 */
const LAST_UPDATED = "4 November 2026";

const ogImage = { url: "/opengraph-image", width: 1200, height: 630, alt: `${site.name}: ${site.tagline}` };

export const metadata: Metadata = {
  title: "Privacy notice",
  description:
    "How Black Owned Sheffield CIC collects, uses and protects your information, in plain English. What we collect through our forms, how long we keep it, cookies, and your rights under UK GDPR.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    ...ogBase,
    title: "Privacy notice | Black Owned Sheffield",
    description: "What we collect, why, how long we keep it, and your rights. In plain English.",
    url: "/privacy",
    // Pages that set openGraph replace the inherited one, so point at the default image explicitly
    images: [ogImage],
  },
  // Likewise for twitter: without this the card shows the site-wide title and description
  twitter: {
    card: "summary_large_image",
    title: "Privacy notice | Black Owned Sheffield",
    description: "What we collect, why, how long we keep it, and your rights. In plain English.",
    images: [ogImage],
  },
};

const toc = [
  { id: "who-we-are", label: "Who we are" },
  { id: "what-we-collect", label: "What we collect and why" },
  { id: "where-stored", label: "Where it's stored" },
  { id: "how-long", label: "How long we keep it" },
  { id: "your-rights", label: "Your rights" },
  { id: "cookies", label: "Cookies and other sites" },
  { id: "young-people", label: "Young people" },
  { id: "complaints", label: "Questions and complaints" },
];

const shortVersion = [
  { icon: UserCheck, text: "We only collect what you choose to send us through our forms." },
  { icon: ShieldCheck, text: "We use it to do what you asked. We never sell it or use it for advertising." },
  { icon: Cookie, text: "No advertising or tracking cookies. Just one essential cookie if you sign in." },
  { icon: Trash2, text: "You can ask to see, correct or delete your information at any time." },
];

const forms = [
  {
    title: "Joining the directory",
    what: "Your business details, the contact person's name, email and phone number, and anything else you add to your listing.",
    why: "To check your application, publish your listing and keep it up to date. Only the details you choose to make public appear on the site.",
    basis: "Taking the steps you've asked us to take, and our legitimate interest in running the directory.",
  },
  {
    title: "Membership, partnership and volunteering",
    what: "Your name and contact details, your business or organisation, and what you tell us about your skills, interests and availability.",
    why: "To process your application, give members access to Business Support, and arrange partnerships and volunteering.",
    basis: "Taking the steps you've asked us to take, and our legitimate interest in running the CIC.",
  },
  {
    title: "Event bookings and market stalls",
    what: "Your name, email, how many places you need, and for stalls, details about your business and what you'll sell.",
    why: "To manage the event, contact you about it, and plan the market.",
    basis: "Taking the steps you've asked us to take.",
  },
  {
    title: "Contact, sponsorship and spotlight enquiries",
    what: "Your name, email and whatever you put in your message.",
    why: "To reply to you and follow up on your enquiry.",
    basis: "Our legitimate interest in answering the people who get in touch.",
  },
  {
    title: "Newsletter, impact report and gift box updates",
    what: "Your email address, your name if you give it, and for gift boxes, which boxes interest you and roughly how many.",
    why: "To send you what you signed up for, and to plan gift boxes around what people actually want.",
    basis: "Your consent. You can unsubscribe or withdraw it any time.",
  },
];

const retention = [
  { item: "Directory listings", time: "While you're listed, and up to 12 months after a listing is removed" },
  { item: "Applications we don't go ahead with", time: "12 months" },
  { item: "Membership records", time: "While you're a member, and up to 2 years after" },
  { item: "Event bookings and stall applications", time: "12 months after the event" },
  { item: "Contact and other enquiries", time: "Up to 2 years after we last hear from you" },
  { item: "Newsletter and update lists", time: "Until you unsubscribe" },
];

const rights = [
  { title: "See it", body: "Ask for a copy of the information we hold about you." },
  { title: "Correct it", body: "Ask us to fix anything that's wrong or out of date." },
  { title: "Delete it", body: "Ask us to delete your information, where we don't need to keep it." },
  { title: "Object or restrict", body: "Ask us to stop or limit how we use it." },
  { title: "Take it with you", body: "Ask for your information in a format you can move elsewhere." },
  { title: "Change your mind", body: "Withdraw consent you've given, such as for our newsletter." },
];

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="scroll-mt-24 font-heading text-2xl font-extrabold leading-tight text-espresso sm:text-3xl">
      {children}
    </h2>
  );
}

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Privacy" }]}
        eyebrow="Privacy"
        accent="navy"
        title="Privacy notice"
        description={
          <p>
            How {site.legalName} looks after the information you give us. No legal maze: just what we collect, why, and
            what you can ask us to do with it.
          </p>
        }
      >
        <p className="inline-flex items-center gap-2 rounded-full border-2 border-espresso bg-cream px-4 py-2 text-sm font-semibold text-espresso">
          Last updated: <time dateTime="2026-11-04">{LAST_UPDATED}</time>
        </p>
      </PageHero>

      <section className="py-14 sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-16">
            <nav aria-label="On this page" className="lg:sticky lg:top-24 lg:self-start">
              <p className="font-heading text-xs font-bold uppercase tracking-[0.18em] text-rose-ink">On this page</p>
              <ol className="mt-3 space-y-1 border-l-2 border-line text-[15px]">
                {toc.map((t) => (
                  <li key={t.id}>
                    <a
                      href={`#${t.id}`}
                      className="-ml-0.5 flex min-h-11 items-center border-l-2 border-transparent py-1 pl-4 text-cocoa hover:border-rose hover:text-espresso lg:min-h-9"
                    >
                      {t.label}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="min-w-0 max-w-3xl space-y-14">
              {/* Short version */}
              <div className="rounded-[1.5rem] border-2 border-espresso bg-blush p-6 shadow-pop-sm sm:p-8">
                <h2 className="font-heading text-xl font-extrabold text-espresso sm:text-2xl">The short version</h2>
                <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                  {shortVersion.map((s) => (
                    <li key={s.text} className="flex items-start gap-3 text-[15px] leading-relaxed text-espresso">
                      <span aria-hidden className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-espresso bg-white">
                        <s.icon className="h-4 w-4" />
                      </span>
                      {s.text}
                    </li>
                  ))}
                </ul>
              </div>

              <section aria-labelledby="who-we-are" className="prose-bos">
                <H2 id="who-we-are">Who we are</H2>
                <p>
                  {site.legalName} is a Community Interest Company based at {site.office.name}, {site.office.address}. We run
                  this website and decide how the information you send through it is used, which makes us the
                  &ldquo;controller&rdquo; under UK data protection law.
                </p>
                <p>
                  We&apos;re registered at Companies House as company number {site.companyNumber}. Our registered office
                  is {site.registeredOffice}.
                </p>
                <p>
                  For anything about your information, email us at{" "}
                  <a href={`mailto:${site.email}?subject=${encodeURIComponent("Privacy request")}`}>{site.email}</a>.
                </p>
              </section>

              <section aria-labelledby="what-we-collect">
                <H2 id="what-we-collect">What we collect and why</H2>
                <p className="mt-4 text-[1.0625rem] leading-relaxed text-cocoa">
                  You can browse the whole public site without telling us who you are. We only collect personal information
                  when you fill in one of our forms.
                </p>
                <div className="mt-6 space-y-4">
                  {forms.map((f) => (
                    <article key={f.title} className="rounded-[1.25rem] border-2 border-espresso/15 bg-white p-5 sm:p-6">
                      <h3 className="font-heading text-lg font-extrabold text-espresso">{f.title}</h3>
                      <dl className="mt-3 grid gap-3 text-[15px] leading-relaxed sm:grid-cols-[7.5rem_1fr] sm:gap-x-4">
                        <dt className="font-heading font-bold text-espresso">What</dt>
                        <dd className="-mt-2 text-cocoa sm:mt-0">{f.what}</dd>
                        <dt className="font-heading font-bold text-espresso">Why</dt>
                        <dd className="-mt-2 text-cocoa sm:mt-0">{f.why}</dd>
                        <dt className="font-heading font-bold text-espresso">Legal basis</dt>
                        <dd className="-mt-2 text-cocoa sm:mt-0">{f.basis}</dd>
                      </dl>
                    </article>
                  ))}
                </div>
                <p className="mt-6 text-[1.0625rem] leading-relaxed text-cocoa">
                  With every form we also note the date, your browser type and the page you sent it from. That helps
                  us spot spam and fix problems. Every form also has a hidden field that catches spam bots, and if we
                  spot spam, we delete it.
                </p>
              </section>

              <section aria-labelledby="where-stored" className="prose-bos">
                <H2 id="where-stored">Where it&apos;s stored</H2>
                <p>
                  What you send through our forms is saved on the systems that run this website. We may also pass it to the
                  form, spreadsheet and email tools our team uses to manage applications and reply to you. Those providers
                  only process it on our behalf.
                </p>
                <p>
                  Only the Black Owned Sheffield team, and volunteers working with us who need it for their role, can see
                  your information. If any of our providers store data outside the UK, we make sure proper legal safeguards
                  are in place.
                </p>
                <p>We never sell your information, and we never share it with advertisers.</p>
              </section>

              <section aria-labelledby="how-long">
                <H2 id="how-long">How long we keep it</H2>
                <p className="mt-4 text-[1.0625rem] leading-relaxed text-cocoa">
                  We keep information only as long as we need it, then delete it.
                </p>
                <div className="mt-6 overflow-hidden rounded-[1.25rem] border-2 border-espresso/15 bg-white">
                  <table className="w-full text-left text-[15px]">
                    <caption className="sr-only">How long we keep each kind of information</caption>
                    <thead className="bg-cream-deep font-heading text-sm text-espresso">
                      <tr>
                        <th scope="col" className="px-4 py-3 font-bold sm:px-5">
                          Information
                        </th>
                        <th scope="col" className="px-4 py-3 font-bold sm:px-5">
                          How long
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                      {retention.map((r) => (
                        <tr key={r.item}>
                          <th scope="row" className="px-4 py-3 align-top font-semibold text-espresso sm:px-5">
                            {r.item}
                          </th>
                          <td className="px-4 py-3 align-top text-cocoa sm:px-5">{r.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section aria-labelledby="your-rights">
                <H2 id="your-rights">Your rights</H2>
                <p className="mt-4 text-[1.0625rem] leading-relaxed text-cocoa">
                  Under UK GDPR you have rights over your information. It&apos;s free to use them, and we&apos;ll reply
                  within one month.
                </p>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {rights.map((r) => (
                    <li key={r.title} className="rounded-[1.25rem] border-2 border-espresso/15 bg-white p-4">
                      <h3 className="font-heading font-extrabold text-espresso">{r.title}</h3>
                      <p className="mt-1 text-[15px] text-cocoa">{r.body}</p>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-[1.0625rem] leading-relaxed text-cocoa">
                  To use any of these rights, email{" "}
                  <a
                    href={`mailto:${site.email}?subject=${encodeURIComponent("Privacy request")}`}
                    className="font-semibold text-rose-ink underline decoration-2 underline-offset-[3px]"
                  >
                    {site.email}
                  </a>
                  . We may ask you to confirm who you are before we act, to protect your information.
                </p>
              </section>

              <section aria-labelledby="cookies" className="prose-bos">
                <H2 id="cookies">Cookies and other sites</H2>
                <p>
                  <strong>We don&apos;t use advertising or analytics cookies.</strong> Here&apos;s everything that might
                  touch your device:
                </p>
                <ul>
                  <li>
                    <strong>One essential session cookie</strong>, only if you sign in as a member or as part of our team.
                    It keeps you signed in for up to 30 days, or until you sign out. It&apos;s strictly necessary, so it
                    doesn&apos;t need your consent.
                  </li>
                  <li>
                    <strong>Saved drafts.</strong> Our directory application can save your progress in your own
                    browser&apos;s storage, so you don&apos;t lose it. It stays on your device until you send the form or
                    clear it.
                  </li>
                  <li>
                    <strong>YouTube videos</strong> only load when you press play, using YouTube&apos;s privacy-enhanced
                    mode (youtube-nocookie.com). Until then you just see a preview picture from our own site. Once you
                    press play, YouTube&apos;s own privacy policy applies.
                  </li>
                  <li>
                    <strong>Maps.</strong> Our directory map loads map images (&ldquo;tiles&rdquo;) from CARTO or
                    OpenStreetMap, and our contact and event pages show a small OpenStreetMap map. Your browser asks
                    their servers for the map, so they can see your IP address, as with any website. We don&apos;t
                    add any cookies for this.
                  </li>
                  <li>
                    <strong>Fonts</strong> are served from our own site, not from a third party.
                  </li>
                </ul>
                <p>
                  We link to other websites, such as the businesses in our directory. Their privacy policies apply when you
                  visit them.
                </p>
              </section>

              <section aria-labelledby="young-people" className="prose-bos">
                <H2 id="young-people">Young people</H2>
                <p>
                  Our website is for a general audience and isn&apos;t aimed at children. Volunteers aged 16 or 17 can apply,
                  and we ask for a parent or guardian&apos;s details as part of that. For youth events, we&apos;ll only
                  collect what we need to keep young people safe, and we&apos;ll explain it at the time.
                </p>
              </section>

              <section aria-labelledby="complaints" className="prose-bos">
                <H2 id="complaints">Questions and complaints</H2>
                <p>
                  If you&apos;re unhappy with how we&apos;ve handled your information, please tell us first at{" "}
                  <a href={`mailto:${site.email}`}>{site.email}</a> and we&apos;ll do our best to put it right.
                </p>
                <p>
                  You also have the right to complain to the Information Commissioner&apos;s Office (ICO), the UK&apos;s
                  data protection regulator, at{" "}
                  <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer">
                    ico.org.uk<span className="sr-only"> (opens in a new tab)</span>
                  </a>
                  .
                </p>
                <p>
                  We&apos;ll update this notice when anything changes, and change the date at the top when we do.
                </p>
              </section>

              <div className="flex flex-col items-start gap-4 rounded-[1.5rem] border-2 border-espresso bg-sunflower p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
                <div>
                  <p className="font-heading text-xl font-extrabold text-espresso">Got a privacy question?</p>
                  <p className="mt-1 text-[15px] text-espresso/80">A real person on our team will get back to you.</p>
                </div>
                <ButtonLink
                  href={`mailto:${site.email}?subject=${encodeURIComponent("Privacy request")}`}
                  variant="primary"
                  icon={<Mail className="h-4 w-4" />}
                >
                  Email us
                </ButtonLink>
              </div>
              <p className="flex items-center gap-2 text-sm text-cocoa/80">
                <Eye className="h-4 w-4" aria-hidden /> Last updated: {LAST_UPDATED}
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
