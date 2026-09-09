import { useCallback, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AdminLayout from "@/features/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Monitor, Smartphone, RefreshCw } from "lucide-react";

interface VisitRow {
  id: string;
  created_at: string;
  page_url: string | null;
  ip: string | null;
  device_type: string | null;
  user_agent: string | null;
  total_count: number;
}

const PAGE_SIZE = 50;

const pathOf = (url: string | null) => {
  if (!url) return "—";
  try {
    return new URL(url).pathname || "/";
  } catch {
    return url;
  }
};

const AdminVisitas = () => {
  const [rows, setRows] = useState<VisitRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebounced(search);
      setPage(0);
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.rpc("visit_history", {
      _limit: PAGE_SIZE,
      _offset: page * PAGE_SIZE,
      _search: debounced || null,
    });
    if (error) {
      toast.error("No se pudo cargar el historial de visitas");
    } else {
      const list = (data ?? []) as unknown as VisitRow[];
      setRows(list);
      setTotal(list.length > 0 ? Number(list[0].total_count) : 0);
    }
    setLoading(false);
  }, [page, debounced]);

  useEffect(() => {
    void load();
  }, [load]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <AdminLayout
      title="Historial de Visitas"
      subtitle="Cada carga de página registrada, con fecha, hora, página y dirección IP"
    >
      <Card className="p-4 md:p-5 bg-card border-border/50">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por página o IP…"
            className="max-w-xs"
          />
          <Button variant="outline" size="sm" onClick={() => void load()} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Actualizar
          </Button>
          <span className="text-sm text-muted-foreground ml-auto">
            {total.toLocaleString("es-AR")} visitas registradas
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground border-b border-border/50">
                <th className="py-2 pr-4 font-medium">Fecha</th>
                <th className="py-2 pr-4 font-medium">Hora</th>
                <th className="py-2 pr-4 font-medium">Página</th>
                <th className="py-2 pr-4 font-medium">IP</th>
                <th className="py-2 pr-4 font-medium">Dispositivo</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const d = new Date(r.created_at);
                return (
                  <tr key={r.id} className="border-b border-border/30 hover:bg-muted/40">
                    <td className="py-2.5 pr-4 whitespace-nowrap">
                      {d.toLocaleDateString("es-AR")}
                    </td>
                    <td className="py-2.5 pr-4 whitespace-nowrap text-muted-foreground">
                      {d.toLocaleTimeString("es-AR")}
                    </td>
                    <td className="py-2.5 pr-4 max-w-[280px] truncate" title={r.page_url ?? ""}>
                      {pathOf(r.page_url)}
                    </td>
                    <td className="py-2.5 pr-4 font-mono text-xs">{r.ip ?? "—"}</td>
                    <td className="py-2.5 pr-4">
                      <Badge variant="secondary" className="gap-1 font-normal">
                        {r.device_type === "mobile" ? (
                          <Smartphone className="w-3 h-3" />
                        ) : (
                          <Monitor className="w-3 h-3" />
                        )}
                        {r.device_type === "mobile" ? "Móvil" : "Escritorio"}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {!loading && rows.length === 0 && (
            <p className="text-center text-muted-foreground py-10">
              Todavía no hay visitas registradas con este filtro.
            </p>
          )}
        </div>

        {total > PAGE_SIZE && (
          <div className="flex items-center justify-between mt-4">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
            >
              Anterior
            </Button>
            <span className="text-xs text-muted-foreground">
              Página {page + 1} de {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page + 1 >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Siguiente
            </Button>
          </div>
        )}
      </Card>

      <p className="text-xs text-muted-foreground mt-4">
        La dirección IP se registra desde ahora en adelante; las visitas anteriores a este cambio
        aparecen sin IP.
      </p>
    </AdminLayout>
  );
};

export default AdminVisitas;
