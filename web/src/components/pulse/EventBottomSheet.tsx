import { useState } from "react";
import { Bookmark, Flag, Share2, ShieldCheck, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { RouteViewer } from "@/components/maps/RouteViewer";
import { MetaPill, PulsePoints, UserAvatar } from "@/components/pulse/primitives";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { batteryLabel, formatDistance } from "@/lib/pulse-ui";
import { personById, venueById } from "@/mock/data";
import type { PulseEvent, TransportMode } from "@/types";

export function EventBottomSheet({
  event,
  open,
  onOpenChange,
  onJoin,
}: {
  event: PulseEvent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onJoin: (event: PulseEvent) => void;
}) {
  const [showRoute, setShowRoute] = useState(false);
  const [mode, setMode] = useState<TransportMode>("walk");

  if (!event) return null;
  const venue = venueById(event.venue_id);
  const full = event.current_participants >= event.max_participants;

  return (
    <Drawer
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) setShowRoute(false);
      }}
    >
      <DrawerContent className="max-h-[92vh] border-border bg-panel">
        <div className="hide-scrollbar overflow-y-auto px-4 pb-8">
          <DrawerHeader className="px-0 text-left">
            <DrawerTitle className="text-xl">
              {event.title} {event.emoji}
            </DrawerTitle>
            <DrawerDescription>
              {event.when_label} · 📍 {venue.name}
            </DrawerDescription>
          </DrawerHeader>

          <div className="flex flex-wrap gap-1.5">
            <MetaPill>🚶 {formatDistance(event.distance_m)}</MetaPill>
            <MetaPill>⏱ {event.duration_min} min</MetaPill>
            <MetaPill>
              👥 {event.current_participants} / {event.max_participants} personas
            </MetaPill>
            <MetaPill>
              {batteryLabel[event.social_battery].icon} {batteryLabel[event.social_battery].label}
            </MetaPill>
            <PulsePoints value={event.pulse_points} />
            <MetaPill>
              <Sparkles className="size-3 text-yellow" /> {event.match_score}% para ti
            </MetaPill>
          </div>

          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{event.description}</p>

          <div className="mt-4 flex items-center gap-2">
            {event.participant_ids.map((id) => (
              <UserAvatar key={id} user={personById(id)} size="sm" />
            ))}
            <span className="ml-1 text-xs text-muted-foreground">Grupo pequeño</span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-mint/10 px-2.5 py-1 text-[11px] text-mint">
              <ShieldCheck className="size-3" /> Lugar público
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-mint/10 px-2.5 py-1 text-[11px] text-mint">
              <ShieldCheck className="size-3" /> Perfiles verificados
            </span>
          </div>

          {showRoute && (
            <div className="mt-5">
              <RouteViewer event={event} mode={mode} onModeChange={setMode} />
            </div>
          )}

          <div className="mt-5 flex gap-2">
            <Button
              className="flex-1"
              disabled={full}
              onClick={() => {
                onJoin(event);
                onOpenChange(false);
              }}
            >
              {full ? "Completo" : "Unirme"}
            </Button>
            <Button variant="secondary" className="flex-1" onClick={() => setShowRoute((v) => !v)}>
              {showRoute ? "Ocultar ruta" : "Cómo llegar"}
            </Button>
          </div>

          <div className="mt-3 flex justify-between gap-2 text-muted-foreground">
            <button
              type="button"
              onClick={() => toast.success("Guardado en tus experiencias")}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-panel-2/70 py-2 text-xs"
            >
              <Bookmark className="size-3.5" /> Guardar
            </button>
            <button
              type="button"
              onClick={() => toast.success("Enlace copiado")}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-panel-2/70 py-2 text-xs"
            >
              <Share2 className="size-3.5" /> Compartir
            </button>
            <button
              type="button"
              onClick={() => toast("Reporte enviado al equipo de Trust & Safety")}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-panel-2/70 py-2 text-xs"
            >
              <Flag className="size-3.5" /> Reportar
            </button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
