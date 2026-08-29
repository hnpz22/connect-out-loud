import { useMemo } from "react";

import type { PulseEvent } from "@/types";

const rings = [
  { label: "0–1 km", max: 1000, size: 34 },
  { label: "1–3 km", max: 3000, size: 66 },
  { label: "3–5 km", max: 5500, size: 98 },
];

export function PulseRadar({ events }: { events: PulseEvent[] }) {
  const counts = useMemo(
    () => rings.map((ring) => events.filter((e) => e.distance_m <= ring.max).length),
    [events],
  );

  return (
    <div className="panel-surface rounded-3xl p-4">
      <div className="flex items-center gap-4">
        <div className="relative grid size-[124px] shrink-0 place-items-center">
          {rings.map((ring, i) => (
            <span
              key={ring.label}
              className="absolute rounded-full border border-cyan/25"
              style={{
                width: `${ring.size}%`,
                aspectRatio: "1",
                animation: `pulse-ring 3.4s ${i * 0.7}s cubic-bezier(0.2,0.6,0.3,1) infinite`,
                opacity: 0.5,
              }}
              aria-hidden
            />
          ))}
          {rings.map((ring) => (
            <span
              key={`static-${ring.label}`}
              className="absolute rounded-full border border-border"
              style={{ width: `${ring.size}%`, aspectRatio: "1" }}
              aria-hidden
            />
          ))}
          <span
            className="absolute size-full rounded-full animate-sweep"
            style={{
              background:
                "conic-gradient(from 0deg, transparent 0deg, oklch(0.872 0.132 205 / 0.22) 40deg, transparent 80deg)",
            }}
            aria-hidden
          />
          <span className="relative size-2.5 rounded-full bg-cyan shadow-glow-cyan" />
        </div>

        <div className="flex-1 space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Pulse Radar
          </p>
          {rings.map((ring, i) => (
            <div key={ring.label} className="flex items-baseline justify-between gap-2">
              <span className="text-xs text-muted-foreground">{ring.label}</span>
              <span className="text-sm font-semibold text-foreground">
                {counts[i]} <span className="text-xs font-normal text-muted-foreground">experiencias</span>
              </span>
            </div>
          ))}
          <p className="pt-1 text-[11px] text-mint">Hay vida cerca de ti.</p>
        </div>
      </div>
    </div>
  );
}
