"use client";

import * as React from "react";

// Each day renders two bars: light and dark (0-100 as percentage of available height)
export type Day = { light: number; dark: number };

export type WeeklyBarsProps = {
  data?: Day[];
  labels?: string[];
  className?: string;
  heightPx?: number; // total inner height for bars (default ~142 per design)
  darkColor?: string;
  lightColor?: string;
  showLabels?: boolean;
};

const DEFAULT_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const DEFAULT_DATA: Day[] = [
  { light: 28, dark: 84 },
  { light: 26, dark: 86 },
  { light: 26, dark: 82 },
  { light: 24, dark: 84 },
  { light: 24, dark: 82 },
  { light: 24, dark: 84 },
  { light: 24, dark: 84 },
];

export function WeeklyBars({
  data = DEFAULT_DATA,
  labels = DEFAULT_LABELS,
  className = "",
  heightPx = 142,
  darkColor = "#6e41b7",
  lightColor = "#9b7de0",
  showLabels = true,
}: WeeklyBarsProps) {
  const safeData = React.useMemo(() => {
    const d = data.slice(0, 7);
    while (d.length < 7) d.push({ light: 30, dark: 70 });
    return d;
  }, [data]);

  const safeLabels = React.useMemo(() => {
    const l = labels.slice(0, 7);
    while (l.length < 7) l.push("");
    return l;
  }, [labels]);

  return (
    <div className={className}>
      {/* Bars */}
      <div className="grid grid-cols-7 gap-4">
        {safeData.map((day, i) => (
          <DayColumn
            key={i}
            lightPct={day.light}
            darkPct={day.dark}
            heightPx={heightPx}
            darkColor={darkColor}
            lightColor={lightColor}
          />
        ))}
      </div>
      {showLabels && (
        <div className="mt-2 grid grid-cols-7 text-center text-[14px] text-[#abadb5]">
          {safeLabels.map((l, i) => (
            <div key={i}>{l}</div>
          ))}
        </div>
      )}
    </div>
  );
}

function DayColumn({
  lightPct,
  darkPct,
  heightPx,
  darkColor,
  lightColor,
}: {
  lightPct: number;
  darkPct: number;
  heightPx: number;
  darkColor: string;
  lightColor: string;
}) {
  const clamp = (n: number) => Math.max(0, Math.min(100, n));
  const lightPctClamped = clamp(lightPct);
  const darkPctClamped = clamp(darkPct);

  // Layout numbers tuned to match the design
  const PAD = 12; // equals p-3
  const GAP = 12; // space between two inner blocks
  const MIN_H = 16; // minimal visible block height

  const inner = Math.max(0, heightPx - PAD * 2);
  let lightPx = Math.round((inner * lightPctClamped) / 100);
  let darkPx = Math.round((inner * darkPctClamped) / 100);

  // Ensure both are at least MIN_H, then fit them within inner with GAP
  lightPx = Math.max(MIN_H, lightPx);
  darkPx = Math.max(MIN_H, darkPx);

  const totalNeeded = lightPx + GAP + darkPx;
  if (totalNeeded > inner && totalNeeded > 0) {
    const scale = (inner - GAP) / (lightPx + darkPx);
    lightPx = Math.max(MIN_H, Math.round(lightPx * scale));
    darkPx = Math.max(MIN_H, Math.round(darkPx * scale));
    // If after min clamp we're still overflowing, trim proportionally
    const overflow = lightPx + GAP + darkPx - inner;
    if (overflow > 0) {
      const lightShare = lightPx / (lightPx + darkPx);
      lightPx -= Math.round(overflow * lightShare);
      darkPx = inner - GAP - lightPx;
    }
  }

  return (
    <div className="flex flex-col justify-end">
      <div
        className="flex w-full flex-col justify-between rounded-2xl border border-[#e6ebf1] bg-[#fafbfc] p-3"
        style={{ height: heightPx, boxShadow: "0 1px 0 rgba(17,24,39,0.03)" }}
      >
        <div
          className="w-full rounded-xl"
          style={{ height: lightPx, backgroundColor: lightColor }}
        />
        <div style={{ height: GAP }} />
        <div
          className="w-full rounded-xl"
          style={{ height: darkPx, backgroundColor: darkColor }}
        />
      </div>
    </div>
  );
}

export default WeeklyBars;
