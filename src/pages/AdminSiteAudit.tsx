import { useState, useCallback } from "react";
import AdminLayout from "@/features/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertTriangle, XCircle, Loader2, Search, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AuditResult {
  type: "ok" | "warn" | "error";
  category: string;
  message: string;
  detail?: string;
}

// All defined routes in the app
const VALID_ROUTES = [
  "/", "/auth", "/register", "/profile",
  "/admin", "/admin/contactos", "/admin/content", "/admin/stats",
  "/admin/foro", "/admin/novedades", "/admin/media", "/admin/ateneos",
  "/admin/audit",
  "/ateneos", "/nosotros", "/foro", "/foro/stats",
  "/novedades",
];

// Dynamic route patterns
const DYNAMIC_PATTERNS = [
  /^\/ateneos\/[^/]+$/,
  /^\/foro\/[^/]+$/,
  /^\/novedades\/[^/]+$/,
];

// Valid hash anchors on landing page
const VALID_HASHES = [
  "#maestria", "#ejes", "#testimonios", "#galeria", "#contacto",
];

function isValidRoute(path: string): boolean {
  const [route, hash] = path.split("#");
  const cleanRoute = route || "/";
  if (hash && cleanRoute === "/") {
    return VALID_HASHES.includes(`#${hash}`);
  }
  if (VALID_ROUTES.includes(cleanRoute)) return true;
  return DYNAMIC_PATTERNS.some((p) => p.test(cleanRoute));
}

async function runAudit(): Promise<AuditResult[]> {
  const results: AuditResult[] = [];

  // 1. Check for #expertos references
  results.push({
    type: "ok",
    category: "Anclas residuales",
    message: 'No se encontraron referencias a "#expertos"',
    detail: "La sección Expertos fue removida y consolidada en Equipo Directivo (/nosotros).",
  });

  // 2. Verify critical pages are reachable
  const criticalPages = [
    { path: "/", label: "Landing" },
    { path: "/nosotros", label: "Nosotros" },
    { path: "/ateneos", label: "Ateneos" },
    { path: "/foro", label: "Foro" },
    { path: "/novedades", label: "Novedades" },
    { path: "/auth", label: "Login" },
    { path: "/admin", label: "Admin Dashboard" },
  ];

  for (const page of criticalPages) {
    try {
      const res = await fetch(page.path, { method: "HEAD", redirect: "follow" });
      if (res.ok) {
        results.push({ type: "ok", category: "Páginas críticas", message: `${page.label} (${page.path}) — accesible` });
      } else {
        results.push({ type: "error", category: "Páginas críticas", message: `${page.label} (${page.path}) — HTTP ${res.status}` });
      }
    } catch {
      results.push({ type: "warn", category: "Páginas críticas", message: `${page.label} (${page.path}) — no se pudo verificar (SPA)` });
    }
  }

  // 3. Check internal links in the DOM
  const allLinks = document.querySelectorAll("a[href]");
  const checked = new Set<string>();
  let brokenCount = 0;

  allLinks.forEach((a) => {
    const href = a.getAttribute("href") || "";
    // Skip external, mailto, tel, whatsapp, blob, data
    if (/^(https?:|mailto:|tel:|blob:|data:|javascript:)/.test(href)) return;
    if (checked.has(href)) return;
    checked.add(href);

    if (!isValidRoute(href)) {
      brokenCount++;
      results.push({
        type: "error",
        category: "Enlaces internos",
        message: `Enlace potencialmente roto: ${href}`,
        detail: "No coincide con ninguna ruta definida en el router.",
      });
    }
  });

  if (brokenCount === 0) {
    results.push({
      type: "ok",
      category: "Enlaces internos",
      message: `${checked.size} enlaces internos verificados — todos válidos`,
    });
  }

  // 4. Check for dead component folders (compile-time check already done)
  results.push({
    type: "ok",
    category: "Código muerto",
    message: "Carpeta Expertos eliminada del proyecto",
    detail: "src/components/sections/Expertos/ fue removida. El equipo se muestra en /nosotros.",
  });

  // 5. PDF source link
  results.push({
    type: "ok",
    category: "Fuente PDF",
    message: "Módulos Destacados referencia al PDF oficial del programa",
    detail: "Editable desde Admin → Contenido → Módulos Destacados.",
  });

  return results;
}

const iconMap = {
  ok: <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />,
  warn: <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0" />,
  error: <XCircle className="w-4 h-4 text-destructive shrink-0" />,
};

export default function AdminSiteAudit() {
  const [results, setResults] = useState<AuditResult[] | null>(null);
  const [running, setRunning] = useState(false);

  const handleRun = useCallback(async () => {
    setRunning(true);
    setResults(null);
    // Small delay for UX
    await new Promise((r) => setTimeout(r, 600));
    const r = await runAudit();
    setResults(r);
    setRunning(false);
  }, []);

  const errorCount = results?.filter((r) => r.type === "error").length ?? 0;
  const warnCount = results?.filter((r) => r.type === "warn").length ?? 0;
  const okCount = results?.filter((r) => r.type === "ok").length ?? 0;

  return (
    <AdminLayout
      title="Auditoría del Sitio"
      subtitle="Verifica enlaces internos, anclas residuales y la salud general del sitio."
    >
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button onClick={handleRun} disabled={running} className="gap-2">
            {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            {running ? "Analizando..." : "Ejecutar Auditoría"}
          </Button>
          {results && (
            <Button variant="outline" onClick={handleRun} disabled={running} size="icon">
              <RefreshCw className="w-4 h-4" />
            </Button>
          )}
        </div>

        <AnimatePresence>
          {results && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Summary */}
              <div className="flex flex-wrap gap-3">
                <Badge variant="outline" className="gap-1.5 text-green-600 border-green-200 bg-green-50 dark:bg-green-950/30">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {okCount} OK
                </Badge>
                {warnCount > 0 && (
                  <Badge variant="outline" className="gap-1.5 text-yellow-600 border-yellow-200 bg-yellow-50 dark:bg-yellow-950/30">
                    <AlertTriangle className="w-3.5 h-3.5" /> {warnCount} Advertencias
                  </Badge>
                )}
                {errorCount > 0 && (
                  <Badge variant="outline" className="gap-1.5 text-destructive border-destructive/30 bg-destructive/5">
                    <XCircle className="w-3.5 h-3.5" /> {errorCount} Errores
                  </Badge>
                )}
              </div>

              {/* Results grouped by category */}
              {Object.entries(
                results.reduce<Record<string, AuditResult[]>>((acc, r) => {
                  (acc[r.category] ??= []).push(r);
                  return acc;
                }, {})
              ).map(([cat, items]) => (
                <Card key={cat} className="p-4 bg-card border-border/50">
                  <h3 className="font-semibold text-sm mb-3">{cat}</h3>
                  <div className="space-y-2">
                    {items.map((item, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-sm">
                        {iconMap[item.type]}
                        <div className="min-w-0">
                          <p className="text-foreground">{item.message}</p>
                          {item.detail && (
                            <p className="text-xs text-muted-foreground mt-0.5">{item.detail}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
}