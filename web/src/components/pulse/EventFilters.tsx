import { Chip } from "@/components/pulse/primitives";
import { categoryMeta } from "@/mock/data";
import type { EventCategory } from "@/types";

export type CategoryFilter = "all" | EventCategory;
export type TimeFilter = "now" | "today" | "afternoon" | "evening" | "tomorrow" | "weekend" | "all";

const categoryOrder: CategoryFilter[] = [
  "all",
  "coffee",
  "walk",
  "cowork",
  "wellness",
  "outdoor",
  "sport",
  "experience",
  "pod",
];

const timeFilters: { key: TimeFilter; label: string }[] = [
  { key: "all", label: "Todo" },
  { key: "now", label: "Ahora" },
  { key: "today", label: "Hoy" },
  { key: "afternoon", label: "Esta tarde" },
  { key: "evening", label: "Esta noche" },
  { key: "tomorrow", label: "Mañana" },
  { key: "weekend", label: "Weekend" },
];

export const radiusOptions = [1, 3, 5, 10, 30];

export function radiusLabel(km: number) {
  return km >= 30 ? "Toda la ciudad" : `${km} km`;
}

export function EventFilters({
  category,
  onCategory,
  time,
  onTime,
}: {
  category: CategoryFilter;
  onCategory: (c: CategoryFilter) => void;
  time: TimeFilter;
  onTime: (t: TimeFilter) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="hide-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
        {categoryOrder.map((key) => (
          <Chip key={key} active={category === key} onClick={() => onCategory(key)}>
            {key === "all" ? "Todos" : `${categoryMeta[key].emoji} ${categoryMeta[key].label}`}
          </Chip>
        ))}
      </div>
      <div className="hide-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
        {timeFilters.map((t) => (
          <Chip key={t.key} active={time === t.key} onClick={() => onTime(t.key)}>
            {t.label}
          </Chip>
        ))}
      </div>
    </div>
  );
}
