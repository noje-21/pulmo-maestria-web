import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { logger } from "../logger";

describe("logger", () => {
  const debugSpy = vi.spyOn(console, "debug").mockImplementation(() => {});
  const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
  const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

  beforeEach(() => {
    debugSpy.mockClear();
    warnSpy.mockClear();
    errorSpy.mockClear();
  });

  afterEach(() => {
    debugSpy.mockClear();
  });

  it("warn always reaches the console", () => {
    logger.warn("hello");
    expect(warnSpy).toHaveBeenCalledWith("[warn]", "hello");
  });

  it("error always reaches the console", () => {
    logger.error("boom", { code: 1 });
    expect(errorSpy).toHaveBeenCalledWith("[error]", "boom", { code: 1 });
  });

  it("debug runs in dev mode", () => {
    logger.debug("x");
    // In Vitest, import.meta.env.DEV is true.
    expect(debugSpy).toHaveBeenCalled();
  });
});