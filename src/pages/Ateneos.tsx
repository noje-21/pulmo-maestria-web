import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Footer } from "@/components/sections/Footer";
import { SEO } from "@/components/common/SEO";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Search, Sparkles, BookOpen, Filter } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAteneosList } from "@/features/ateneos/hooks/useAteneosList";
import { categoryLabels, yearOptions } from "@/features/ateneos/types";
import AteneoCard from "@/features/ateneos/components/AteneoCard";
import AteneoFeatured from "@/features/ateneos/components/AteneoFeatured";

const Ateneos = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { ateneos, loading } = useAteneosList();

  const filtered = useMemo(() => {
    let result = ateneos;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (a) => a.titulo.toLowerCase().includes(q) || a.descripcion.toLowerCase().includes(q)
      );
    }
    if (categoryFilter !== "all") {
      result = result.filter((a) => (a as any).categoria === categoryFilter);
    }
    if (yearFilter !== "all") {
      result = result.filter((a) => a.fecha.startsWith(yearFilter));
    }
    return result;
  }, [searchQuery, categoryFilter, yearFilter, ateneos]);

  const featured = filtered[0];
  const rest = filtered.slice(1);
  const hasActiveFilter = categoryFilter !== "all" || yearFilter !== "all";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Ateneos Académicos - Maestría en Circulación Pulmonar",
    description: "Ateneos académicos de la Maestría Latinoamericana en Circulación Pulmonar.",
    url: "https://www.maestriacp.com/ateneos",
    isPartOf: { "@type": "WebSite", name: "Maestría Latinoamericana en Circulación Pulmonar" },
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Ateneos - Maestría en Circulación Pulmonar 2026"
        description="Ateneos académicos de la Maestría Latinoamericana en Circulación Pulmonar. Casos clínicos, presentaciones y discusiones."
        keywords="ateneos, casos clínicos, circulación pulmonar, hipertensión pulmonar, discusión académica"
        jsonLd={jsonLd}
      />

      <main className="pt-24 sm:pt-28 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 sm:mb-10 lg:mb-12"
          >
            <div className="text-center mb-6 sm:mb-8">
              <span className="brand-badge-accent mb-3 sm:mb-4 inline-flex text-xs sm:text-sm">
                <BookOpen className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                Formación Continua
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight mb-2 sm:mb-3">
                Ateneos Académicos
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed px-2">
                Casos clínicos, actualizaciones y discusiones académicas para mantenerte al día
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Buscar ateneos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 sm:pl-12 h-11 sm:h-12 text-sm sm:text-base rounded-xl border-border/50 bg-card"
                />
              </div>

              <div className="hidden sm:flex items-center gap-3">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[160px] h-12 rounded-xl">
                    <SelectValue placeholder="Categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {Object.entries(categoryLabels).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={yearFilter} onValueChange={setYearFilter}>
                  <SelectTrigger className="w-[120px] h-12 rounded-xl">
                    <SelectValue placeholder="Año" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {yearOptions.map((y) => (
                      <SelectItem key={y} value={y}>{y}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {hasActiveFilter && (
                  <Button variant="ghost" size="sm" onClick={() => { setCategoryFilter("all"); setYearFilter("all"); }}>
                    Limpiar
                  </Button>
                )}
              </div>

              <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetTrigger asChild className="sm:hidden">
                  <Button variant="outline" size="lg" className="h-12 gap-2 rounded-xl relative">
                    <Filter className="w-5 h-5" />
                    Filtros
                    {hasActiveFilter && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                        {(categoryFilter !== "all" ? 1 : 0) + (yearFilter !== "all" ? 1 : 0)}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="rounded-t-3xl h-auto">
                  <SheetHeader className="mb-6">
                    <SheetTitle>Filtros</SheetTitle>
                  </SheetHeader>
                  <div className="space-y-4 pb-8">
                    <div className="space-y-3">
                      <label className="text-sm font-medium">Categoría</label>
                      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger className="w-full"><SelectValue placeholder="Todas" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todas</SelectItem>
                          {Object.entries(categoryLabels).map(([k, v]) => (
                            <SelectItem key={k} value={k}>{v}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-medium">Año</label>
                      <Select value={yearFilter} onValueChange={setYearFilter}>
                        <SelectTrigger className="w-full"><SelectValue placeholder="Todos" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          {yearOptions.map((y) => (
                            <SelectItem key={y} value={y}>{y}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {hasActiveFilter && (
                      <Button variant="outline" onClick={() => { setCategoryFilter("all"); setYearFilter("all"); }} className="w-full">
                        Limpiar filtros
                      </Button>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </motion.header>

          {loading ? (
            <div className="space-y-8">
              <Skeleton className="h-64 w-full rounded-2xl" />
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-72 rounded-xl" />
                ))}
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 sm:py-20">
              <div className="relative mb-5 sm:mb-6 mx-auto w-fit">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-xl scale-150" />
                <div className="relative p-4 sm:p-5 bg-gradient-to-br from-muted to-muted/50 rounded-2xl border border-border/50">
                  <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground" />
                </div>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">No se encontraron ateneos</h3>
              <p className="text-muted-foreground text-sm sm:text-base">
                Intenta con otros términos de búsqueda.
              </p>
            </motion.div>
          ) : (
            <div className="space-y-10 sm:space-y-14">
              {featured && <AteneoFeatured ateneo={featured} />}

              {rest.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-6">Más ateneos</h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rest.map((ateneo, index) => (
                      <AteneoCard key={ateneo.id} ateneo={ateneo} index={index} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Ateneos;
