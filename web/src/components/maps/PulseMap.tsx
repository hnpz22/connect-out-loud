import { useMemo, useState } from "react";
import { Minus, Plus, Navigation } from "lucide-react";

import { accentClasses, categoryAccent } from "@/lib/pulse-ui";
import { cn } from "@/lib/utils";
import { DEMO_CITY } from "@/mock/data";
import type { PulseEvent } from "@/types";

/**
 * Mock visual map. The projection + marker layer mirror the shape the
 * Google Maps JavaScript API (Advanced Markers) integration will use,
 * so swapping in the real map only replaces this component's internals.
 */

const SPAN = 0.055; // degrees covered by the viewport at zoom 1

function project(event: { latitude: number; longitude: number }, zoom: number) {
  const span = SPAN / zoom;
  const x = 50 + ((event.longitude - DEMO_CITY.longitude) / span) * 100;
  const y = 50 - ((event.latitude - DEMO_CITY.latitude) / span) * 100;
  return { x, y };
}

interface Cluster {
  key: string;
  x: number;
  y: number;
  events: PulseEvent[];
}

function clusterEvents(events: PulseEvent[], zoom: number): Cluster[] {
  const cell = zoom >= 2 ? 6 : 13;
  const map = new Map<string, Cluster>();
  events.forEach((event) => {
    const { x, y } = project(event, zoom);
    const key = `${Math.round(x / cell)}:${Math.round(y / cell)}`;
    const existing = map.get(key);
    if (existing) {
      existing.events.push(event);
      existing.x = (existing.x * (existing.events.length - 1) + x) / existing.events.length;
      existing.y = (existing.y * (existing.events.length - 1) + y) / existing.events.length;
    } else {
      map.set(key, { key, x, y, events: [event] });
    }
  });
  return [...map.values()];
}

export function EventMarker({
  event,
  active,
  recommended,
  onClick,
}: {
  event: PulseEvent;
  active: boolean;
  recommended: boolean;
  onClick: () => void;
}) {
  const accent = accentClasses[categoryAccent[event.category]];
  return (
    <button
      type="button"
      onClick={onClick}
      className="group absolute -translate-x-1/2 -translate-y-full"
      style={{ left: "50%", top: "50%" }}
      aria-label={event.title}
    >
      {(recommended || active) && (
        <span
          className={cn(
            "absolute bottom-0 left-1/2 size-10 -translate-x-1/2 translate-y-1/2 rounded-full",
            accent.bg,
            "opacity-30 animate-pulse-ring",
          )}
          aria-hidden
        />
      )}
      <span
        className={cn(
          "relative grid size-10 place-items-center rounded-2xl border text-base backdrop-blur-md transition-transform duration-200 group-hover:scale-110",
          accent.soft,
          accent.border,
          active && cn("scale-110 ring-2", accent.ring),
          event.is_pod && "rounded-full",
        )}
      >
        {event.emoji}
      </span>
      <span
        className={cn(
          "mx-auto block h-2 w-2 -translate-y-0.5 rotate-45 rounded-[2px]",
          accent.bg,
          "opacity-80",
        )}
        aria-hidden
      />
      {recommended && (
        <span className="absolute -right-1 -top-1 rounded-full bg-yellow px-1 text-[9px] font-bold text-on-bright">
          ✨
        </span>
      )}
    </button>
  );
}

export function PulseMap({
  events,
  selectedId,
  onSelect,
  radiusKm,
  routeTo,
  className,
}: {
  events: PulseEvent[];
  selectedId?: string | null;
  onSelect?: (event: PulseEvent) => void;
  radiusKm: number;
  routeTo?: PulseEvent | null;
  className?: string;
}) {
  const [zoom, setZoom] = useState(1);
  const clusters = useMemo(() => clusterEvents(events, zoom), [events, zoom]);
  const bestScore = useMemo(
    () => events.reduce((max, e) => Math.max(max, e.match_score), 0),
    [events],
  );

  const radiusPct = (radiusKm / ((SPAN / zoom) * 111)) * 100;
  const destination = routeTo ? project(routeTo, zoom) : null;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border border-border bg-panel",
        className,
      )}
    >
      {/* street grid */}
      <div
        className="absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "linear-gradient(var(--panel-2) 1px, transparent 1px), linear-gradient(90deg, var(--panel-2) 1px, transparent 1px)",
          backgroundSize: `${34 * zoom}px ${34 * zoom}px`,
        }}
        aria-hidden
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(45% 40% at 22% 28%, oklch(0.872 0.148 165 / 0.12), transparent 70%), radial-gradient(50% 45% at 78% 70%, oklch(0.68 0.175 292 / 0.14), transparent 72%)",
        }}
        aria-hidden
      />
      {/* diagonal avenues */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(58deg, transparent 48%, var(--panel-2) 48%, var(--panel-2) 52%, transparent 52%)",
        }}
        aria-hidden
      />

      {/* radius circle */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan/30 bg-cyan/[0.06]"
        style={{ width: `${radiusPct * 2}%`, aspectRatio: "1" }}
        aria-hidden
      />

      {/* route polyline */}
      {destination && (
        <svg className="absolute inset-0 size-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path
            d={`M 50 50 L ${(50 + destination.x) / 2} ${destination.y + 6} L ${destination.x} ${destination.y}`}
            fill="none"
            stroke="var(--cyan)"
            strokeWidth="0.9"
            strokeLinecap="round"
            strokeDasharray="3 2"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      )}

      {/* user location */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <span className="absolute left-1/2 top-1/2 size-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan/40 animate-pulse-ring" />
        <span className="relative grid size-5 place-items-center rounded-full border-2 border-background bg-cyan" />
        <span className="absolute left-1/2 top-6 -translate-x-1/2 whitespace-nowrap rounded-full bg-background/80 px-2 py-0.5 text-[10px] font-semibold text-cyan">
          📍 Tú
        </span>
      </div>

      {/* markers */}
      {clusters.map((cluster) => (
        <div
          key={cluster.key}
          className="absolute"
          style={{ left: `${cluster.x}%`, top: `${cluster.y}%` }}
        >
          {cluster.events.length > 1 ? (
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(3, z + 1))}
              className="absolute -translate-x-1/2 -translate-y-1/2 grid size-11 place-items-center rounded-full border border-cyan/40 bg-cyan/15 text-sm font-bold text-cyan backdrop-blur-md transition-transform hover:scale-110"
              aria-label={`${cluster.events.length} experiencias agrupadas`}
            >
              {cluster.events.length}
            </button>
          ) : (
            <EventMarker
              event={cluster.events[0]!}
              active={selectedId === cluster.events[0]!.id}
              recommended={cluster.events[0]!.match_score === bestScore}
              onClick={() => onSelect?.(cluster.events[0]!)}
            />
          )}
        </div>
      ))}

      {/* controls */}
      <div className="absolute right-3 top-3 flex flex-col gap-2">
        <button
          type="button"
          onClick={() => setZoom((z) => Math.min(3, z + 1))}
          className="glass grid size-9 place-items-center rounded-xl text-foreground"
          aria-label="Acercar"
        >
          <Plus className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => setZoom((z) => Math.max(1, z - 1))}
          className="glass grid size-9 place-items-center rounded-xl text-foreground"
          aria-label="Alejar"
        >
          <Minus className="size-4" />
        </button>
      </div>

      <div className="glass absolute bottom-3 left-3 flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] text-muted-foreground">
        <Navigation className="size-3 text-cyan" />
        {DEMO_CITY.zone} · {DEMO_CITY.name} · radio {radiusKm} km
      </div>
    </div>
  );
}
