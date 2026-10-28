export type Flow = "none" | "spotting" | "light" | "medium" | "heavy";
export type Mood = "not_recorded" | "good" | "neutral" | "low" | "anxious";
export type PeriodEntry = {
  date: string;
  flow: Flow;
  pain: number;
  mood: Mood;
  symptoms: string[];
  notes: string;
  updatedAt: string;
};
