import { ExternalLink } from "lucide-react";

import { PulseMap } from "@/components/maps/PulseMap";
import { Button } from "@/components/ui/button";
import { estimateTrip, transportEstimates } from "@/lib/mission-engine";
import { formatDistance } from "@/lib/pulse-ui";
import { cn } from "@/lib/utils";
import { venueById } from "@/mock/data";
import type { PulseEvent, TransportMode } from "@/types";

const modes: TransportMode[] = ["walk", "bike", "car", "transit"];

export function TransportSelector({
  event,
  value,
  onChange,
}: {
  event: PulseEvent;
  value: TransportMode;
  onChange: (m: TransportMode) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {modes.map((mode) => {
        const trip = estimateTrip(mode, event.distance_m);
        const active = value === mode;
        return (
          <button
            key={mode}
            type="button"
            onClick={() => onChange(mode)}
            className={cn(
              "rounded-2xl border px-3 py-2.5 text-left transition-all duration-200",
              active ? "border-cyan/50 bg-cyan/10" : "border-border bg-panel/60 hover:border-cyan/25",
            )}
          >
            <span className="text-base">{transportEstimates[mode].icon}</span>
            <p className="mt-1 text-xs font-semibold">
              {trip.minutes} min
            </p>
            <p className="text-[11px] text-muted-foreground">{formatDistance(trip.distance)}</p>
          </button>
        );
      })}
    </div>
  );
}

export function RouteViewer({
  event,
  mode,
  onModeChange,
}: {
  event: PulseEvent;
  mode: TransportMode;
  onModeChange: (m: TransportMode) => void;
}) {
  const venue = venueById(event.venue_id);
  const trip = estimateTrip(mode, event.distance_m);
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${event.latitude},${event.longitude}&travelmode=${
    mode === "walk" ? "walking" : mode === "bike" ? "bicycling" : mode === "transit" ? "transit" : "driving"
  }`;

  return (
    <div className="space-y-3">
      <div className="panel-surface rounded-3xl p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Modo guía
        </p>
        <h3 className="mt-1 text-base font-semibold">
          Vamos a {event.title} {event.emoji}
        </h3>
        <p className="text-xs text-muted-foreground">
          Destino: {venue.name} · Inicio {event.start_time}
        </p>
      </div>

      <PulseMap events={[event]} radiusKm={1} routeTo={event} className="h-56" selectedId={event.id} />

      <TransportSelector event={event} value={mode} onChange={onModeChange} />

      <div className="panel-surface flex flex-wrap items-center justify-between gap-3 rounded-3xl p-4">
        <div>
          <p className="text-sm font-semibold">
            {formatDistance(trip.distance)} restantes · {trip.minutes} min
          </p>
          <p className="text-xs text-mint">Llegarás 8 minutos antes.</p>
        </div>
        <Button asChild variant="outline" size="sm">
          <a href={mapsUrl} target="_blank" rel="noreferrer">
            Abrir en Google Maps <ExternalLink className="ml-1 size-3.5" />
          </a>
        </Button>
      </div>
    </div>
  );
}
