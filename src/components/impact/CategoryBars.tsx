"use client";

import type { CategoryCount } from "@/content/impact";
import { ChartTooltip } from "./ChartCard";
import { chartColors, clampTip, hBarPath, plural } from "./chartKit";
import { useActiveIndex, useWidth } from "./useChart";

const ROW_NARROW = 34;
const ROW_WIDE = 42;
const BAR = 16;
const GAP = 2;
const TIP_W = 210;

/**
 * Horizontal bar chart: directory listings per category, biggest first.
 * Live listings sit on the baseline in rose; sample listings stack after
 * them in caramel, separated by a 2px surface gap.
 */
export function CategoryBars({ data, showSamples, label }: { data: CategoryCount[]; showSamples: boolean; label: string }) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const { active, setActive, containerProps } = useActiveIndex(data.length);

  const narrow = width < 480;
  const ROW = narrow ? ROW_NARROW : ROW_WIDE;
  const labelW = narrow ? 96 : 188;
  const barX = labelW + 12;
  const trackW = Math.max(40, width - barX - 34);
  const max = Math.max(1, ...data.map((d) => (showSamples ? d.total : d.live)));
  const unit = trackW / max;
  const height = data.length * ROW;

  const activeRow = active !== null ? data[active] : undefined;
  const activeTotal = activeRow ? (showSamples ? activeRow.total : activeRow.live) : 0;
  const tipTop = active !== null ? (active * ROW + ROW + 4 + 96 > height ? active * ROW - 92 : active * ROW + ROW + 2) : 0;

  return (
    <div
      ref={ref}
      role="img"
      aria-label={label}
      {...containerProps}
      className="relative -mx-1 rounded-xl px-1 outline-offset-4"
    >
      <svg width={width} height={height} className="block overflow-visible" aria-hidden>
        {data.map((d, i) => {
          const y = i * ROW;
          const barY = y + (ROW - BAR) / 2;
          const liveW = d.live * unit;
          const sampleW = showSamples ? d.sample * unit : 0;
          const total = showSamples ? d.total : d.live;
          const end = barX + liveW + (liveW > 0 && sampleW > 0 ? GAP : 0) + sampleW;
          const isActive = active === i;
          return (
            <g key={d.id} onPointerEnter={() => setActive(i)} onPointerDown={() => setActive(i)}>
              <rect x={-4} y={y} width={width + 8} height={ROW} rx={8} fill={isActive ? chartColors.hover : "transparent"} />
              <text
                x={0}
                y={y + ROW / 2}
                dominantBaseline="central"
                className="fill-cocoa text-[13px] font-medium sm:text-sm"
              >
                {narrow ? d.short : d.label}
              </text>
              {liveW > 0 && (
                <path d={hBarPath(barX, barY, liveW, BAR, sampleW === 0)} fill={chartColors.live} />
              )}
              {sampleW > 0 && (
                <path
                  d={hBarPath(barX + liveW + (liveW > 0 ? GAP : 0), barY, sampleW, BAR)}
                  fill={chartColors.sample}
                />
              )}
              <text
                x={total > 0 ? end + 8 : barX}
                y={y + ROW / 2}
                dominantBaseline="central"
                className={total > 0 ? "fill-espresso text-sm font-bold tabular-nums" : "fill-cocoa/70 text-[13px] tabular-nums"}
              >
                {total}
              </text>
            </g>
          );
        })}
      </svg>

      {activeRow && (
        <ChartTooltip left={clampTip(barX + activeTotal * unit, TIP_W, width)} top={tipTop} width={TIP_W}>
          <p className="font-heading text-base font-bold">{plural(activeTotal, "listing")}</p>
          <p className="text-cream/75">{activeRow.label}</p>
          {showSamples && (
            <ul className="mt-1.5 space-y-0.5 border-t border-cream/15 pt-1.5">
              <li className="flex items-center gap-2">
                <span className="h-1 w-3 rounded-full" style={{ backgroundColor: chartColors.live }} />
                <span className="font-semibold">{activeRow.live}</span> live
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1 w-3 rounded-full" style={{ backgroundColor: chartColors.sample }} />
                <span className="font-semibold">{activeRow.sample}</span> sample
              </li>
            </ul>
          )}
        </ChartTooltip>
      )}
    </div>
  );
}
