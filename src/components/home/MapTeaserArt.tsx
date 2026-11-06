"use client";

import { useId, useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { MAP_SIZE, motorwayM1, project, riverDon, riverRother, townLayout } from "./mapGeo";
import type { RegionId } from "@/content/types";

export type TeaserPin = { key: string; x: number; y: number; color: string; highlight?: boolean };
export type TeaserTown = { id: RegionId; label: string; x: number; y: number; count: number };

const PIN = "M0 0C-1.6-4.6-8.5-8.6-8.5-15.5a8.5 8.5 0 1 1 17 0C8.5-8.6 1.6-4.6 0 0Z";

/**
 * Stylised SVG map of Sheffield, Rotherham, Doncaster and Chesterfield.
 * Decorative (the surrounding link carries the accessible text); pins drop in
 * with a gentle stagger the first time the map scrolls into view.
 */
export function MapTeaserArt({ pins, towns }: { pins: TeaserPin[]; towns: TeaserTown[] }) {
  const uid = "map" + useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const reduce = useReducedMotion();
  const m1Shield = project({ lat: 53.475, lng: -1.442 });

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${MAP_SIZE} ${MAP_SIZE}`}
      className="h-full w-full"
      aria-hidden
      focusable="false"
    >
      <defs>
        <path id={`${uid}-don`} d={riverDon} />
        <path id={`${uid}-rother`} d={riverRother} />
      </defs>

      {/* Peak District edge, out to the west */}
      <path
        d="M0 0H18C34 28 22 70 30 104S50 150 34 196 18 252 38 292 50 352 30 392 26 428 34 440H0Z"
        fill="#1e3a2d"
        opacity="0.12"
      />
      <text x="10" y="336" className="font-heading" fontSize="11" fontWeight="700" fill="#1e3a2d" opacity="0.75">
        ← Peak District
      </text>

      {/* Urban areas */}
      {towns.map((t) => (
        <circle key={t.id} cx={t.x} cy={t.y} r={townLayout[t.id].blob.r} fill="#e7c39c" opacity="0.4" />
      ))}

      {/* M1 */}
      <path d={motorwayM1} fill="none" stroke="#1f2a63" strokeOpacity="0.35" strokeWidth="3" strokeDasharray="1 8" strokeLinecap="round" />
      <g transform={`translate(${m1Shield.x - 11} ${m1Shield.y - 7})`}>
        <rect width="22" height="14" rx="3" fill="#1f2a63" />
        <text x="11" y="10.5" textAnchor="middle" fontSize="9" fontWeight="800" fill="#fbf5ec" className="font-heading">
          M1
        </text>
      </g>

      {/* Rivers */}
      <use href={`#${uid}-don`} fill="none" stroke="#167a6f" strokeOpacity="0.55" strokeWidth="4.5" strokeLinecap="round" />
      <use href={`#${uid}-rother`} fill="none" stroke="#167a6f" strokeOpacity="0.45" strokeWidth="3.5" strokeLinecap="round" />
      <text fontSize="10" fontWeight="700" fill="#15695f" dy="-6" letterSpacing="0.5" className="font-heading">
        <textPath href={`#${uid}-don`} startOffset="52%">
          River Don
        </textPath>
      </text>
      <text fontSize="10" fontWeight="700" fill="#15695f" dy="-5" letterSpacing="0.5" className="font-heading">
        <textPath href={`#${uid}-rother`} startOffset="22%">
          River Rother
        </textPath>
      </text>

      {/* Pins */}
      {pins.map((p, i) => (
        <motion.g
          key={p.key}
          data-reveal
          initial={{ opacity: 0, y: -18, scale: 0.5 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: -18, scale: 0.5 }}
          transition={
            reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 20, delay: 0.15 + i * 0.06 }
          }
          style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}
        >
          <g transform={`translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`}>
            {p.highlight && (
              <circle
                cy="-15.5"
                r="13"
                fill="none"
                stroke={p.color}
                strokeWidth="2.5"
                opacity="0.6"
                className="origin-center animate-ping [transform-box:fill-box] [animation-duration:2.4s]"
              />
            )}
            <ellipse cx="1.5" cy="0.6" rx="4.5" ry="1.8" fill="#2a1910" opacity="0.25" />
            <path d={PIN} transform="translate(1.6 1.6)" fill="#2a1910" />
            <path d={PIN} fill={p.color} stroke="#2a1910" strokeWidth="1.6" strokeLinejoin="round" />
            <circle cy="-15.5" r="3.2" fill="#fbf5ec" stroke="#2a1910" strokeWidth="1.2" />
          </g>
        </motion.g>
      ))}

      {/* Town labels */}
      {towns.map((t) => {
        const l = townLayout[t.id].label;
        const big = t.id === "sheffield";
        return (
          <g key={t.id} transform={`translate(${(t.x + l.dx).toFixed(1)} ${(t.y + l.dy).toFixed(1)})`}>
            <text
              textAnchor={l.anchor}
              fontSize={big ? 19 : 14}
              fontWeight="800"
              fill="#2a1910"
              stroke="#f5ebdd"
              strokeWidth="5"
              strokeLinejoin="round"
              paintOrder="stroke"
              className="font-heading"
            >
              {t.label}
            </text>
            <text
              y={big ? 16 : 14}
              textAnchor={l.anchor}
              fontSize="10.5"
              fontWeight="600"
              fill="#55321f"
              stroke="#f5ebdd"
              strokeWidth="4"
              strokeLinejoin="round"
              paintOrder="stroke"
            >
              {t.count === 0 ? "Join the map" : t.count === 1 ? "1 listing" : `${t.count} listings`}
            </text>
          </g>
        );
      })}

      {/* Compass */}
      <g transform="translate(238 40)">
        <circle r="17" fill="#fbf5ec" stroke="#2a1910" strokeWidth="2" />
        <path d="M0-11 5 3 0 0-5 3Z" fill="#e0628f" stroke="#2a1910" strokeWidth="1.2" strokeLinejoin="round" />
        <text y="12" textAnchor="middle" fontSize="8" fontWeight="800" fill="#2a1910" className="font-heading">
          N
        </text>
      </g>
    </svg>
  );
}
