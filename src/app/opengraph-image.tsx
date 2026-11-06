import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

/**
 * Default social sharing image (1200×630) for every page that doesn't set its own.
 * Uses the font bundled with next/og (no network fetch), made chunky with a
 * text stroke so it reads like the logo's bubbly letters.
 */
export const alt = `${site.name}: ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const ESPRESSO = "#2a1910";
const CREAM = "#fbf5ec";
const PINK = "#f2a0bd";
const TANGERINE = "#ee6a35";
const SUNFLOWER = "#f6bd3c";
const TEAL = "#167a6f";

// Logo skin tones, dark → light, cycled per letter
const TONES = ["#2a1910", "#7a4a2e", "#d19a62", "#55321f", "#a8693d", "#e7c39c"];
const LIGHT = new Set(["#d19a62", "#e7c39c", "#a8693d"]);

function ToneWord({ text, offset, fontSize }: { text: string; offset: number; fontSize: number }) {
  let i = offset;
  return (
    <div style={{ display: "flex" }}>
      {text.split("").map((ch, idx) => {
        if (ch === " ") return <div key={idx} style={{ width: fontSize * 0.28 }} />;
        const color = TONES[i++ % TONES.length]!;
        return (
          <span
            key={idx}
            style={{
              color,
              // Thickens the bundled font. Kept modest so counters and the i's dot stay open.
              WebkitTextStroke: `${Math.round(fontSize * 0.045)}px ${color}`,
              // Hard "pop" shadow: espresso under the light tones so they read on cream,
              // a soft one under the dark tones
              textShadow: `5px 5px 0 ${LIGHT.has(color) ? ESPRESSO : "rgba(42,25,16,0.2)"}`,
              marginRight: fontSize * 0.025,
            }}
          >
            {ch}
          </span>
        );
      })}
    </div>
  );
}

export default function OpengraphImage() {
  const domain = site.url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          backgroundColor: CREAM,
          fontFamily: "sans-serif",
          overflow: "hidden",
        }}
      >
        {/* Decorative circles, market-poster style */}
        <div style={{ position: "absolute", top: -210, right: -170, width: 480, height: 480, borderRadius: 9999, backgroundColor: TANGERINE }} />
        <div style={{ position: "absolute", top: 300, right: 44, width: 72, height: 72, borderRadius: 9999, backgroundColor: SUNFLOWER }} />
        <div style={{ position: "absolute", bottom: -150, left: -110, width: 360, height: 360, borderRadius: 9999, backgroundColor: SUNFLOWER }} />
        <div style={{ position: "absolute", bottom: 90, right: 90, width: 150, height: 150, borderRadius: 9999, backgroundColor: TEAL }} />
        <div style={{ position: "absolute", bottom: 150, right: 270, width: 46, height: 46, borderRadius: 9999, backgroundColor: PINK }} />
        <div
          style={{
            position: "absolute",
            top: 110,
            right: 90,
            width: 150,
            height: 150,
            borderRadius: 9999,
            border: `10px solid ${ESPRESSO}`,
            opacity: 0.9,
          }}
        />

        {/* Kente-style band */}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 22, display: "flex" }}>
          {Array.from({ length: 24 }).map((_, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: "100%",
                backgroundColor: [ESPRESSO, SUNFLOWER, TANGERINE, PINK, TEAL, "#d19a62"][i % 6],
              }}
            />
          ))}
        </div>

        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 80px 40px",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", fontSize: 116, lineHeight: 1.04, letterSpacing: -1 }}>
            <ToneWord text="Black Owned" offset={0} fontSize={116} />
            <ToneWord text="Sheffield" offset={3} fontSize={116} />
          </div>

          <div style={{ display: "flex", marginTop: 44 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: PINK,
                color: ESPRESSO,
                border: `5px solid ${ESPRESSO}`,
                borderRadius: 9999,
                padding: "16px 34px",
                fontSize: 38,
                WebkitTextStroke: `1.2px ${ESPRESSO}`,
                boxShadow: `6px 6px 0 0 ${ESPRESSO}`,
                transform: "rotate(-2deg)",
              }}
            >
              Sheffield&apos;s home for Black-owned business
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", marginTop: 40, fontSize: 26, color: "#55321f" }}>
            <div style={{ width: 14, height: 14, borderRadius: 9999, backgroundColor: TANGERINE, marginRight: 14 }} />
            {domain}
            <div style={{ width: 6, height: 6, borderRadius: 9999, backgroundColor: "#a8693d", margin: "0 16px" }} />
            Community Interest Company
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
