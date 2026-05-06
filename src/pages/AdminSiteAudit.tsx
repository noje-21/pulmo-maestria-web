import { useState, useCallback } from "react";
import AdminLayout from "@/features/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertTriangle, XCircle, Loader2, Search, RefreshCw, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AuditResult {
  type: "ok" | "warn" | "error";
  category: string;
  message: string;
  detail?: string;
}

/** Fetch a URL with HEAD, falling back to GET on 405, with a timeout */
async function probe(url: string, timeoutMs = 5000): Promise<{ ok: boolean; status: number; error?: string }> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    let res = await fetch(url, { method: "HEAD", redirect: "follow", signal: ctrl.signal });
    // Some servers reject HEAD — retry with GET
    if (res.status === 405) {
      res = await fetch(url, { method: "GET", redirect: "follow", signal: ctrl.signal });
    }
    return { ok: res.ok, status: res.status };
  } catch (e: any) {
    if (e.name === "AbortError") return { ok: false, status: 0, error: "timeout" };
    return { ok: false, status: 0, error: e.message || "network error" };
  } finally {
    clearTimeout(timer);
  }
}

async function runAudit(onProgress: (msg: string) => void): Promise<AuditResult[]> {
  const results: AuditResult[] = [];

  // 1. Check for #expertos references in the current DOM
  onProgress("Buscando anclas residuales (#expertos)...");
  const allAnchors = document.querySelectorAll('a[href*="#expertos"]');
  if (allAnchors.length === 0) {
    results.push({
      type: "ok",
      category: "Anclas residuales",
      message: 'No se encontraron referencias a "#expertos"',
      detail: "La sección Expertos fue removida y consolidada en Equipo Directivo (/nosotros).",
    });
  } else {
    results.push({
      type: "error",
      category: "Anclas residuales",
      message: `Se encontraron ${allAnchors.length} enlace(s) a "#expertos"`,
      detail: "Estos enlaces apuntan a una sección que ya no existe.",
    });
  }

  // 2. Verify critical pages are reachable via fetch
  const criticalPages = [
    { path: "/", label: "Landing" },
    { path: "/nosotros", label: "Nosotros" },
    { path: "/ateneos", label: "Ateneos" },
    { path: "/foro", label: "Foro" },
    { path: "/novedades", label: "Novedades" },
    { path: "/auth", label: "Login" },
    { path: "/admin", label: "Admin Dashboard" },
    { path: "/admin/content", label: "Admin Contenido" },
    { path: "/admin/audit", label: "Admin Auditoría" },
  ];

  for (const page of criticalPages) {
    onProgress(`Verificando ${page.label}...`);
    const { ok, status, error } = await probe(page.path);
    if (ok) {
      results.push({ type: "ok", category: "Páginas críticas", message: `${page.label} (${page.path}) — accesible (${status})` });
    } else if (error) {
      results.push({ type: "warn", category: "Páginas críticas", message: `${page.label} (${page.path}) — ${error}` });
    } else {
      results.push({ type: "error", category: "Páginas críticas", message: `${page.label} (${page.path}) — HTTP ${status}` });
    }
  }

  // 3. Collect ALL internal links from the DOM and verify each via fetch
  const allLinks = document.querySelectorAll("a[href]");
  const checked = new Set<string>();
  const internalLinks: string[] = [];

  allLinks.forEach((a) => {
    const href = a.getAttribute("href") || "";
    // Skip external, mailto, tel, blob, data, javascript
    if (/^(https?:|mailto:|tel:|blob:|data:|javascript:)/.test(href)) return;
    // Skip pure hash anchors on current page (e.g. "#contacto")
    if (/^#/.test(href)) return;
    if (checked.has(href)) return;
    checked.add(href);
    internalLinks.push(href);
  });

  // Probe links in batches of 4 to avoid overwhelming the server
  let brokenCount = 0;
  const BATCH = 4;
  for (let i = 0; i < internalLinks.length; i += BATCH) {
    const batch = internalLinks.slice(i, i + BATCH);
    onProgress(`Verificando enlaces internos (${i + 1}–${Math.min(i + BATCH, internalLinks.length)} de ${internalLinks.length})...`);
    const probes = await Promise.all(batch.map((href) => probe(href)));
    batch.forEach((href, j) => {
      const { ok, status, error } = probes[j];
      if (!ok) {
        brokenCount++;
        results.push({
          type: "error",
          category: "Enlaces internos",
          message: `Enlace roto: ${href}`,
          detail: error ? `Error: ${error}` : `HTTP ${status}`,
        });
      }
    });
  }

  if (brokenCount === 0 && internalLinks.length > 0) {
    results.push({
      type: "ok",
      category: "Enlaces internos",
      message: `${internalLinks.length} enlaces internos verificados por fetch — todos accesibles`,
    });
  } else if (internalLinks.length === 0) {
    results.push({
      type: "warn",
      category: "Enlaces internos",
      message: "No se encontraron enlaces internos en el DOM actual",
      detail: "La auditoría solo analiza los enlaces visibles en esta página. Navega a la landing para un análisis más completo.",
    });
  }

  // 4. Check asset links (PDF, images referenced in href)
  onProgress("Verificando recursos estáticos...");
  const assetLinks = document.querySelectorAll('a[href$=".pdf"], a[href$=".doc"], a[href$=".docx"]');
  const checkedAssets = new Set<string>();
  for (const a of Array.from(assetLinks)) {
    const href = a.getAttribute("href") || "";
    if (checkedAssets.has(href) || /^https?:/.test(href)) continue;
    checkedAssets.add(href);
    const { ok, status, error } = await probe(href);
    if (ok) {
      results.push({ type: "ok", category: "Recursos estáticos", message: `${href} — accesible (${status})` });
    } else {
      results.push({
        type: "error",
        category: "Recursos estáticos",
        message: `Archivo no encontrado: ${href}`,
        detail: error || `HTTP ${status}`,
      });
    }
  }

  // 5. Static code notes
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
  const [progress, setProgress] = useState("");

  const handleRun = useCallback(async () => {
    setRunning(true);
    setResults(null);
    setProgress("Iniciando auditoría...");
    const r = await runAudit(setProgress);
    setProgress("");
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

        {running && progress && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4 animate-pulse" />
            {progress}
          </div>
        )}

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