import { Zap } from "lucide-react";

import { cn } from "@/lib/utils";
import { accentClasses } from "@/lib/pulse-ui";
import type { PulseUser } from "@/types";

export function UserAvatar({
  user,
  size = "md",
  showRing = false,
  className,
}: {
  user: PulseUser;
  size?: "sm" | "md" | "lg";
  showRing?: boolean;
  className?: string;
}) {
  const accent = accentClasses[user.color];
  const sizes = {
    sm: "size-8 text-[11px]",
    md: "size-11 text-sm",
    lg: "size-16 text-lg",
  };
  return (
    <div
      className={cn(
        "grid place-items-center rounded-full font-semibold tracking-wide",
        accent.soft,
        accent.text,
        "border",
        accent.border,
        showRing && cn("ring-2 ring-offset-2 ring-offset-background", accent.ring),
        sizes[size],
        className,
      )}
      aria-label={user.name}
    >
      {user.initials}
    </div>
  );
}

export function AvatarStack({ users, max = 4 }: { users: PulseUser[]; max?: number }) {
  const shown = users.slice(0, max);
  const rest = users.length - shown.length;
  return (
    <div className="flex items-center">
      {shown.map((u) => (
        <UserAvatar
          key={u.id}
          user={u}
          size="sm"
          className="-ml-2 first:ml-0 border-background/70"
        />
      ))}
      {rest > 0 && (
        <span className="-ml-2 grid size-8 place-items-center rounded-full bg-panel-2 text-[11px] text-muted-foreground">
          +{rest}
        </span>
      )}
    </div>
  );
}

export function PulsePoints({
  value,
  className,
  prefix = "+",
}: {
  value: number;
  className?: string;
  prefix?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-yellow/12 px-2.5 py-1 text-xs font-semibold text-yellow",
        className,
      )}
    >
      <Zap className="size-3.5" />
      {prefix}
      {value}
    </span>
  );
}

export function Chip({
  active,
  children,
  onClick,
  className,
}: {
  active?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-200",
        active
          ? "border-cyan/50 bg-cyan/15 text-cyan"
          : "border-border bg-panel-2/60 text-muted-foreground hover:text-foreground",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  action,
}: {
  eyebrow?: string;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-3 flex items-end justify-between gap-3">
      <div>
        {eyebrow && (
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {eyebrow}
          </p>
        )}
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      {action}
    </div>
  );
}

export function MetaPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-panel-2/70 px-2.5 py-1 text-[11px] text-muted-foreground">
      {children}
    </span>
  );
}

export function ProgressRing({
  value,
  label,
  emoji,
  accent,
}: {
  value: number;
  label: string;
  emoji: string;
  accent: keyof typeof accentClasses;
}) {
  const circumference = 2 * Math.PI * 26;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative grid size-[68px] place-items-center">
        <svg viewBox="0 0 64 64" className="absolute inset-0 -rotate-90">
          <circle cx="32" cy="32" r="26" fill="none" stroke="currentColor" strokeWidth="6" className="text-panel-2" />
          <circle
            cx="32"
            cy="32"
            r="26"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - value / 100)}
            className={accentClasses[accent].text}
          />
        </svg>
        <span className="text-base">{emoji}</span>
      </div>
      <div className="text-center">
        <p className="text-xs font-semibold">{label}</p>
        <p className="text-[11px] text-muted-foreground">{value}%</p>
      </div>
    </div>
  );
}
