import { memo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays } from "lucide-react";
import { useAteneosList } from "@/features/ateneos/hooks/useAteneosList";

/** Prueba de actividad académica: tres ateneos reales del proyecto. */
export const CampaignAteneos = memo(function CampaignAteneos() {
  const { ateneos, loading } = useAteneosList();
  const destacados = ateneos.slice(0, 3);

  if (loading || destacados.length === 0) return null;

  return (
    <section className="bg-background px-5 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          Actividad académica
        </p>
        <h2 className="mt-3 text-2xl font-bold text-foreground sm:text-4xl">
          Ateneos y actualización durante todo el año
        </h2>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
          La comunidad de la Maestría se reúne en ateneos con casos clínicos, guías internacionales y
          discusión entre especialistas de la región.
        </p>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {destacados.map((a) => (
            <Link
              key={a.id}
              to={`/ateneos/${a.id}`}
              className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-lg"
            >
              <div className="aspect-video overflow-hidden bg-muted">
                <img
                  src={a.imagen}
                  alt={a.titulo}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <p className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                  {new Date(a.fecha).toLocaleDateString("es-AR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <h3 className="mt-2 text-base font-bold leading-snug text-foreground group-hover:text-primary sm:text-lg">
                  {a.titulo}
                </h3>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                  {a.descripcion}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <Link
          to="/ateneos"
          className="mt-7 inline-flex items-center gap-2 text-base font-semibold text-primary hover:underline"
        >
          Ver todos los ateneos
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
});
