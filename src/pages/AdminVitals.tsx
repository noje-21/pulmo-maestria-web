import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/features/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Activity, Smartphone, Monitor } from "lucide-react";

type Row = {
  metric_name: string;
  metric_value: number;
  metric_rating: string | null;
  device_type: string | null;
  created_at: string;
};

const METRICS = ["LCP", "INP", "CLS", "FCP", "TTFB"] as const;
type MetricName = (typeof METRICS)[number];

const THRESHOLDS: Record<MetricName, { good: number; poor: number; unit: string }> = {
  LCP: { good: 2500, poor: 4000, unit: "ms" },
  INP: { good: 200, poor: 500, unit: "ms" },
  CLS: { good: 0.1, poor: 0.25, unit: "" },
  FCP: { good: 1800, poor: 3000, unit: "ms" },
  TTFB: { good: 800, poor: 1800, unit: "ms" },
};

function p75(values: number[]): number | null {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const idx = Math.min(sorted.length - 1, Math.floor(sorted.length * 0.75));
  return sorted[idx];
}

function ratingFor(metric: MetricName, value: number | null): "good" | "needs" | "poor" | "n/a" {
  if (value == null) return "n/a";
  const t = THRESHOLDS[metric];
  if (value <= t.good) return "good";
  if (value <= t.poor) return "needs";
  return "poor";
}

const ratingClasses: Record<string, string> = {
  good: "text-emerald-500 bg-emerald-500/10 border-emerald-500/30",
  needs: "text-amber-500 bg-amber-500/10 border-amber-500/30",
  poor: "text-red-500 bg-red-500/10 border-red-500/30",
  "n/a": "text-muted-foreground bg-muted/30 border-border",
};

function formatValue(metric: MetricName, value: number | null): string {
  if (value == null) return "—";
  if (metric === "CLS") return value.toFixed(3);
  return `${Math.round(value)}${THRESHOLDS[metric].unit}`;
}

export default function AdminVitals() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState<7 | 30>(7);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
    (async () => {
      const { data, error } = await supabase
        .from("web_vitals")
        .select("metric_name, metric_value, metric_rating, device_type, created_at")
        .gte("created_at", since)
        .order("created_at", { ascending: false })
        .limit(5000);
      if (cancelled) return;
      if (!error && data) setRows(data as Row[]);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [days]);

  const aggregates = useMemo(() => {
    const grouped: Record<MetricName, { mobile: number[]; desktop: number[] }> = {
      LCP: { mobile: [], desktop: [] },
      INP: { mobile: [], desktop: [] },
      CLS: { mobile: [], desktop: [] },
      FCP: { mobile: [], desktop: [] },
      TTFB: { mobile: [], desktop: [] },
    };
    for (const r of rows) {
      const m = r.metric_name as MetricName;
      if (!grouped[m]) continue;
      const bucket = r.device_type === "mobile" ? "mobile" : "desktop";
      grouped[m][bucket].push(r.metric_value);
    }
    return METRICS.map((m) => ({
      metric: m,
      mobile: { p75: p75(grouped[m].mobile), count: grouped[m].mobile.length },
      desktop: { p75: p75(grouped[m].desktop), count: grouped[m].desktop.length },
    }));
  }, [rows]);

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <header className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Web Vitals (p75)</h1>
              <p className="text-sm text-muted-foreground">
                Métricas reales recogidas por <code>/vitals</code> · {rows.length} muestras
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 p-1 rounded-lg bg-muted/40 border border-border">
            {([7, 30] as const).map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  days === d ? "bg-card shadow-sm font-medium" : "text-muted-foreground"
                }`}
              >
                {d}d
              </button>
            ))}
          </div>
        </header>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {METRICS.map((m) => (
              <Card key={m} className="p-6 animate-pulse h-32 bg-muted/20" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {aggregates.map(({ metric, mobile, desktop }) => (
              <Card key={metric} className="p-6 space-y-4">
                <div className="flex items-baseline justify-between">
                  <h3 className="text-lg font-bold tracking-tight">{metric}</h3>
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    p75
                  </span>
                </div>

                {(["mobile", "desktop"] as const).map((dev) => {
                  const data = dev === "mobile" ? mobile : desktop;
                  const r = ratingFor(metric, data.p75);
                  const Icon = dev === "mobile" ? Smartphone : Monitor;
                  return (
                    <div
                      key={dev}
                      className={`flex items-center justify-between rounded-lg border px-3 py-2 ${ratingClasses[r]}`}
                    >
                      <div className="flex items-center gap-2 text-sm">
                        <Icon className="w-4 h-4" />
                        <span className="capitalize">{dev}</span>
                        <span className="text-xs opacity-60">({data.count})</span>
                      </div>
                      <span className="font-mono font-semibold tabular-nums">
                        {formatValue(metric, data.p75)}
                      </span>
                    </div>
                  );
                })}
              </Card>
            ))}
          </div>
        )}

        {!loading && rows.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">
              Aún no hay muestras. Las métricas se recogen automáticamente desde el sitio en
              producción vía <code>navigator.sendBeacon</code>.
            </p>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}