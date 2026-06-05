import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/components/common/Navigation";
import { SEO } from "@/components/common/SEO";
import { useNavigate } from "react-router-dom";
import { Search, ArrowRight, Filter, Newspaper, Sparkles } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useNovedadesList, useNovedadesAuthors } from "@/features/novedades/hooks/useNovedades";
import NovedadCard from "@/features/novedades/components/NovedadCard";
import NovedadFeatured from "@/features/novedades/components/NovedadFeatured";
import { FeaturedSkeleton, NovedadCardSkeleton } from "@/features/novedades/components/NovedadesSkeletons";

const Novedades = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [authorFilter, setAuthorFilter] = useState<string>("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);

  const authors = useNovedadesAuthors();
  const { novedades, loading } = useNovedadesList(searchQuery, authorFilter);

  const featuredNovedad = novedades[0];
  const gridNovedades = novedades.slice(1, 1 + visibleCount);
  const hasMore = novedades.length > 1 + visibleCount;
  const hasActiveFilter = authorFilter !== "all";

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Novedades - Maestría en Circulación Pulmonar 2026"
        description="Mantente al día con las últimas noticias, artículos y actualizaciones de la Maestría en Circulación Pulmonar."
        keywords="novedades, noticias, circulación pulmonar, actualizaciones, artículos médicos"
      />
      <Navigation />

      <main className="pt-24 sm:pt-28 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 sm:mb-10 lg:mb-12"
          >
            <div className="text-center mb-6 sm:mb-8">
              <span className="brand-badge-accent mb-3 sm:mb-4 inline-flex text-xs sm:text-sm">
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                Noticias y Actualizaciones
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight mb-2 sm:mb-3">
                Novedades
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed px-2">
                Lo más reciente en avances, eventos y contenido que puede marcar la diferencia en tu práctica
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Buscar novedades..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 sm:pl-12 h-11 sm:h-12 text-sm sm:text-base rounded-xl border-border/50 bg-card"
                />
              </div>

              <div className="hidden sm:flex items-center gap-3">
                <Select value={authorFilter} onValueChange={setAuthorFilter}>
                  <SelectTrigger className="w-[180px] h-12 rounded-xl">
                    <SelectValue placeholder="Autor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los autores</SelectItem>
                    {authors.map((author) => (
                      <SelectItem key={author.id} value={author.id}>
                        {author.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {hasActiveFilter && (
                  <Button variant="ghost" size="sm" onClick={() => setAuthorFilter("all")}>
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
                        1
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
                      <label className="text-sm font-medium">Autor</label>
                      <Select value={authorFilter} onValueChange={setAuthorFilter}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Todos los autores" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos los autores</SelectItem>
                          {authors.map((author) => (
                            <SelectItem key={author.id} value={author.id}>
                              {author.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {hasActiveFilter && (
                      <Button variant="outline" onClick={() => setAuthorFilter("all")} className="w-full">
                        Limpiar filtros
                      </Button>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </motion.header>

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                <FeaturedSkeleton />
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(3)].map((_, i) => (
                    <NovedadCardSkeleton key={i} />
                  ))}
                </div>
              </motion.div>
            ) : novedades.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16 sm:py-20"
              >
                <div className="relative mb-5 sm:mb-6 mx-auto w-fit">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-xl scale-150" />
                  <div className="relative p-4 sm:p-5 bg-gradient-to-br from-muted to-muted/50 rounded-2xl border border-border/50">
                    <Newspaper className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground" />
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">Pronto habrá novedades</h3>
                <p className="text-muted-foreground max-w-sm mx-auto leading-relaxed text-sm sm:text-base px-4">
                  Estamos preparando contenido valioso para ti. Mientras tanto,
                  <span className="text-primary font-medium"> ¿por qué no exploras el foro?</span>
                </p>
                <Button variant="outline" className="mt-6 gap-2" onClick={() => navigate("/foro")}>
                  Ir al Foro
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-10 sm:space-y-14"
              >
                {featuredNovedad && <NovedadFeatured novedad={featuredNovedad} />}

                {gridNovedades.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-6">Más noticias</h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {gridNovedades.map((novedad, index) => (
                        <NovedadCard key={novedad.id} novedad={novedad} index={index} />
                      ))}
                    </div>
                  </div>
                )}

                {hasMore && (
                  <div className="text-center pt-4">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => setVisibleCount((c) => c + 6)}
                      className="gap-2 rounded-xl"
                    >
                      Cargar más novedades
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Novedades;
