import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Configurar worker de PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
export const Maestria = () => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [containerWidth, setContainerWidth] = useState<number>(800);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Usamos ResizeObserver para medir el ancho real del contenedor (incluye cambios por CSS y paddings)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(entries => {
      for (const entry of entries) {
        const cr = entry.contentRect;
        // restamos 1px por seguridad y el padding interno (p-4 = 16px cada lado si usas Tailwind)
        // Ajusta el valor de paddingSubtract si tu contenedor tiene diferente padding
        const paddingSubtract = 32; // 16px left + 16px right
        const available = Math.max(200, Math.floor(cr.width - paddingSubtract)); // mínimo 200 para legibilidad
        setContainerWidth(available);
      }
    });
    ro.observe(el);
    // Medición inicial
    const rect = el.getBoundingClientRect();
    setContainerWidth(Math.max(200, Math.floor(rect.width - 32)));
    return () => ro.disconnect();
  }, []);
  const onDocumentLoadSuccess = ({
    numPages
  }: {
    numPages: number;
  }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };
  const nextPage = () => {
    if (numPages && pageNumber < numPages) {
      setDirection("next");
      setPageNumber(prev => prev + 1);
    }
  };
  const prevPage = () => {
    if (pageNumber > 1) {
      setDirection("prev");
      setPageNumber(prev => prev - 1);
    }
  };
  return <section id="maestria" className="py-20 bg-gradient-to-b from-muted/30 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4 text-center animate-fade-in">
          Sobre la Maestría
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto mb-12 rounded-full"></div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="border-accent/20 hover:border-accent/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br from-card to-card/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <span className="text-3xl">📚</span>
                </div>
                <h3 className="text-2xl font-semibold text-primary">Modalidad</h3>
              </div>
              <p className="text-foreground/80 leading-relaxed">
                Maestría presencial intensiva con clases teóricas y prácticas, talleres interactivos y discusión de casos clínicos reales. Incluye acceso a material digital y seguimiento post-curso.
              </p>
            </CardContent>
          </Card>
          <Card className="border-accent/20 hover:border-accent/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br from-card to-card/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-accent/10 rounded-lg">
                  <span className="text-3xl">📍</span>
                </div>
                <h3 className="text-2xl font-semibold text-primary">Fechas y Lugar</h3>
              </div>
              <ul className="space-y-3 text-foreground/80">
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">📅</span>
                  <span><strong>Fecha:</strong> 3 al 15 de noviembre 2025</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">🌎</span>
                  <span><strong>Lugar:</strong> Buenos Aires, Argentina</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">🏛️</span>
                  <span><strong>Sede:</strong> Centro Gallego de Buenos Aires</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="bg-gradient-to-br from-card to-card/50 rounded-2xl shadow-xl p-8 mb-12 text-center border border-accent/10 hover:shadow-2xl transition-all duration-500">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="text-4xl">🎥</span>
            <h3 className="text-2xl font-semibold text-primary">Video Informativo</h3>
          </div>
          <video controls preload="metadata" className="rounded-xl shadow-2xl w-full max-w-3xl h-auto mx-auto border-4 border-primary/20">
            <source src="/video.mp4" type="video/mp4" />
            Tu navegador no soporta la reproducción de video.
          </video>
          <p className="mt-6 text-muted-foreground text-lg">Video informativo sobre la Maestría en Circulación Pulmonar</p>
        </div>

        <div className="bg-gradient-to-br from-card to-card/50 rounded-2xl shadow-xl p-8 text-center border border-accent/10 hover:shadow-2xl transition-all duration-500">
          <div className="flex items-center justify-center gap-3 mb-8">
            <span className="text-4xl">📄</span>
            <h3 className="text-3xl font-semibold text-primary">Programa Completo</h3>
          </div>

          <div ref={containerRef} className="mx-auto w-full max-w-3xl bg-gradient-to-b from-muted/50 to-muted p-6 rounded-xl shadow-inner border-2 border-primary/10" style={{
          boxSizing: "border-box"
        }}>
            <Document file="/MAESTRIA_CP_2025.pdf" onLoadSuccess={onDocumentLoadSuccess}>
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div key={pageNumber} initial={{
                opacity: 0,
                y: direction === "next" ? 12 : -12
              }} animate={{
                opacity: 1,
                y: 0
              }} exit={{
                opacity: 0,
                y: direction === "next" ? -12 : 12
              }} transition={{
                duration: 0.28,
                ease: "easeInOut"
              }} className="flex justify-center">
                  {/* 
                    Pasamos width igual al ancho disponible (containerWidth).
                    Page adaptará el PDF manteniendo la proporción.
                   */}
                  <Page pageNumber={pageNumber} width={containerWidth} renderAnnotationLayer={true} renderTextLayer={true} />
                </motion.div>
              </AnimatePresence>
            </Document>
          </div>

          <div className="flex items-center justify-center gap-6 mt-8 flex-wrap">
            <Button 
              onClick={prevPage} 
              disabled={pageNumber <= 1}
              className="px-6 py-3 bg-primary hover:bg-primary/90 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 transition-all duration-300 rounded-full font-semibold shadow-lg"
            >
              ⬅️ Anterior
            </Button>
            <div className="px-6 py-3 bg-accent/10 rounded-full border-2 border-accent/20">
              <span className="text-base font-semibold text-primary">
                Página {pageNumber} de {numPages ?? "…"}
              </span>
            </div>
            <Button 
              onClick={nextPage} 
              disabled={numPages ? pageNumber >= numPages : false}
              className="px-6 py-3 bg-primary hover:bg-primary/90 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 transition-all duration-300 rounded-full font-semibold shadow-lg"
            >
              Siguiente ➡️
            </Button>
          </div>

          <div className="mt-8">
            <a 
              href="/MAESTRIA_CP_2025.pdf" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-all duration-300 text-base font-semibold px-6 py-3 rounded-full bg-accent/5 hover:bg-accent/10 border-2 border-accent/20 hover:scale-105"
            >
              <span className="text-xl">📖</span>
              Abrir PDF en nueva pestaña
            </a>
          </div>
        </div>
      </div>
    </section>;
};