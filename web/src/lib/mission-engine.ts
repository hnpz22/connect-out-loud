import { mockEvents } from "@/mock/data";
import type { NeedKey, PulseEvent, SocialBattery, TimeSlot } from "@/types";

export interface MissionInput {
  need: NeedKey;
  battery: SocialBattery;
  time: TimeSlot;
  radiusKm: number;
}

export interface Mission {
  event: PulseEvent;
  title: string;
  emoji: string;
  pitch: string;
  reason: string;
  matchScore: number;
  groupSize: number;
}

const needCategories: Record<NeedKey, PulseEvent["category"][]> = {
  people: ["coffee", "lunch", "experience", "pod"],
  move: ["walk", "sport", "outdoor"],
  recharge: ["outdoor", "wellness", "walk"],
  company: ["cowork", "learning", "coffee"],
};

const missionNames: Record<string, { title: string; emoji: string }> = {
  "people:low": { title: "Silent Cowork", emoji: "💻" },
  "people:medium": { title: "Coffee Connection", emoji: "☕" },
  "people:high": { title: "Remote Social Sprint", emoji: "⚡" },
  "move:low": { title: "Park Reset", emoji: "🌿" },
  "move:medium": { title: "Walk & Talk", emoji: "🚶" },
  "move:high": { title: "Move Crew", emoji: "🏃" },
  "recharge:low": { title: "Park Reset", emoji: "🌿" },
  "recharge:medium": { title: "Walk & Talk", emoji: "🚶" },
  "recharge:high": { title: "Move Crew", emoji: "🏃" },
  "company:low": { title: "Silent Cowork", emoji: "💻" },
  "company:medium": { title: "Cowork Sprint", emoji: "💻" },
  "company:high": { title: "Remote Social Sprint", emoji: "⚡" },
};

const maxMinutes: Record<TimeSlot, number> = {
  "15": 20,
  "30": 45,
  "60": 75,
  afternoon: 130,
  evening: 130,
};

const reasons: Record<Exclude<SocialBattery, "surprise">, string> = {
  low: "Tu Social Battery está baja. Buscamos una experiencia con presencia humana pero sin exigencia de conversación.",
  medium:
    "Tu Social Battery está en nivel medio. Encontramos una experiencia suficientemente social para conectar, pero en un grupo pequeño.",
  high: "Tu Social Battery está alta. Priorizamos un grupo más amplio y conversación activa.",
};

/** Simulated scoring — replaced by the AI service later. */
export function scoreEvent(event: PulseEvent, input: MissionInput): number {
  let score = 0;
  const radiusM = input.radiusKm * 1000;
  score += event.distance_m <= radiusM ? 30 - Math.min(28, (event.distance_m / radiusM) * 12) : 4;
  score += needCategories[input.need].includes(event.category) ? 25 : 8;
  score += event.duration_min <= maxMinutes[input.time] ? 20 : 6;
  const battery = input.battery === "surprise" ? event.social_battery : input.battery;
  score += event.social_battery === battery ? 15 : 6;
  score += event.is_pod ? 10 : event.current_participants < event.max_participants ? 7 : 2;
  return Math.round(Math.min(99, score + 8));
}

export function generateMission(input: MissionInput, blocked: string[] = []): Mission {
  const battery: Exclude<SocialBattery, "surprise"> =
    input.battery === "surprise" ? "medium" : input.battery;

  const ranked = mockEvents
    .filter((e) => e.status === "open" && !e.is_pod)
    .filter((e) => !e.participant_ids.some((p) => blocked.includes(p)))
    .map((event) => ({ event, score: scoreEvent(event, input) }))
    .sort((a, b) => b.score - a.score);

  const best = ranked[0]!;
  const named = missionNames[`${input.need}:${battery}`] ?? {
    title: best.event.title,
    emoji: best.event.emoji,
  };

  return {
    event: best.event,
    title: named.title,
    emoji: named.emoji,
    pitch: best.event.description,
    reason: reasons[battery],
    matchScore: Math.max(best.score, best.event.match_score),
    groupSize: Math.min(best.event.max_participants, best.event.current_participants + 1),
  };
}

export function rankEventsFor(input: MissionInput): PulseEvent[] {
  return [...mockEvents]
    .filter((e) => !e.is_pod)
    .sort((a, b) => scoreEvent(b, input) - scoreEvent(a, input));
}

export const transportEstimates = {
  walk: { icon: "🚶", label: "Caminando", speed: 4.6 },
  bike: { icon: "🚲", label: "Bicicleta", speed: 14 },
  car: { icon: "🚗", label: "Vehículo", speed: 18 },
  transit: { icon: "🚌", label: "Transporte público", speed: 12 },
} as const;

export function estimateTrip(mode: keyof typeof transportEstimates, distanceM: number) {
  const factor = mode === "car" ? 1.35 : mode === "transit" ? 1.25 : 1;
  const distance = Math.round(distanceM * factor);
  const minutes = Math.max(2, Math.round((distance / 1000 / transportEstimates[mode].speed) * 60));
  return { minutes, distance };
}
