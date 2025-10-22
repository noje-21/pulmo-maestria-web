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

    const ro = new ResizeObserver((entries) => {
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

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  const nextPage = () => {
    if (numPages && pageNumber < numPages) {
      setDirection("next");
      setPageNumber((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (pageNumber > 1) {
      setDirection("prev");
      setPageNumber((prev) => prev - 1);
    }
  };

  return (
    <section id="maestria" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-primary mb-12 text-center">
          Sobre la Maestría
        </h2>

        {/* --- (tu contenido de tarjetas y video) --- */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="border-accent/20">
            <CardContent className="pt-6">
              <h3 className="text-2xl font-semibold text-primary mb-4">Modalidad</h3>
              <p className="text-foreground/80 leading-relaxed">
                Maestría presencial intensiva con clases teóricas y prácticas, talleres interactivos y discusión de casos clínicos reales. Incluye acceso a material digital y seguimiento post-curso.
              </p>
            </CardContent>
          </Card>
          <Card className="border-accent/20">
            <CardContent className="pt-6">
              <h3 className="text-2xl font-semibold text-primary mb-4">Fechas y Lugar</h3>
              <ul className="space-y-2 text-foreground/80">
                <li><strong>Fecha:</strong> 3 al 15 de noviembre 2025</li>
                <li><strong>Lugar:</strong> Buenos Aires, Argentina</li>
                <li><strong>Sede:</strong> Centro Gallego de Buenos Aires</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="bg-card rounded-lg shadow-lg p-8 mb-12 text-center">
          <h3 className="text-2xl font-semibold text-primary mb-6">Video Informativo</h3>
          <video controls preload="metadata" className="rounded-lg shadow-md w-full max-w-3xl h-auto">
            <source src="/video.mp4" type="video/mp4" />
            Tu navegador no soporta la reproducción de video.
          </video>
          <p className="mt-4 text-muted-foreground">Video informativo sobre la Maestría en Circulación Pulmonar</p>
        </div>

        {/* === VISOR DE PDF: contenedor responsive --- */}
        <div className="bg-card rounded-lg shadow-lg p-6 text-center">
          <h3 className="text-2xl font-semibold text-primary mb-6">Programa Completo (PDF)</h3>

          {/* Contenedor medible */}
          <div
            ref={containerRef}
            className="mx-auto w-full max-w-3xl bg-muted p-4 rounded-lg"
            style={{ boxSizing: "border-box" }}
          >
            <Document
              file="/MAESTRIA_CP_2025.pdf"
              onLoadSuccess={onDocumentLoadSuccess}
            >
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={pageNumber}
                  initial={{ opacity: 0, y: direction === "next" ? 12 : -12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: direction === "next" ? -12 : 12 }}
                  transition={{ duration: 0.28, ease: "easeInOut" }}
                  className="flex justify-center"
                >
                  {/* 
                    Pasamos width igual al ancho disponible (containerWidth).
                    Page adaptará el PDF manteniendo la proporción.
                  */}
                  <Page
                    pageNumber={pageNumber}
                    width={containerWidth}
                    renderAnnotationLayer={true}
                    renderTextLayer={true}
                  />
                </motion.div>
              </AnimatePresence>
            </Document>
          </div>

          {/* Controles */}
          <div className="flex items-center justify-center gap-4 mt-6 flex-wrap">
            <Button onClick={prevPage} disabled={pageNumber <= 1}>⬅️ Anterior</Button>
            <span className="text-sm text-muted-foreground">Página {pageNumber} de {numPages ?? "…"}</span>
            <Button onClick={nextPage} disabled={numPages ? pageNumber >= numPages : false}>Siguiente ➡️</Button>
          </div>

          <div className="mt-4">
            <a href="/MAESTRIA_CP_2025.pdf" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline text-sm">
              📖 Abrir PDF en pestaña nueva
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
