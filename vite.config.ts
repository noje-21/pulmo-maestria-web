import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { visualizer } from "rollup-plugin-visualizer";
import { mcpPlugin } from "@lovable.dev/mcp-js/stacks/supabase/vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mcpPlugin(),
    mode === "development" && componentTagger(),
    mode !== "development" &&
      visualizer({
        filename: "dist/bundle-report.html",
        gzipSize: true,
        brotliSize: true,
        template: "treemap",
      }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "es2020",
    cssCodeSplit: true,
    chunkSizeWarningLimit: 800,
    // Vite's default modulepreload eagerly preloads transitive deps of every
    // dynamic import found in the entry chunk — that's how `supabase-*.js`
    // and `recharts-*.js` end up requested on the landing page even though
    // they're only used in lazy routes. Resolving to [] makes the browser
    // fetch them only when the actual dynamic import runs.
    modulePreload: { polyfill: true, resolveDependencies: () => [] },
    rollupOptions: {
      output: {
        // Only split chunks that are actually used on the landing page (Index).
        // Vite emits <link rel="modulepreload"> for every entry in manualChunks,
        // so listing admin-only deps (recharts, tiptap) or lazy-only deps
        // (supabase) here would force mobile users to download them up front.
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "framer-motion": ["framer-motion"],
        },
      },
    },
  },
}));
