"use client";

import type { PointerEvent } from "react";
import type { GrowthPoint } from "@/content/impact";
import { ChartTooltip } from "./ChartCard";
import { chartColors, niceScale } from "./chartKit";
import { useActiveIndex, useWidth } from "./useChart";

const HEIGHT = 250;
const TOP = 14;
const AXIS = 32;
const PAD_L = 30;
const PAD_R = 34;
const TIP_W = 210;

/**
 * Line chart: cumulative live directory listings at the end of each month.
 * Sample listings are never drawn: their join dates are made up.
 */
export function GrowthLines({ data, label }: { data: GrowthPoint[]; label: string }) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const { active, setActive, containerProps } = useActiveIndex(data.length);

  const n = data.length;
  const plotW = Math.max(40, width - PAD_L - PAD_R);
  const plotH = HEIGHT - TOP - AXIS;
  const baseY = TOP + plotH;
  const top = Math.max(1, ...data.map((d) => d.live));
  const scale = niceScale(top);
  const x = (i: number) => (n <= 1 ? PAD_L + plotW / 2 : PAD_L + (i / (n - 1)) * plotW);
  const y = (v: number) => baseY - (v / scale.max) * plotH;

  const line = (key: "live") =>
    data.map((d, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)} ${y(d[key]).toFixed(1)}`).join("");
  const area = (key: "live") => `${line(key)}L${x(n - 1).toFixed(1)} ${baseY}L${x(0).toFixed(1)} ${baseY}Z`;

  const ticks: number[] = [];
  for (let v = 0; v <= scale.max; v += scale.step) ticks.push(v);

  // X labels: first, last, and each January that has room. Labels are ~64px
  // wide; the first is left-aligned and the last right-aligned to the plot.
  const LABEL_W = 64;
  const span = (i: number): [number, number] =>
    i === 0 ? [x(i), x(i) + LABEL_W] : i === n - 1 ? [x(i) - LABEL_W, x(i)] : [x(i) - LABEL_W / 2, x(i) + LABEL_W / 2];
  const xLabels: number[] = n > 0 ? [0] : [];
  data.forEach((d, i) => {
    if (i === 0 || i === n - 1 || !d.month.endsWith("-01")) return;
    const prev = xLabels[xLabels.length - 1]!;
    const lastSpan = span(n - 1);
    if (span(i)[0] - span(prev)[1] < 10 || lastSpan[0] - span(i)[1] < 10) return;
    xLabels.push(i);
  });
  if (n > 1) xLabels.push(n - 1);

  const series = [{ key: "live" as const, label: "Live listings", color: chartColors.live }];
  const last = data[n - 1];
  const endY = series.map((s) => (last ? y(last[s.key]) : baseY));

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    if (n === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const i = n <= 1 ? 0 : Math.round(((px - PAD_L) / plotW) * (n - 1));
    setActive(Math.max(0, Math.min(n - 1, i)));
  }

  const a = active !== null ? data[active] : undefined;
  const tipLeft =
    active !== null ? (x(active) + 12 + TIP_W <= width ? x(active) + 12 : Math.max(4, x(active) - 12 - TIP_W)) : 0;

  return (
    <div
      ref={ref}
      role="img"
      aria-label={label}
      {...containerProps}
      onPointerMove={onPointerMove}
      onPointerDown={onPointerMove}
      className="relative touch-pan-y outline-offset-4"
    >
      <svg width={width} height={HEIGHT} className="block overflow-visible" aria-hidden>
        {/* Gridlines + y ticks */}
        {ticks.map((t) => (
          <g key={t}>
            <line
              x1={PAD_L}
              x2={PAD_L + plotW}
              y1={Math.round(y(t)) + 0.5}
              y2={Math.round(y(t)) + 0.5}
              stroke={t === 0 ? chartColors.baseline : chartColors.grid}
              strokeWidth={1}
            />
            <text x={PAD_L - 8} y={y(t)} textAnchor="end" dominantBaseline="central" className="fill-cocoa/80 text-xs tabular-nums">
              {t}
            </text>
          </g>
        ))}

        {/* X labels */}
        {xLabels.map((i) => (
          <text
            key={data[i]!.month}
            x={x(i)}
            y={baseY + 22}
            textAnchor={i === 0 ? "start" : i === n - 1 ? "end" : "middle"}
            className="fill-cocoa text-[13px] font-medium"
          >
            {data[i]!.label}
          </text>
        ))}

        {/* Area wash + lines */}
        {series.map((s) => (
          <g key={s.key}>
            {s.key === series[0]!.key && <path d={area(s.key)} fill={s.color} opacity={0.1} />}
            <path d={line(s.key)} fill="none" stroke={s.color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
          </g>
        ))}

        {/* Crosshair */}
        {a && active !== null && (
          <line
            x1={x(active)}
            x2={x(active)}
            y1={TOP}
            y2={baseY}
            stroke={chartColors.ink}
            strokeOpacity={0.35}
            strokeWidth={1}
          />
        )}

        {/* End dots + direct labels (or active dots) */}
        {series.map((s, si) => {
          const idx = active ?? n - 1;
          const d = data[idx];
          if (!d) return null;
          return (
            <g key={s.key}>
              <circle cx={x(idx)} cy={y(d[s.key])} r={4} fill={s.color} stroke={chartColors.surface} strokeWidth={2} />
              {active === null && (
                <text
                  x={x(idx) + 10}
                  y={endY[si]}
                  dominantBaseline="central"
                  className="fill-espresso text-sm font-bold tabular-nums"
                >
                  {d[s.key]}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {a && (
        <ChartTooltip left={tipLeft} top={TOP} width={TIP_W}>
          <p className="font-heading text-sm font-bold">{a.longLabel}</p>
          <ul className="mt-1.5 space-y-0.5 border-t border-cream/15 pt-1.5">
            {series.map((s) => (
              <li key={s.key} className="flex items-center gap-2">
                <span className="h-1 w-3 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="font-semibold tabular-nums">{a[s.key]}</span>
                <span className="text-cream/75">{s.label.toLowerCase()}</span>
              </li>
            ))}
          </ul>
          {a.joined.length > 0 && (
            <p className="mt-1.5 text-cream/75">
              +{a.joined.length} joined this month:{" "}
              <span className="font-semibold text-cream">{a.joined.join(", ")}</span>
            </p>
          )}
        </ChartTooltip>
      )}
    </div>
  );
}
