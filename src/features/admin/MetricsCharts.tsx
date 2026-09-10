import { useCallback, useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface SeriesRow {
  bucket: string;
  users_new: number;
  visits: number;
  interactions: number;
}

const RANGES = [7, 14, 30, 90] as const;

const formatDay = (iso: string) => {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString("es-AR", { day: "2-digit", month: "short" });
};

/**
 * Time-series panel for the admin dashboard. All values come from
 * dashboard_timeseries (admin-only RPC) — no estimated or mock data.
 */
export default function MetricsCharts() {
  const [days, setDays] = useState<number>(30);
  const [rows, setRows] = useState<SeriesRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.rpc("dashboard_timeseries", { _days: days });
    if (!error && data) {
      setRows(
        (data as unknown as SeriesRow[]).map((r) => ({
          ...r,
          users_new: Number(r.users_new),
          visits: Number(r.visits),
          interactions: Number(r.interactions),
        })),
      );
    }
    setLoading(false);
  }, [days]);

  useEffect(() => {
    void load();
    const interval = window.setInterval((): void => void load(), 60000);
    return () => window.clearInterval(interval);
  }, [load]);

  const totals = rows.reduce(
    (acc, r) => ({
      users: acc.users + r.users_new,
      visits: acc.visits + r.visits,
      interactions: acc.interactions + r.interactions,
    }),
    { users: 0, visits: 0, interactions: 0 },
  );

  const chartData = rows.map((r) => ({ ...r, label: formatDay(r.bucket) }));

  return (
    <Card className="p-4 md:p-6 bg-card border-border/50 mb-8">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg md:text-xl font-bold">Evolución en el tiempo</h2>
          <p className="text-xs text-muted-foreground">
            Nuevos usuarios, visitas e interacciones reales por día
          </p>
        </div>
        <div className="flex gap-1.5">
          {RANGES.map((r) => (
            <Button
              key={r}
              size="sm"
              variant={days === r ? "default" : "outline"}
              onClick={() => setDays(r)}
            >
              {r}d
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="rounded-xl bg-muted/50 p-3">
          <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Usuarios nuevos</p>
          <p className="text-xl font-bold">{totals.users.toLocaleString("es-AR")}</p>
        </div>
        <div className="rounded-xl bg-muted/50 p-3">
          <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Visitas</p>
          <p className="text-xl font-bold">{totals.visits.toLocaleString("es-AR")}</p>
        </div>
        <div className="rounded-xl bg-muted/50 p-3">
          <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Interacciones</p>
          <p className="text-xl font-bold">{totals.interactions.toLocaleString("es-AR")}</p>
        </div>
      </div>

      <div className="h-[280px] w-full">
        {loading && rows.length === 0 ? (
          <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
            Cargando datos…
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
              <defs>
                <linearGradient id="gUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.45} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gVisits" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity={0.45} />
                  <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gInter" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                tickLine={false}
                axisLine={false}
                minTickGap={16}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                tickLine={false}
                axisLine={false}
                width={40}
              />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 12,
                  fontSize: 12,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area
                type="monotone"
                dataKey="visits"
                name="Visitas"
                stroke="hsl(var(--accent))"
                fill="url(#gVisits)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="interactions"
                name="Interacciones"
                stroke="hsl(var(--muted-foreground))"
                fill="url(#gInter)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="users_new"
                name="Usuarios nuevos"
                stroke="hsl(var(--primary))"
                fill="url(#gUsers)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}
