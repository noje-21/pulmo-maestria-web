import { createClient } from "@supabase/supabase-js";
import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import { z } from "zod";

function userClient(ctx: ToolContext) {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export default defineTool({
  name: "create_forum_post",
  title: "Crear publicación en el foro",
  description: "Crea una nueva publicación en el foro académico como el usuario autenticado.",
  inputSchema: {
    title: z.string().trim().min(3).max(200).describe("Título de la publicación."),
    content: z.string().trim().min(10).describe("Contenido de la publicación."),
    category: z.string().trim().min(1).describe("Categoría del foro (por ejemplo: general, casos, investigacion)."),
    excerpt: z.string().trim().max(300).optional().describe("Resumen breve opcional."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async ({ title, content, category, excerpt }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "No autenticado" }], isError: true };
    }
    const { data, error } = await userClient(ctx)
      .from("forum_posts")
      .insert({
        user_id: ctx.getUserId(),
        title,
        content,
        category: category as never,
        excerpt: excerpt ?? null,
        status: "published",
      })
      .select("id, title, category, created_at")
      .single();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: `Publicación creada: ${data.id}` }],
      structuredContent: { post: data },
    };
  },
});