/**
 * HTML strings for Leaflet divIcons and popups. Leaflet lives outside React,
 * so markup is built as escaped strings and styled by ./map.css.
 */
import { categoryIconSvg } from "@/components/icons/CategoryIcon";
import { categoryMap } from "@/content/categories";
import type { Business } from "@/content/types";
import { placeLabel } from "@/lib/directory-search";
import { initials, telHref } from "@/lib/utils";

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const safeUrl = (url: string) => (/^(https?:|tel:|mailto:|\/)/i.test(url) ? escapeHtml(url) : "#");

/** Category pin: teardrop in the category colour with the category icon inside */
export function pinHtml(b: Business, { large = false }: { large?: boolean } = {}) {
  const cat = categoryMap[b.category];
  const featured = b.tier === "featured" || b.featured;
  return `<div class="bos-pin${large ? " bos-pin--lg" : ""}" style="--pin:${cat.color};--pin-ink:${cat.ink}">
  <span class="bos-pin__drop"></span>
  <span class="bos-pin__icon" aria-hidden="true">${categoryIconSvg(b.category, cat.ink, large ? 22 : 16)}</span>
  ${featured ? '<span class="bos-pin__star" aria-hidden="true"></span>' : ""}
</div>`;
}

export const pinSize = { w: 38, h: 46, anchorY: 41 };
export const pinSizeLarge = { w: 52, h: 62, anchorY: 56 };

/** Cluster bubble. Leaflet makes it a keyboard button (Enter zooms in), so give it a spoken name. */
export function clusterHtml(count: number) {
  return `<div class="bos-cluster" aria-hidden="true"><span>${count}</span></div><span class="bos-sr">${count} businesses here. Zoom in to see them</span>`;
}

export function originHtml(kind: "me" | "place") {
  return kind === "me"
    ? '<div class="bos-origin bos-origin--me"><span class="bos-origin__pulse"></span><span class="bos-origin__dot"></span></div>'
    : '<div class="bos-origin bos-origin--place"><span class="bos-origin__pulse"></span><span class="bos-origin__dot"></span></div>';
}

const pinGlyph =
  '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>';
const checkGlyph =
  '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#167a6f" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-label="Verified" role="img"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="m9 12 2 2 4-4"/></svg>';

/** On-brand popup card. "View profile" links carry data-internal for client-side navigation. */
export function popupHtml(b: Business) {
  const cat = categoryMap[b.category];
  const name = escapeHtml(b.name);
  const logoSrc = b.icon ?? b.logo;
  const logo = logoSrc
    ? `<img src="${safeUrl(logoSrc)}" alt="" width="52" height="52" loading="lazy" />`
    : `<span class="bos-popup__initials" style="background:${cat.color};color:${cat.ink}">${escapeHtml(initials(b.name))}</span>`;

  const actions = [
    `<a class="bos-popup__btn bos-popup__btn--primary" href="/directory/${encodeURIComponent(b.slug)}" data-internal="true">View profile</a>`,
  ];
  const secondary: string[] = [];
  if (b.contact.phone)
    secondary.push(
      `<a class="bos-popup__btn" href="${safeUrl(telHref(b.contact.phone))}" aria-label="Call ${name}">Call</a>`,
    );
  if (b.contact.website)
    secondary.push(
      `<a class="bos-popup__btn" href="${safeUrl(b.contact.website)}" target="_blank" rel="noopener noreferrer" aria-label="${name} website (opens in a new tab)">Website</a>`,
    );
  if (b.socials.instagram)
    secondary.push(
      `<a class="bos-popup__btn" href="${safeUrl(b.socials.instagram)}" target="_blank" rel="noopener noreferrer" aria-label="${name} on Instagram (opens in a new tab)">Instagram</a>`,
    );

  return `<div class="bos-popup">
  <div class="bos-popup__top">
    <span class="bos-popup__logo">${logo}</span>
    <div class="bos-popup__meta">
      <p class="bos-popup__cat"><span class="bos-popup__dot" style="background:${cat.color}"></span>${escapeHtml(cat.label)}</p>
      <p class="bos-popup__name">${name}${b.verified ? ` ${checkGlyph}` : ""}</p>
      <p class="bos-popup__area">${pinGlyph}<span>${escapeHtml(placeLabel(b))}</span></p>
    </div>
  </div>
  ${b.offer ? `<p class="bos-popup__offer">${escapeHtml(b.offer.title)}</p>` : ""}
  ${b.sample ? '<p class="bos-popup__sample">Sample listing</p>' : ""}
  <div class="bos-popup__actions">${actions.join("")}${secondary.length ? `<div class="bos-popup__row">${secondary.join("")}</div>` : ""}</div>
</div>`;
}
