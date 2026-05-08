export const TZ = "America/Bogota";

export function formatTime(date: string | Date): string {
  return new Date(date).toLocaleTimeString("es", {
    hour: "2-digit", minute: "2-digit", timeZone: TZ,
  });
}

export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleString("es", {
    weekday: "short", day: "numeric", month: "short",
    hour: "2-digit", minute: "2-digit", timeZone: TZ,
  });
}

export function getCloseText(scheduledAt: string | Date, now: number): string {
  const diff = new Date(scheduledAt).getTime() - now;
  if (diff <= 0) return "Ya cierra";
  const totalMinutes = Math.floor(diff / 60000);
  if (totalMinutes <= 1) return "Ya cierra";
  if (totalMinutes < 60) return `En ${totalMinutes} min`;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours <= 6) return minutes > 0 ? `En ${hours} h ${minutes} min` : `En ${hours} h`;
  return `Empieza ${formatTime(scheduledAt)}`;
}

export function formatTabLabel(key: string): string {
  const [year, month, day] = key.split("-").map(Number);
  const d = new Date(year, month - 1, day);
  const wd = d.toLocaleDateString("es", { weekday: "short" });
  return `${wd.charAt(0).toUpperCase()}${wd.slice(1, 3)} ${day}`;
}

export function formatDayHeader(key: string): string {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("es", {
    weekday: "long", day: "numeric", month: "long",
  });
}

export function getDayKey(date: Date | string): string {
  const fmt = new Intl.DateTimeFormat("en", {
    timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit",
  });
  const parts = fmt.formatToParts(new Date(date));
  const y = parts.find((p) => p.type === "year")!.value;
  const m = parts.find((p) => p.type === "month")!.value;
  const d = parts.find((p) => p.type === "day")!.value;
  return `${y}-${m}-${d}`;
}
