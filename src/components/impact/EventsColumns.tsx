"use client";

import type { YearCount } from "@/content/impact";
import { ChartTooltip } from "./ChartCard";
import { chartColors, columnPath, plural } from "./chartKit";
import { useActiveIndex, useWidth } from "./useChart";

const HEIGHT = 230;
const TOP = 30; // room for value labels on the caps
const AXIS = 30; // x-axis labels
const COL = 24;
const TIP_W = 220;

/** Tooltip sits beside the active column so it never hides it */
function sideTip(x: number, colW: number, width: number) {
  const right = x + colW / 2 + 10;
  if (right + TIP_W <= width) return right;
  return Math.max(4, x - colW / 2 - 10 - TIP_W);
}

/** Column chart: events delivered per year (zero years included). */
export function EventsColumns({ data, label }: { data: YearCount[]; label: string }) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const { active, setActive, containerProps } = useActiveIndex(data.length);

  const plotH = HEIGHT - TOP - AXIS;
  const baseY = TOP + plotH;
  const max = Math.max(1, ...data.map((d) => d.count));
  const slot = width / Math.max(1, data.length);
  const colW = Math.min(COL, slot * 0.6);
  const cx = (i: number) => slot * i + slot / 2;
  const h = (n: number) => (n / max) * plotH;

  const activeYear = active !== null ? data[active] : undefined;

  return (
    <div ref={ref} role="img" aria-label={label} {...containerProps} className="relative outline-offset-4">
      <svg width={width} height={HEIGHT} className="block overflow-visible" aria-hidden>
        {data.map((d, i) => {
          const x = cx(i);
          const isActive = active === i;
          const colH = h(d.count);
          return (
            <g key={d.year} onPointerEnter={() => setActive(i)} onPointerDown={() => setActive(i)}>
              <rect x={slot * i + 2} y={0} width={slot - 4} height={HEIGHT} rx={10} fill={isActive ? chartColors.hover : "transparent"} />
              {d.count > 0 && <path d={columnPath(x - colW / 2, baseY, colW, colH)} fill={chartColors.events} />}
              <text
                x={x}
                y={baseY - colH - 10}
                textAnchor="middle"
                className={d.count > 0 ? "fill-espresso text-sm font-bold tabular-nums" : "fill-cocoa/70 text-[13px] tabular-nums"}
              >
                {d.count}
              </text>
              <text x={x} y={baseY + 21} textAnchor="middle" className="fill-cocoa text-[13px] font-medium tabular-nums">
                {d.year}
              </text>
            </g>
          );
        })}
        <line x1={0} x2={width} y1={baseY + 0.5} y2={baseY + 0.5} stroke={chartColors.baseline} strokeWidth={1} />
      </svg>

      {activeYear && active !== null && (
        <ChartTooltip
          left={sideTip(cx(active), colW, width)}
          top={TOP - 6}
          width={TIP_W}
        >
          <p className="font-heading text-base font-bold">{plural(activeYear.count, "event")}</p>
          <p className="text-cream/75">Delivered in {activeYear.year}</p>
          {activeYear.titles.length > 0 ? (
            <ul className="mt-1.5 space-y-1 border-t border-cream/15 pt-1.5">
              {activeYear.titles.map((t) => (
                <li key={t} className="flex gap-2">
                  <span className="mt-[7px] h-1 w-3 shrink-0 rounded-full" style={{ backgroundColor: chartColors.events }} />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-1.5 border-t border-cream/15 pt-1.5 text-cream/75">No events delivered this year.</p>
          )}
        </ChartTooltip>
      )}
    </div>
  );
}
