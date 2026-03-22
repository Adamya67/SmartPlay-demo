import { format, formatDistanceToNow, isToday, isTomorrow } from "date-fns";

export function formatCompactNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatPercent(value: number) {
  return `${Math.round(value)}%`;
}

export function formatShortDate(value: string | Date) {
  return format(new Date(value), "MMM d");
}

export function formatLongDate(value: string | Date) {
  return format(new Date(value), "MMM d, yyyy");
}

export function formatRelativeDate(value: string | Date) {
  const parsed = new Date(value);

  if (isToday(parsed)) {
    return `Today · ${format(parsed, "p")}`;
  }

  if (isTomorrow(parsed)) {
    return `Tomorrow · ${format(parsed, "p")}`;
  }

  return formatDistanceToNow(parsed, { addSuffix: true });
}
