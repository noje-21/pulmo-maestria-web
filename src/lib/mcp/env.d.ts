// MCP tool files are bundled into a Deno edge function at build time.
// Declare `process.env` for type-checking; Deno polyfills it at runtime.
declare global {
  const process: { env: Record<string, string | undefined> };
}
export {};