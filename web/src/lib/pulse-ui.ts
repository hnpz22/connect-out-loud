import type { EventCategory, SocialBattery } from "@/types";

type Accent = "cyan" | "mint" | "violet" | "pink" | "green" | "yellow";

/** Explicit class strings so Tailwind can statically detect every variant. */
export const accentClasses: Record<
  Accent,
  { text: string; bg: string; soft: string; border: string; ring: string; glow: string }
> = {
  cyan: {
    text: "text-cyan",
    bg: "bg-cyan",
    soft: "bg-cyan/12",
    border: "border-cyan/35",
    ring: "ring-cyan/40",
    glow: "shadow-[0_0_24px_-4px_var(--cyan)]",
  },
  mint: {
    text: "text-mint",
    bg: "bg-mint",
    soft: "bg-mint/12",
    border: "border-mint/35",
    ring: "ring-mint/40",
    glow: "shadow-[0_0_24px_-4px_var(--mint)]",
  },
  violet: {
    text: "text-violet",
    bg: "bg-violet",
    soft: "bg-violet/14",
    border: "border-violet/35",
    ring: "ring-violet/40",
    glow: "shadow-[0_0_24px_-4px_var(--violet)]",
  },
  pink: {
    text: "text-pink",
    bg: "bg-pink",
    soft: "bg-pink/12",
    border: "border-pink/35",
    ring: "ring-pink/40",
    glow: "shadow-[0_0_24px_-4px_var(--pink)]",
  },
  green: {
    text: "text-green",
    bg: "bg-green",
    soft: "bg-green/12",
    border: "border-green/35",
    ring: "ring-green/40",
    glow: "shadow-[0_0_24px_-4px_var(--green)]",
  },
  yellow: {
    text: "text-yellow",
    bg: "bg-yellow",
    soft: "bg-yellow/12",
    border: "border-yellow/35",
    ring: "ring-yellow/40",
    glow: "shadow-[0_0_24px_-4px_var(--yellow)]",
  },
};

export const categoryAccent: Record<EventCategory, Accent> = {
  coffee: "cyan",
  walk: "mint",
  cowork: "violet",
  wellness: "pink",
  outdoor: "green",
  sport: "yellow",
  experience: "pink",
  pod: "cyan",
  lunch: "mint",
  learning: "violet",
};

export const batteryLabel: Record<SocialBattery, { icon: string; label: string; hint: string }> = {
  low: { icon: "🔋", label: "Low", hint: "Compañía sin hablar demasiado." },
  medium: { icon: "🔋🔋", label: "Medium", hint: "Me gustaría conversar un poco." },
  high: { icon: "🔋🔋🔋", label: "High", hint: "Quiero conocer gente." },
  surprise: { icon: "✨", label: "Sorpréndeme", hint: "Que la IA decida." },
};

export function formatDistance(meters: number): string {
  if (meters < 1000) return `${meters} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}
