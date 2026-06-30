export function formatCount(value: number, options?: { precision?: number; suffix?: string }): string {
  const precision = options?.precision ?? 1;
  const suffix = options?.suffix ?? "";
  if (value >= 1000000) {
    return (value / 1000000).toFixed(precision) + "M" + suffix;
  }
  if (value >= 1000) {
    return (value / 1000).toFixed(precision) + "K" + suffix;
  }
  return value.toString() + suffix;
}

export function formatEngagementRate(rate: number | undefined): string {
  if (rate === undefined) return "N/A";
  return (rate * 100).toFixed(2) + "%";
}
