export type SocialBattery = "low" | "medium" | "high" | "surprise";

export type NeedKey = "people" | "move" | "recharge" | "company";

export type TimeSlot = "15" | "30" | "60" | "afternoon" | "evening";

export type EventCategory =
  | "coffee"
  | "walk"
  | "cowork"
  | "wellness"
  | "outdoor"
  | "sport"
  | "experience"
  | "pod"
  | "lunch"
  | "learning";

export type ParticipantStatus =
  | "registered"
  | "confirmed"
  | "on_the_way"
  | "checked_in"
  | "completed"
  | "cancelled";

export interface Venue {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  google_place_id: string | null;
  type: string;
  verified: boolean;
  photo_url: string | null;
}

export interface PulseUser {
  id: string;
  name: string;
  role: string;
  initials: string;
  color: "cyan" | "mint" | "violet" | "pink" | "yellow";
  verified: boolean;
}

export interface PulseEvent {
  id: string;
  title: string;
  emoji: string;
  description: string;
  category: EventCategory;
  latitude: number;
  longitude: number;
  venue_id: string;
  start_time: string;
  end_time: string;
  duration_min: number;
  max_participants: number;
  current_participants: number;
  pulse_points: number;
  social_battery: Exclude<SocialBattery, "surprise">;
  status: "open" | "full" | "cancelled";
  creator_id: string;
  visibility: "public" | "pod";
  distance_m: number;
  match_score: number;
  when_label: string;
  day: "today" | "tomorrow" | "weekend";
  slot: "morning" | "lunch" | "afternoon" | "evening";
  participant_ids: string[];
  is_pod: boolean;
}

export interface Reward {
  id: string;
  title: string;
  emoji: string;
  partner: string;
  cost: number;
  tag: string;
}

export interface PulseNotification {
  id: string;
  title: string;
  body: string;
  emoji: string;
  time: string;
  read: boolean;
}

export type TransportMode = "walk" | "bike" | "car" | "transit";
