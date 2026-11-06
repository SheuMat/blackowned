import type { ReactNode } from "react";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

export type LegendItem = { label: string; color: string; kind?: "bar" | "line" };

export type ChartTable = {
  caption: string;
  columns: string[];
  rows: (string | number)[][];
};

/**
 * Frame for every impact chart: title, subtitle, legend (only for 2+ series),
 * the plot, a footnote, and a visually hidden data table so the numbers are
 * available without seeing the chart.
 */
export function ChartCard({
  id,
  title,
  subtitle,
  legend,
  note,
  table,
  children,
  className,
}: {
  id: string;
  title: string;
  subtitle?: ReactNode;
  legend?: LegendItem[];
  note?: ReactNode;
  table: ChartTable;
  children: ReactNode;
  className?: string;
}) {
  return (
    <figure
      aria-labelledby={`${id}-title`}
      /* min-w-0: as a grid item the card would otherwise grow to fit the chart's
         initial SVG width, and the chart would then measure that inflated width */
      className={cn("flex min-w-0 flex-col rounded-[1.5rem] border-2 border-espresso bg-white p-5 shadow-pop-sm sm:p-7", className)}
    >
      <figcaption>
        <h3 id={`${id}-title`} className="font-heading text-xl font-extrabold leading-tight text-espresso sm:text-2xl">
          {title}
        </h3>
        {subtitle && <p className="mt-1.5 text-sm leading-relaxed text-cocoa">{subtitle}</p>}
      </figcaption>

      {legend && legend.length > 1 && (
        <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-cocoa" aria-label="Key">
          {legend.map((l) => (
            <li key={l.label} className="inline-flex items-center gap-2">
              {l.kind === "line" ? (
                <span aria-hidden className="h-0.5 w-4 rounded-full" style={{ backgroundColor: l.color }} />
              ) : (
                <span aria-hidden className="h-3 w-3 rounded-[3px]" style={{ backgroundColor: l.color }} />
              )}
              {l.label}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-5 flex-1">{children}</div>

      {note && (
        <p className="mt-5 flex items-start gap-2 border-t border-line pt-4 text-xs leading-relaxed text-cocoa/90">
          <Info className="mt-px h-3.5 w-3.5 shrink-0 text-rose-ink" aria-hidden />
          <span>{note}</span>
        </p>
      )}

      <table className="sr-only">
        <caption>{table.caption}</caption>
        <thead>
          <tr>
            {table.columns.map((c) => (
              <th key={c} scope="col">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((r, i) => (
            <tr key={i}>
              {r.map((cell, j) =>
                j === 0 ? (
                  <th key={j} scope="row">
                    {cell}
                  </th>
                ) : (
                  <td key={j}>{cell}</td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

/** Dark tooltip shell. Values lead, labels follow. */
export function ChartTooltip({
  left,
  top,
  width,
  children,
}: {
  left: number;
  top: number;
  width: number;
  children: ReactNode;
}) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute z-10 rounded-xl bg-espresso px-3 py-2.5 text-[13px] leading-snug text-cream shadow-lift"
      style={{ left, top, width }}
    >
      {children}
    </div>
  );
}
