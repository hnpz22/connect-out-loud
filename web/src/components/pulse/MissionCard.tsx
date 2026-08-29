import { Clock, MapPin, Sparkles, Users, Zap } from "lucide-react";

import { MetaPill } from "@/components/pulse/primitives";
import { Button } from "@/components/ui/button";
import type { Mission } from "@/lib/mission-engine";
import { formatDistance } from "@/lib/pulse-ui";
import { venueById } from "@/mock/data";

export function MissionCard({
  mission,
  onAccept,
  onOpenMap,
}: {
  mission: Mission;
  onAccept: () => void;
  onOpenMap: () => void;
}) {
  const venue = venueById(mission.event.venue_id);
  return (
    <div className="animate-rise relative overflow-hidden rounded-4xl border border-cyan/25 bg-panel p-5 shadow-glow-cyan">
      <div
        className="absolute -right-16 -top-16 size-52 rounded-full bg-cyan/15 blur-3xl"
        aria-hidden
      />
      <div className="relative">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan">
          Misión recomendada
        </p>
        <h3 className="mt-1.5 text-2xl font-semibold">
          {mission.emoji} {mission.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{mission.pitch}</p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          <MetaPill>
            <Clock className="size-3" /> {mission.event.duration_min} min
          </MetaPill>
          <MetaPill>
            <Users className="size-3" /> {mission.groupSize} personas
          </MetaPill>
          <MetaPill>
            <MapPin className="size-3" /> {formatDistance(mission.event.distance_m)}
          </MetaPill>
          <MetaPill>
            <Zap className="size-3 text-yellow" /> +{mission.event.pulse_points} Pulse Points
          </MetaPill>
          <MetaPill>
            <Sparkles className="size-3 text-yellow" /> {mission.matchScore}% para ti
          </MetaPill>
        </div>

        <div className="mt-4 rounded-3xl border border-border bg-background/40 p-4">
          <p className="text-xs font-semibold text-foreground">¿Por qué esta misión?</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{mission.reason}</p>
          <p className="mt-2 text-[11px] text-muted-foreground">
            📍 {venue.name} · {venue.address}
          </p>
        </div>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <Button className="flex-1" onClick={onAccept}>
            Aceptar misión
          </Button>
          <Button variant="secondary" className="flex-1" onClick={onOpenMap}>
            Ver en Pulse Map
          </Button>
        </div>
      </div>
    </div>
  );
}
