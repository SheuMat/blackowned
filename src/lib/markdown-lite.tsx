import Link from "next/link";
import type { ReactNode } from "react";
import { cn, slugify } from "@/lib/utils";
import { site } from "@/lib/site";

/**
 * MARKDOWN-LITE
 *
 * A tiny, safe renderer for `Story.body` and other editorial copy.
 * Everything becomes React elements (React escapes text for us), so there is
 * no dangerouslySetInnerHTML and no way for content to inject HTML.
 *
 * Blocks (separated by blank lines):
 *   ## Heading           -> <h2>
 *   ### Smaller heading  -> <h3>
 *   > Quote line         -> <blockquote>
 *   - Bullet             -> <ul> (consecutive lines)
 *   1. Numbered          -> <ol> (consecutive lines)
 *   anything else        -> <p> (consecutive lines are joined)
 *
 * Inline: **bold**, *italic*, [text](url). External links open in a new tab.
 */

export type MdBlock =
  | { type: "h2" | "h3"; text: string; id: string }
  | { type: "p"; text: string }
  /** Each entry is one paragraph of the quote (a bare ">" line starts a new one) */
  | { type: "quote"; lines: string[] }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[]; start: number };

const HEADING = /^(#{1,6})\s+(.+)$/;
const QUOTE = /^>\s?(.*)$/;
const BULLET = /^[-*•]\s+(.+)$/;
const NUMBERED = /^(\d+)[.)]\s+(.+)$/;

export function parseMarkdownLite(source: string): MdBlock[] {
  const blocks: MdBlock[] = [];
  const usedIds = new Map<string, number>();
  // `open` = the last block can still take more lines (no blank line since)
  let open = false;
  const last = () => (open ? blocks[blocks.length - 1] : undefined);

  for (const raw of source.replace(/\r\n?/g, "\n").split("\n")) {
    const line = raw.trim();
    if (!line) {
      open = false;
      continue;
    }

    let m = HEADING.exec(line);
    if (m) {
      const text = m[2]!.trim();
      const base = slugify(text.replace(/[*_[\]()]/g, "")) || "section";
      const n = usedIds.get(base) ?? 0;
      usedIds.set(base, n + 1);
      blocks.push({ type: m[1]!.length <= 2 ? "h2" : "h3", text, id: n ? `${base}-${n + 1}` : base });
      open = false;
      continue;
    }

    m = QUOTE.exec(line);
    if (m) {
      const prev = last();
      const text = m[1]!.trim();
      if (prev?.type === "quote") {
        // Consecutive "> " lines join into one paragraph; a bare ">" starts the next
        const n = prev.lines.length;
        if (!text) {
          if (n && prev.lines[n - 1] !== "") prev.lines.push("");
        } else if (n && prev.lines[n - 1] !== "") prev.lines[n - 1] += ` ${text}`;
        else if (n) prev.lines[n - 1] = text;
        else prev.lines.push(text);
      } else {
        blocks.push({ type: "quote", lines: text ? [text] : [] });
        open = true;
      }
      continue;
    }

    m = BULLET.exec(line);
    if (m) {
      const prev = last();
      if (prev?.type === "ul") prev.items.push(m[1]!);
      else {
        blocks.push({ type: "ul", items: [m[1]!] });
        open = true;
      }
      continue;
    }

    m = NUMBERED.exec(line);
    if (m) {
      const prev = last();
      if (prev?.type === "ol") prev.items.push(m[2]!);
      else {
        blocks.push({ type: "ol", items: [m[2]!], start: Number(m[1]) });
        open = true;
      }
      continue;
    }

    const prev = last();
    if (prev?.type === "p") prev.text += ` ${line}`;
    else {
      blocks.push({ type: "p", text: line });
      open = true;
    }
  }

  for (const b of blocks) if (b.type === "quote") b.lines = b.lines.filter(Boolean);
  return blocks.filter((b) => b.type !== "quote" || b.lines.length > 0);
}

/* ───────────────────────────── Inline ───────────────────────────── */

// Order matters: links first (their text may contain emphasis), then bold, then italic.
const INLINE = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*(.+?)\*\*|\*([^*\s](?:[^*]*[^*\s])?)\*/g;

const siteHost = (() => {
  try {
    return new URL(site.url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
})();

function safeHref(url: string): { href: string; external: boolean } | null {
  if (url.startsWith("/") && !url.startsWith("//")) return { href: url, external: false };
  if (url.startsWith("#")) return { href: url, external: false };
  if (/^(mailto|tel):/i.test(url)) return { href: url, external: false };
  if (/^https?:\/\//i.test(url)) {
    try {
      const host = new URL(url).hostname.replace(/^www\./, "");
      return { href: url, external: host !== siteHost };
    } catch {
      return null;
    }
  }
  return null; // javascript:, data: and anything unexpected render as plain text
}

export function renderInline(text: string, keyPrefix = "i"): ReactNode[] {
  const out: ReactNode[] = [];
  let cursor = 0;
  let n = 0;
  const matches = [...text.matchAll(INLINE)];

  for (const m of matches) {
    const start = m.index ?? 0;
    if (start > cursor) out.push(text.slice(cursor, start));
    const key = `${keyPrefix}-${n++}`;

    if (m[1] !== undefined && m[2] !== undefined) {
      const link = safeHref(m[2]);
      const children = renderInline(m[1], key);
      if (!link) out.push(<span key={key}>{children}</span>);
      else if (link.external)
        out.push(
          <a key={key} href={link.href} target="_blank" rel="noopener noreferrer">
            {children}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>,
        );
      else if (link.href.startsWith("/"))
        out.push(
          <Link key={key} href={link.href}>
            {children}
          </Link>,
        );
      else
        out.push(
          <a key={key} href={link.href}>
            {children}
          </a>,
        );
    } else if (m[3] !== undefined) {
      out.push(<strong key={key}>{renderInline(m[3], key)}</strong>);
    } else if (m[4] !== undefined) {
      out.push(<em key={key}>{renderInline(m[4], key)}</em>);
    }
    cursor = start + m[0].length;
  }
  if (cursor < text.length) out.push(text.slice(cursor));
  return out;
}

/** Strip markdown-lite syntax, e.g. for meta descriptions or word counts. */
export function markdownToPlainText(source: string) {
  return parseMarkdownLite(source)
    .map((b) => ("text" in b ? b.text : "lines" in b ? b.lines.join(" ") : b.items.join(" ")))
    .join("\n\n")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\*\*?/g, "");
}

/** Rough reading time at ~220 words a minute (minimum one minute). */
export function estimateReadingMinutes(source: string) {
  const words = markdownToPlainText(source).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

/* ───────────────────────────── Render ───────────────────────────── */

export function MarkdownLite({
  source,
  className,
  /** Adds a large first-letter drop cap to the opening paragraph */
  dropCap = false,
}: {
  source: string;
  className?: string;
  dropCap?: boolean;
}) {
  const blocks = parseMarkdownLite(source);
  const firstP = blocks.findIndex((b) => b.type === "p");
  const first = blocks[firstP];
  // A drop cap only looks right on an opening paragraph of three lines or more
  const useDropCap = dropCap && first?.type === "p" && first.text.length >= 220;

  return (
    <div className={cn("prose-bos", className)}>
      {blocks.map((b, i) => {
        const key = `b${i}`;
        switch (b.type) {
          case "h2":
            return (
              <h2 key={key} id={b.id} className="scroll-mt-28">
                {renderInline(b.text, key)}
              </h2>
            );
          case "h3":
            return (
              <h3 key={key} id={b.id} className="scroll-mt-28">
                {renderInline(b.text, key)}
              </h3>
            );
          case "quote":
            return (
              <blockquote key={key}>
                {b.lines.map((l, j) => (
                  <p key={j} className={j > 0 ? "mt-3" : undefined}>
                    {renderInline(l, `${key}-${j}`)}
                  </p>
                ))}
              </blockquote>
            );
          case "ul":
            return (
              <ul key={key}>
                {b.items.map((item, j) => (
                  <li key={j}>{renderInline(item, `${key}-${j}`)}</li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={key} start={b.start !== 1 ? b.start : undefined}>
                {b.items.map((item, j) => (
                  <li key={j}>{renderInline(item, `${key}-${j}`)}</li>
                ))}
              </ol>
            );
          default:
            return (
              <p
                key={key}
                className={
                  useDropCap && i === firstP
                    ? "first-letter:float-left first-letter:mt-1.5 first-letter:mr-2.5 first-letter:font-heading first-letter:text-[4.1rem] first-letter:leading-[0.78] first-letter:font-extrabold first-letter:text-rose-ink"
                    : undefined
                }
              >
                {renderInline(b.text, key)}
              </p>
            );
        }
      })}
    </div>
  );
}
