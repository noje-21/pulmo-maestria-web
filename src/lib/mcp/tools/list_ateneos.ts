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
  name: "list_ateneos",
  title: "Listar ateneos",
  description: "Devuelve los ateneos académicos disponibles.",
  inputSchema: {
    limit: z.number().int().min(1).max(50).default(10).describe("Máximo de ateneos a devolver."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ limit }) => {
    const { data, error } = await anonClient()
      .from("ateneos")
      .select("id, titulo, descripcion, fecha, categoria")
      .order("fecha", { ascending: false })
      .limit(limit);
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? []) }],
      structuredContent: { items: data ?? [] },
    };
  },
});