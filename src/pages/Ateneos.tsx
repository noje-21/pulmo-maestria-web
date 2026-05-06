import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navigation from "@/components/common/Navigation";
import { Footer } from "@/components/sections/Footer";
import { SEO } from "@/components/common/SEO";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ImageLazy from "@/components/common/ImageLazy";
import {
  Calendar, Search, ArrowRight, Sparkles, BookOpen,
  Video, FileText,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ateneosData } from "@/data/ateneos";

const Ateneos = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    if (!searchQuery) return ateneosData;
    const q = searchQuery.toLowerCase();
    return ateneosData.filter(
      (a) =>
        a.titulo.toLowerCase().includes(q) ||
        a.descripcion.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Ateneos - Maestría en Circulación Pulmonar 2026"
        description="Ateneos académicos de la Maestría Latinoamericana en Circulación Pulmonar. Casos clínicos, presentaciones y discusiones."
        keywords="ateneos, casos clínicos, circulación pulmonar, hipertensión pulmonar, discusión académica"
      />
      <Navigation />

      <main className="pt-24 sm:pt-28 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
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

            {/* Search */}
            <div className="max-w-xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Buscar ateneos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 sm:pl-12 h-11 sm:h-12 text-sm sm:text-base rounded-xl border-border/50 bg-card"
                />
              </div>
            </div>
          </motion.header>

          {filtered.length === 0 ? (
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
              {/* Featured */}
              {featured && (
                <motion.article
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  onClick={() => navigate(`/ateneos/${featured.id}`)}
                  className="group cursor-pointer"
                >
                  <div className="relative card-base card-hover overflow-hidden transition-all duration-400 brand-accent-bar-top">
                    <div className="grid lg:grid-cols-2 gap-0">
                      <div className="relative aspect-[16/10] lg:aspect-auto overflow-hidden">
                        <ImageLazy
                          src={featured.imagen}
                          alt={featured.titulo}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent lg:hidden" />
                        <span className="absolute top-4 left-4 brand-badge-accent shadow-lg">
                          <Sparkles className="w-3 h-3" />
                          Destacado
                        </span>
                      </div>
                      <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            <time>{format(new Date(featured.fecha), "dd 'de' MMMM, yyyy", { locale: es })}</time>
                          </div>
                          {featured.videoUrl && (
                            <>
                              <span className="w-1 h-1 rounded-full bg-border" />
                              <div className="flex items-center gap-1 text-primary">
                                <Video className="w-3.5 h-3.5" /> Video
                              </div>
                            </>
                          )}
                          {featured.pdfUrl && (
                            <>
                              <span className="w-1 h-1 rounded-full bg-border" />
                              <div className="flex items-center gap-1 text-primary">
                                <FileText className="w-3.5 h-3.5" /> PDF
                              </div>
                            </>
                          )}
                        </div>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 group-hover:text-primary transition-colors leading-tight">
                          {featured.titulo}
                        </h2>
                        <p className="text-muted-foreground text-base sm:text-lg mb-6 line-clamp-3">
                          {featured.descripcion}
                        </p>
                        <span className="inline-flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all self-end">
                          Ver más <ArrowRight className="w-5 h-5" />
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.article>
              )}

              {/* Grid */}
              {rest.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-6">Más ateneos</h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rest.map((ateneo, index) => (
                      <motion.article
                        key={ateneo.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.06, duration: 0.4 }}
                        onClick={() => navigate(`/ateneos/${ateneo.id}`)}
                        className="group cursor-pointer"
                      >
                        <div className="h-full card-base card-hover overflow-hidden flex flex-col transition-all duration-400 relative group">
                          <div className="absolute top-0 left-0 w-10 h-10 bg-gradient-to-br from-accent/10 to-transparent pointer-events-none z-10" />
                          <div className="absolute top-0 left-0 w-0.5 h-5 bg-accent rounded-br-sm z-10" />
                          <div className="relative aspect-[16/9] overflow-hidden">
                            <ImageLazy
                              src={ateneo.imagen}
                              alt={ateneo.titulo}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                            <div className="absolute bottom-3 left-3 flex gap-1.5">
                              {ateneo.videoUrl && (
                                <span className="px-2 py-0.5 bg-primary/90 text-primary-foreground text-xs rounded-full flex items-center gap-1">
                                  <Video className="w-3 h-3" /> Video
                                </span>
                              )}
                              {ateneo.pdfUrl && (
                                <span className="px-2 py-0.5 bg-primary/90 text-primary-foreground text-xs rounded-full flex items-center gap-1">
                                  <FileText className="w-3 h-3" /> PDF
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="p-5 flex flex-col flex-1">
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                              <Calendar className="w-3.5 h-3.5" />
                              <time>{format(new Date(ateneo.fecha), "dd MMM yyyy", { locale: es })}</time>
                            </div>
                            <h3 className="font-bold text-base sm:text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                              {ateneo.titulo}
                            </h3>
                            <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-1">
                              {ateneo.descripcion}
                            </p>
                            <span className="inline-flex items-center gap-1.5 text-primary text-sm font-semibold group-hover:gap-2.5 transition-all">
                              Ver más <ArrowRight className="w-4 h-4" />
                            </span>
                          </div>
                        </div>
                      </motion.article>
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