import { createClient } from "@supabase/supabase-js";
import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

const env = (globalThis as typeof globalThis & { process?: { env?: Record<string, string | undefined> } }).process?.env ?? {};

function anonClient() {
  return createClient(env.SUPABASE_URL!, env.SUPABASE_PUBLISHABLE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export default defineTool({
  name: "list_novedades",
  title: "Listar novedades publicadas",
  description: "Devuelve las últimas novedades publicadas de la Maestría en Circulación Pulmonar.",
  inputSchema: {
    limit: z.number().int().min(1).max(50).default(10).describe("Máximo de novedades a devolver."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ limit }) => {
    const { data, error } = await anonClient()
      .from("novedades")
      .select("id, title, slug, excerpt, published_at")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(limit);
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? []) }],
      structuredContent: { items: data ?? [] },
    };
  },
});