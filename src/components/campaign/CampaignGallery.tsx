import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface CampaignPhoto {
  src: string;
  alt: string;
}

export function CampaignGallery({ images }: { images: CampaignPhoto[] }) {
  const reducedMotion = useReducedMotion();
  const [carouselRef, carousel] = useEmblaCarousel({ loop: true, duration: reducedMotion ? 0 : 30 });
  const [selected, setSelected] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const syncSelection = useCallback(() => {
    if (carousel) setSelected(carousel.selectedScrollSnap());
  }, [carousel]);

  useEffect(() => {
    if (!carousel) return;
    syncSelection();
    carousel.on("select", syncSelection);
    carousel.on("reInit", syncSelection);
    return () => {
      carousel.off("select", syncSelection);
      carousel.off("reInit", syncSelection);
    };
  }, [carousel, syncSelection]);

  const navigate = useCallback((direction: number) => {
    if (direction < 0) carousel?.scrollPrev();
    else carousel?.scrollNext();
  }, [carousel]);

  const current = images[selected];
  if (!current) return null;

  return (
    <section className="campaign-hero bg-background px-5 py-14 text-foreground sm:px-6 sm:py-20" aria-label="Imágenes de ediciones anteriores">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="mb-7 border-b border-foreground/20 pb-7 sm:mb-9 sm:flex sm:items-end sm:justify-between sm:gap-6"
        >
          <div>
            <p className="text-xs font-semibold uppercase text-foreground/70">Ediciones anteriores</p>
            <h2 className="mt-3 text-3xl font-normal text-foreground sm:text-4xl lg:text-5xl">Así se vive la Maestría</h2>
          </div>
          <p className="mt-4 text-sm text-foreground/60 sm:mt-0">Encuentros que forman parte de nuestra historia.</p>
        </motion.div>

        <div className="relative">
          <div ref={carouselRef} className="overflow-hidden" aria-roledescription="carrusel" aria-label="Fotografías de la Maestría">
            <div className="flex touch-pan-y">
              {images.map((image, index) => (
                <div key={image.src} className="min-w-0 flex-[0_0_100%]" role="group" aria-roledescription="diapositiva" aria-label={`${index + 1} de ${images.length}`} aria-hidden={index !== selected}>
                  <img
                    src={image.src}
                    alt={image.alt}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[4/3] w-full object-contain sm:aspect-[16/9] lg:aspect-[2/1]"
                  />
                </div>
              ))}
            </div>
          </div>
          <Button variant="outline" size="icon" onClick={() => setExpanded(true)} aria-label="Ampliar fotografía" title="Ampliar fotografía" className="absolute bottom-3 right-3 h-11 w-11 rounded-sm border-foreground/30 bg-background/90 text-foreground hover:bg-foreground hover:text-background">
            <Expand className="h-5 w-5" aria-hidden="true" />
          </Button>
        </div>

        <div className="mt-5 flex items-start justify-between gap-4 border-b border-foreground/20 pb-5">
          <div className="min-w-0" aria-live="polite" aria-atomic="true">
            <p className="text-xs text-foreground/60">{String(selected + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}</p>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-foreground sm:text-base">{current.alt}</p>
          </div>
          <div className="flex shrink-0 gap-2">
            <Button variant="outline" size="icon" onClick={() => navigate(-1)} aria-label="Fotografía anterior" title="Fotografía anterior" className="h-11 w-11 rounded-sm border-foreground/30 bg-transparent text-foreground hover:bg-foreground hover:text-background"><ChevronLeft className="h-5 w-5" aria-hidden="true" /></Button>
            <Button variant="outline" size="icon" onClick={() => navigate(1)} aria-label="Fotografía siguiente" title="Fotografía siguiente" className="h-11 w-11 rounded-sm border-foreground/30 bg-transparent text-foreground hover:bg-foreground hover:text-background"><ChevronRight className="h-5 w-5" aria-hidden="true" /></Button>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-5 gap-2 sm:gap-4" aria-label="Seleccionar fotografía">
          {images.map((image, index) => (
            <Button key={image.src} variant="ghost" onClick={() => carousel?.scrollTo(index)} aria-label={`Ver fotografía ${index + 1}`} aria-pressed={index === selected} title={image.alt} className={`h-auto min-w-0 rounded-sm border-2 p-0 hover:bg-transparent ${index === selected ? "border-accent opacity-100" : "border-transparent opacity-50 hover:opacity-100"}`}>
              <img src={image.src} alt="" loading="lazy" decoding="async" className="aspect-[4/3] w-full rounded-sm object-cover" />
            </Button>
          ))}
        </div>
      </div>

      <DialogPrimitive.Root open={expanded} onOpenChange={setExpanded}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-[110] bg-foreground/90" />
          <DialogPrimitive.Content aria-describedby={undefined} onKeyDown={(event) => { if (event.key === "ArrowLeft") { event.preventDefault(); navigate(-1); } if (event.key === "ArrowRight") { event.preventDefault(); navigate(1); } }} className="fixed inset-0 z-[111] flex flex-col bg-background px-4 pb-6 pt-20 text-foreground outline-none sm:px-8">
            <DialogPrimitive.Title className="sr-only">Fotografías de la Maestría</DialogPrimitive.Title>
            <DialogPrimitive.Close asChild>
              <Button variant="outline" size="icon" className="absolute right-4 top-4 h-11 w-11" aria-label="Cerrar fotografía" title="Cerrar fotografía"><X className="h-5 w-5" aria-hidden="true" /></Button>
            </DialogPrimitive.Close>
            <img src={current.src} alt={current.alt} className="min-h-0 w-full flex-1 object-contain" />
            <div className="mx-auto mt-5 flex w-full max-w-4xl items-center justify-between gap-3">
              <Button variant="outline" size="icon" onClick={() => navigate(-1)} aria-label="Fotografía anterior" title="Fotografía anterior" className="h-11 w-11 shrink-0"><ChevronLeft className="h-5 w-5" aria-hidden="true" /></Button>
              <div className="min-w-0 text-center" aria-live="polite"><p className="text-xs text-muted-foreground">{selected + 1} / {images.length}</p><p className="mt-1 text-sm leading-relaxed">{current.alt}</p></div>
              <Button variant="outline" size="icon" onClick={() => navigate(1)} aria-label="Fotografía siguiente" title="Fotografía siguiente" className="h-11 w-11 shrink-0"><ChevronRight className="h-5 w-5" aria-hidden="true" /></Button>
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </section>
  );
}