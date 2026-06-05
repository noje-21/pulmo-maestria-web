/**
 * Centralized logger.
 *
 * - `debug` / `info` se silencian automáticamente en producción.
 * - `warn` / `error` siempre llegan a la consola para Sentry y similares.
 * - Activable manualmente en producción con `localStorage.setItem('debug', '1')`.
 */
const isDev = import.meta.env.DEV;

function debugEnabled(): boolean {
  if (isDev) return true;
  try {
    return typeof window !== "undefined" && window.localStorage?.getItem("debug") === "1";
  } catch {
    return false;
  }
}

type Args = unknown[];

export const logger = {
  debug: (...args: Args) => {
    if (debugEnabled()) console.debug("[debug]", ...args);
  },
  info: (...args: Args) => {
    if (debugEnabled()) console.info("[info]", ...args);
  },
  warn: (...args: Args) => {
    console.warn("[warn]", ...args);
  },
  error: (...args: Args) => {
    console.error("[error]", ...args);
  },
};

export default logger;