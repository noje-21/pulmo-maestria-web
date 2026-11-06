import { describe, it, expect } from "vitest";
import { shouldShowAnnouncement } from "./frequency";

const DAY = 86_400_000;
const now = 10 * DAY;

describe("shouldShowAnnouncement", () => {
  it("once: no se repite tras verse", () => {
    expect(shouldShowAnnouncement("once", null, false, now)).toBe(true);
    expect(shouldShowAnnouncement("once", now - 30 * DAY, false, now)).toBe(false);
  });
  it("daily: vuelve después de 24 h, no antes", () => {
    expect(shouldShowAnnouncement("daily", now - DAY + 1000, false, now)).toBe(false);
    expect(shouldShowAnnouncement("daily", now - DAY, false, now)).toBe(true);
  });
  it("daily: no reaparece dentro de la misma sesión", () => {
    expect(shouldShowAnnouncement("daily", null, true, now)).toBe(false);
  });
  it("weekly: vuelve a los 7 días", () => {
    expect(shouldShowAnnouncement("weekly", now - 6 * DAY, false, now)).toBe(false);
    expect(shouldShowAnnouncement("weekly", now - 7 * DAY, false, now)).toBe(true);
  });
  it("session: una vez por sesión", () => {
    expect(shouldShowAnnouncement("session", now, false, now)).toBe(true);
    expect(shouldShowAnnouncement("session", now, true, now)).toBe(false);
  });
});
