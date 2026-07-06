import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listNovedadesTool from "./tools/list_novedades";
import listAteneosTool from "./tools/list_ateneos";
import getMyProfileTool from "./tools/get_my_profile";
import createForumPostTool from "./tools/create_forum_post";

// The OAuth issuer MUST be the direct Supabase host (see app-mcp-server-authoring).
// Read from Vite-inlined project ref so the entry stays import-safe at build time.
const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "maestria-cp-mcp",
  title: "Maestría CP – Agent Tools",
  version: "0.1.0",
  instructions:
    "Herramientas de la Maestría en Circulación Pulmonar. Usa list_novedades y list_ateneos para consultar contenido público. Con el usuario autenticado, get_my_profile devuelve su perfil y create_forum_post publica en el foro.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listNovedadesTool, listAteneosTool, getMyProfileTool, createForumPostTool],
});