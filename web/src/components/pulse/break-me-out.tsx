import { Coffee, Footprints, Leaf, Laptop } from "lucide-react";

import { cn } from "@/lib/utils";
import { batteryLabel } from "@/lib/pulse-ui";
import type { NeedKey, SocialBattery, TimeSlot } from "@/types";

const needs: {
  key: NeedKey;
  emoji: string;
  Icon: typeof Coffee;
  title: string;
  line: string;
  accent: string;
}[] = [
  {
    key: "people",
    emoji: "🤝",
    Icon: Coffee,
    title: "Ver personas",
    line: "Quiero conversar.",
    accent: "from-cyan/25 to-cyan/5 text-cyan",
  },
  {
    key: "move",
    emoji: "🚶",
    Icon: Footprints,
    title: "Moverme",
    line: "Necesito salir de la silla.",
    accent: "from-mint/25 to-mint/5 text-mint",
  },
  {
    key: "recharge",
    emoji: "🌿",
    Icon: Leaf,
    title: "Recargar",
    line: "Necesito cambiar de aire.",
    accent: "from-green/25 to-green/5 text-green",
  },
  {
    key: "company",
    emoji: "💻",
    Icon: Laptop,
    title: "Compañía",
    line: "Quiero trabajar cerca de alguien.",
    accent: "from-violet/25 to-violet/5 text-violet",
  },
];

export function NeedSelector({
  value,
  onChange,
}: {
  value: NeedKey | null;
  onChange: (n: NeedKey) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {needs.map((need) => {
        const active = value === need.key;
        return (
          <button
            key={need.key}
            type="button"
            onClick={() => onChange(need.key)}
            className={cn(
              "group relative overflow-hidden rounded-3xl border p-4 text-left transition-all duration-300",
              active
                ? "border-cyan/50 bg-panel-2 shadow-glow-cyan"
                : "border-border bg-panel/70 hover:-translate-y-0.5 hover:border-cyan/25",
            )}
          >
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-br opacity-70 transition-opacity duration-300",
                need.accent,
                active ? "opacity-100" : "group-hover:opacity-90",
              )}
              aria-hidden
            />
            <div className="relative">
              <span className="text-xl">{need.emoji}</span>
              <p className="mt-2 text-sm font-semibold text-foreground">{need.title}</p>
              <p className="text-xs text-muted-foreground">{need.line}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

const batteries: SocialBattery[] = ["low", "medium", "high", "surprise"];

export function SocialBatteryPicker({
  value,
  onChange,
}: {
  value: SocialBattery | null;
  onChange: (b: SocialBattery) => void;
}) {
  return (
    <div className="space-y-2">
      {batteries.map((b) => {
        const meta = batteryLabel[b];
        const active = value === b;
        return (
          <button
            key={b}
            type="button"
            onClick={() => onChange(b)}
            className={cn(
              "flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all duration-200",
              active
                ? "border-mint/50 bg-mint/10"
                : "border-border bg-panel/60 hover:border-mint/25",
            )}
          >
            <span className="w-16 text-sm">{meta.icon}</span>
            <span className="flex-1">
              <span className="block text-sm font-semibold">{meta.label}</span>
              <span className="block text-xs text-muted-foreground">{meta.hint}</span>
            </span>
            <span
              className={cn(
                "size-2.5 rounded-full transition-colors",
                active ? "bg-mint" : "bg-panel-2",
              )}
            />
          </button>
        );
      })}
    </div>
  );
}

const times: { key: TimeSlot; label: string }[] = [
  { key: "15", label: "15 min" },
  { key: "30", label: "30 min" },
  { key: "60", label: "60 min" },
  { key: "afternoon", label: "Esta tarde" },
  { key: "evening", label: "Esta noche" },
];

export function TimeSelector({
  value,
  onChange,
}: {
  value: TimeSlot | null;
  onChange: (t: TimeSlot) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {times.map((t) => (
        <button
          key={t.key}
          type="button"
          onClick={() => onChange(t.key)}
          className={cn(
            "rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200",
            value === t.key
              ? "border-violet/50 bg-violet/15 text-foreground"
              : "border-border bg-panel/60 text-muted-foreground hover:text-foreground",
          )}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
