import { Clock, MapPin, Sparkles, Users } from "lucide-react";

import { AvatarStack, MetaPill, PulsePoints } from "@/components/pulse/primitives";
import { accentClasses, batteryLabel, categoryAccent, formatDistance } from "@/lib/pulse-ui";
import { cn } from "@/lib/utils";
import { personById, venueById } from "@/mock/data";
import type { PulseEvent } from "@/types";

export function eventFlags(event: PulseEvent) {
  const flags: string[] = [];
  if (event.match_score >= 90) flags.push("✨ Para ti");
  if (event.day === "today" && event.slot === "afternoon") flags.push("🔥 Empieza pronto");
  if (event.max_participants - event.current_participants === 1) flags.push("⚡ Queda 1 cupo");
  if (event.is_pod) flags.push("👥 Tu Pod está aquí");
  return flags;
}

export function EventCard({
  event,
  onSelect,
  compact = false,
}: {
  event: PulseEvent;
  onSelect?: (event: PulseEvent) => void;
  compact?: boolean;
}) {
  const accent = accentClasses[categoryAccent[event.category]];
  const venue = venueById(event.venue_id);
  const flags = eventFlags(event);

  return (
    <button
      type="button"
      onClick={() => onSelect?.(event)}
      className={cn(
        "panel-surface group w-full rounded-3xl p-4 text-left transition-all duration-300 hover:-translate-y-0.5",
        compact ? "min-w-[248px]" : "",
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "grid size-11 shrink-0 place-items-center rounded-2xl border text-lg",
            accent.soft,
            accent.border,
          )}
        >
          {event.emoji}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="truncate text-sm font-semibold">{event.title}</h3>
            <span className={cn("shrink-0 text-[11px] font-semibold", accent.text)}>
              {event.match_score}%
            </span>
          </div>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {event.when_label} · {venue.name}
          </p>

          <div className="mt-2.5 flex flex-wrap gap-1.5">
            <MetaPill>
              <MapPin className="size-3" /> {formatDistance(event.distance_m)}
            </MetaPill>
            <MetaPill>
              <Clock className="size-3" /> {event.duration_min} min
            </MetaPill>
            <MetaPill>
              <Users className="size-3" /> {event.current_participants}/{event.max_participants}
            </MetaPill>
            <MetaPill>{batteryLabel[event.social_battery].icon}</MetaPill>
          </div>

          <div className="mt-3 flex items-center justify-between gap-2">
            <AvatarStack users={event.participant_ids.map(personById)} max={3} />
            <PulsePoints value={event.pulse_points} />
          </div>

          {flags.length > 0 && (
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {flags.map((f) => (
                <span
                  key={f}
                  className="rounded-full border border-border bg-background/50 px-2 py-0.5 text-[10px] text-muted-foreground"
                >
                  {f}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      {!compact && (
        <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {event.description}
        </p>
      )}
      <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-cyan opacity-0 transition-opacity group-hover:opacity-100">
        <Sparkles className="size-3" /> Ver detalle
      </span>
    </button>
  );
}
