import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { SEO } from "@/components/common/SEO";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MessageSquare, Plus, Search, Filter, Sparkles } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  useForumPosts,
  useForumAuthors,
  useIsAdmin,
  useDebouncedValue,
} from "@/features/forum/hooks/useForumPosts";
import type { SortBy } from "@/features/forum/types";
import ForumCardSkeleton from "@/features/forum/components/ForumCardSkeleton";
import ForumPostCard from "@/features/forum/components/ForumPostCard";

const SORT_VALUES: SortBy[] = ["recent", "popular", "commented"];

const Foro = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters derived from the URL — shareable, bookmarkable, back/forward works.
  const categoryFilter = searchParams.get("cat") ?? "all";
  const authorFilter = searchParams.get("author") ?? "all";
  const sortFromUrl = searchParams.get("sort");
  const sortBy: SortBy = (SORT_VALUES as string[]).includes(sortFromUrl ?? "")
    ? (sortFromUrl as SortBy)
    : "recent";
  const searchFromUrl = searchParams.get("q") ?? "";

  // Local draft keeps the input responsive; debounced value is pushed to the URL.
  const [searchDraft, setSearchDraft] = useState(searchFromUrl);
  const debouncedSearch = useDebouncedValue(searchDraft, 300);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const updateParams = useCallback(
    (patch: Record<string, string | null>) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          for (const [key, value] of Object.entries(patch)) {
            const isDefault =
              value == null ||
              value === "" ||
              value === "all" ||
              (key === "sort" && value === "recent");
            if (isDefault) next.delete(key);
            else next.set(key, value);
          }
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  // Push debounced search back to the URL.
  useEffect(() => {
    if (debouncedSearch !== searchFromUrl) {
      updateParams({ q: debouncedSearch || null });
    }
  }, [debouncedSearch, searchFromUrl, updateParams]);

  const isAdmin = useIsAdmin();
  const authors = useForumAuthors();
  const {
    posts,
    loading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    reactedIds,
  } = useForumPosts({
    debouncedSearch: debouncedSearch,
    categoryFilter,
    authorFilter,
    sortBy,
  });

  const activeFiltersCount = useMemo(
    () => [categoryFilter !== "all", authorFilter !== "all"].filter(Boolean).length,
    [categoryFilter, authorFilter],
  );

  const setCategoryFilter = useCallback(
    (v: string) => updateParams({ cat: v }),
    [updateParams],
  );
  const setAuthorFilter = useCallback(
    (v: string) => updateParams({ author: v }),
    [updateParams],
  );
  const setSortBy = useCallback(
    (v: SortBy) => updateParams({ sort: v }),
    [updateParams],
  );
  const clearFilters = useCallback(() => {
    updateParams({ cat: null, author: null, sort: null });
  }, [updateParams]);

  const FilterContent = () => (
    <div className="space-y-6">
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Categoría</label>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full rounded-xl">
            <SelectValue placeholder="Todas las categorías" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorías</SelectItem>
            <SelectItem value="general">General</SelectItem>
            <SelectItem value="clinical_questions">Preguntas Clínicas</SelectItem>
            <SelectItem value="case_discussions">Casos Clínicos</SelectItem>
            <SelectItem value="shared_resources">Recursos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Autor</label>
        <Select value={authorFilter} onValueChange={setAuthorFilter}>
          <SelectTrigger className="w-full rounded-xl">
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

      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Ordenar por</label>
        <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
          <SelectTrigger className="w-full rounded-xl">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Más recientes</SelectItem>
            <SelectItem value="popular">Más vistos</SelectItem>
            <SelectItem value="commented">Más activos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {activeFiltersCount > 0 && (
        <Button variant="outline" onClick={clearFilters} className="w-full rounded-xl">
          Limpiar filtros ({activeFiltersCount})
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Foro Comunitario - Maestría en Circulación Pulmonar 2026"
        description="Participa en discusiones, comparte experiencias y conecta con otros profesionales de la salud en nuestro foro comunitario."
        keywords="foro, comunidad, discusiones, circulación pulmonar, profesionales de la salud"
      />

      <main className="pt-24 sm:pt-28 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 sm:mb-10"
          >
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-5 sm:mb-6">
              <div>
                <span className="brand-badge mb-2.5 sm:mb-3 inline-flex text-xs sm:text-sm">
                  <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  Comunidad
                </span>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight mb-1.5 sm:mb-2">
                  Foro Profesional
                </h1>
                <p className="text-muted-foreground text-sm sm:text-base lg:text-lg max-w-lg leading-relaxed">
                  Donde las preguntas difíciles encuentran respuestas. Comparte, aprende y crece con colegas.
                </p>
              </div>
              {isAdmin && (
                <Button
                  onClick={() => navigate("/admin/foro")}
                  size="lg"
                  className="btn-accent gap-2 min-h-[48px] group"
                  aria-label="Crear nueva publicación"
                >
                  <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                  Nueva Publicación
                </Button>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Buscar publicaciones..."
                  value={searchDraft}
                  onChange={(e) => setSearchDraft(e.target.value)}
                  className="pl-10 sm:pl-12 h-11 sm:h-12 text-sm sm:text-base rounded-xl border-border/50 bg-card"
                />
              </div>

              <div className="hidden lg:flex items-center gap-3">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[180px] h-12 rounded-xl">
                    <SelectValue placeholder="Categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="clinical_questions">Preguntas Clínicas</SelectItem>
                    <SelectItem value="case_discussions">Casos Clínicos</SelectItem>
                    <SelectItem value="shared_resources">Recursos</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                  <SelectTrigger className="w-[160px] h-12 rounded-xl">
                    <SelectValue placeholder="Ordenar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Recientes</SelectItem>
                    <SelectItem value="popular">Más vistos</SelectItem>
                    <SelectItem value="commented">Más activos</SelectItem>
                  </SelectContent>
                </Select>

                {activeFiltersCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
                    Limpiar
                  </Button>
                )}
              </div>

              <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="outline" size="lg" className="h-12 gap-2 rounded-xl relative">
                    <Filter className="w-5 h-5" />
                    Filtros
                    {activeFiltersCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-accent text-accent-foreground text-xs rounded-full flex items-center justify-center font-semibold">
                        {activeFiltersCount}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="rounded-t-3xl h-auto max-h-[80vh]">
                  <SheetHeader className="mb-6">
                    <SheetTitle>Filtros</SheetTitle>
                  </SheetHeader>
                  <FilterContent />
                </SheetContent>
              </Sheet>
            </div>
          </motion.header>

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {[...Array(4)].map((_, i) => (
                  <ForumCardSkeleton key={i} />
                ))}
              </motion.div>
            ) : posts.length > 0 ? (
              <motion.div key="list" className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {posts.map((post, index) => (
                  <ForumPostCard
                    key={post.id}
                    post={post}
                    index={index}
                    hasReacted={reactedIds.has(post.id)}
                  />
                ))}
                {hasNextPage && (
                  <div className="pt-6 flex justify-center">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => fetchNextPage()}
                      disabled={isFetchingNextPage}
                      className="rounded-xl min-w-[220px]"
                    >
                      {isFetchingNextPage ? "Cargando..." : "Cargar más publicaciones"}
                    </Button>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16 sm:py-20"
              >
                <div className="relative mb-6 mx-auto w-fit">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-xl scale-150" />
                  <div className="relative p-5 bg-gradient-to-br from-muted to-muted/50 rounded-2xl border border-border/50">
                    <MessageSquare className="w-12 h-12 text-muted-foreground" />
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2">
                  {debouncedSearch || categoryFilter !== "all" || authorFilter !== "all"
                    ? "No se encontraron publicaciones"
                    : "¡Bienvenido al Foro!"}
                </h3>
                <p className="text-muted-foreground mb-2 max-w-md mx-auto">
                  {debouncedSearch || categoryFilter !== "all" || authorFilter !== "all"
                    ? "Intenta ajustar los filtros de búsqueda"
                    : "Aquí podrás discutir casos clínicos, compartir recursos y conectar con otros profesionales."}
                </p>
                {!debouncedSearch && categoryFilter === "all" && authorFilter === "all" && (
                  <p className="text-sm text-accent font-medium mb-6 flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    ¡Sé el primero en iniciar la conversación!
                  </p>
                )}
                {isAdmin && !debouncedSearch && categoryFilter === "all" && authorFilter === "all" && (
                  <Button onClick={() => navigate("/admin/foro")} size="lg" className="btn-accent gap-2 mt-4">
                    <Plus className="w-5 h-5" />
                    Crear Primera Publicación
                  </Button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Foro;
