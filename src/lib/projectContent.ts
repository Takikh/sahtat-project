import type { Json } from "@/integrations/supabase/types";

export interface ProjectTimelineItem {
  date: string;
  status?: string;
  progress?: number;
  title_en?: string;
  title_fr?: string;
  title_ar?: string;
}

export function toStringArray(value: Json | null | undefined): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((entry): entry is string => typeof entry === "string" && entry.trim().length > 0);
}

export function toTimeline(value: Json | null | undefined): ProjectTimelineItem[] {
  if (!Array.isArray(value)) return [];

  return value
    .filter((entry): entry is Record<string, unknown> => typeof entry === "object" && entry !== null && !Array.isArray(entry))
    .map((entry) => ({
      date: typeof entry.date === "string" ? entry.date : "",
      status: typeof entry.status === "string" ? entry.status : undefined,
      progress: typeof entry.progress === "number" ? entry.progress : undefined,
      title_en: typeof entry.title_en === "string" ? entry.title_en : undefined,
      title_fr: typeof entry.title_fr === "string" ? entry.title_fr : undefined,
      title_ar: typeof entry.title_ar === "string" ? entry.title_ar : undefined,
    }))
    .filter((entry) => entry.date && (entry.title_en || entry.title_fr || entry.title_ar))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function pickLocalized(lang: "en" | "fr" | "ar", en?: string | null, fr?: string | null, ar?: string | null): string {
  if (lang === "fr") return fr || en || "";
  if (lang === "ar") return ar || en || "";
  return en || "";
}

export function formatPriceRange(min: number | null, max: number | null, locale: string) {
  if (min === null && max === null) return "";

  const fmt = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0,
  });

  if (min !== null && max !== null) {
    return `${fmt.format(min)} - ${fmt.format(max)} DZD`;
  }
  if (min !== null) return `${fmt.format(min)}+ DZD`;
  return `${fmt.format(max || 0)} DZD`;
}

export function formatAreaRange(min: number | null, max: number | null, locale: string) {
  if (min === null && max === null) return "";

  const fmt = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0,
  });

  if (min !== null && max !== null) {
    return `${fmt.format(min)} - ${fmt.format(max)} m2`;
  }
  if (min !== null) return `${fmt.format(min)}+ m2`;
  return `${fmt.format(max || 0)} m2`;
}
