export type Flow = "none" | "spotting" | "light" | "medium" | "heavy";
export type Mood = "not_recorded" | "good" | "neutral" | "low" | "anxious";
export type PeriodEntry = {
  date: string;
  /** User-confirmed first day of a new period; undefined for legacy records. */
  periodStart?: boolean;
  flow: Flow;
  pain: number;
  mood: Mood;
  symptoms: string[];
  notes: string;
  updatedAt: string;
};
