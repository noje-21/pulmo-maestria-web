import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { imagetools } from "vite-imagetools";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    imagetools({
      defaultDirectives: (url) => {
        // Preset: ?responsive → generates srcset with 3 widths
        if (url.searchParams.has("responsive")) {
          return new URLSearchParams("w=640;1024;1920&format=webp&quality=80&as=srcset");
        }
        // Preset: ?mobile → single 640px webp
        if (url.searchParams.has("mobile")) {
          return new URLSearchParams("w=640&format=webp&quality=75");
        }
        // Auto-convert all jpg/png to webp
        if (/\.(jpe?g|png)$/i.test(url.pathname) && !url.searchParams.has("format")) {
          return new URLSearchParams({ format: "webp", quality: "80" });
        }
        return new URLSearchParams();
      },
    }),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
