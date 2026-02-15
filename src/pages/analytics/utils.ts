import { format } from "date-fns";

export const ANALYTICS_TIME_RANGES: Record<string, string> = {
  "7d": "7 Tage",
  "30d": "30 Tage",
  "90d": "90 Tage",
  custom: "Benutzerdefiniert",
};

export interface AnalyticsDateRange {
  from: Date | undefined;
  to?: Date | undefined;
}

export interface AnalyticsDateParams {
  startDate: string;
  endDate: string;
  period?: string;
}

export function buildDateParams(
  timeRange: string,
  dateRange: AnalyticsDateRange,
): AnalyticsDateParams {
  if (dateRange.from && dateRange.to) {
    return {
      startDate: format(dateRange.from, "yyyy-MM-dd"),
      endDate: format(dateRange.to, "yyyy-MM-dd"),
    };
  }

  const end = new Date();
  const start = new Date();
  if (timeRange === "7d") {
    start.setDate(start.getDate() - 7);
  } else if (timeRange === "90d") {
    start.setDate(start.getDate() - 90);
  } else {
    start.setDate(start.getDate() - 30);
  }

  return {
    startDate: format(start, "yyyy-MM-dd"),
    endDate: format(end, "yyyy-MM-dd"),
    period: timeRange === "7d" ? "7d" : timeRange === "90d" ? "90d" : "30d",
  };
}

export function formatCompact(n: number): string {
  if (!Number.isFinite(n)) return "0";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(Math.round(n));
}

export function formatPercent(value: number, digits = 2): string {
  if (!Number.isFinite(value)) return "0%";
  return `${value.toFixed(digits)}%`;
}

export function formatCurrency(value: number): string {
  if (!Number.isFinite(value)) return "0,00 €";
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatDurationFromSeconds(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return "00:00";
  const total = Math.floor(seconds);
  const minutes = Math.floor(total / 60);
  const remaining = total % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remaining).padStart(2, "0")}`;
}

export function formatDateTime(value: string | null | undefined): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("de-DE");
}
