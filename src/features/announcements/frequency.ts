export type AnnouncementFrequency = "once" | "session" | "daily" | "weekly" | "always";

export const FREQUENCY_LABELS: Record<AnnouncementFrequency, string> = {
  once: "Una sola vez por visitante",
  session: "Una vez por sesión (al abrir el sitio)",
  daily: "Una vez al día",
  weekly: "Una vez por semana",
  always: "En cada visita a la página principal",
};

const DAY = 24 * 60 * 60 * 1000;

/** Decide si un anuncio debe mostrarse según la última vez que se vio. */
export function shouldShowAnnouncement(
  frequency: AnnouncementFrequency,
  lastSeenAt: number | null,
  seenThisSession: boolean,
  now: number = Date.now(),
): boolean {
  switch (frequency) {
    case "always":
      return true;
    case "session":
      return !seenThisSession;
    case "once":
      return lastSeenAt === null;
    case "daily":
      return !seenThisSession && (lastSeenAt === null || now - lastSeenAt >= DAY);
    case "weekly":
      return !seenThisSession && (lastSeenAt === null || now - lastSeenAt >= 7 * DAY);
    default:
      return false;
  }
}

const key = (id: string) => `mlcp-announcement-${id}`;

export function readSeen(id: string): { lastSeenAt: number | null; seenThisSession: boolean } {
  try {
    const v = localStorage.getItem(key(id));
    return { lastSeenAt: v ? Number(v) : null, seenThisSession: sessionStorage.getItem(key(id)) === "1" };
  } catch {
    return { lastSeenAt: null, seenThisSession: false };
  }
}

export function markSeen(id: string) {
  try {
    localStorage.setItem(key(id), String(Date.now()));
    sessionStorage.setItem(key(id), "1");
  } catch {
    /* almacenamiento bloqueado: se ignora */
  }
}
