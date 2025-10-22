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
  const [pdfWidth, setPdfWidth] = useState(800);

  const containerRef = useRef<HTMLDivElement | null>(null);

  // Ajustar ancho del PDF dinámicamente según el contenedor
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setPdfWidth(Math.min(width - 20, 900)); // margen y límite superior
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
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

        {/* === Tarjetas de información === */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {[
            {
              title: "Modalidad",
              content:
                "Maestría presencial intensiva con clases teóricas y prácticas, talleres interactivos y discusión de casos clínicos reales. Incluye acceso a material digital y seguimiento post-curso.",
            },
            {
              title: "Fechas y Lugar",
              content: (
                <ul className="space-y-2 text-foreground/80">
                  <li><strong>Fecha:</strong> 3 al 15 de noviembre 2025</li>
                  <li><strong>Lugar:</strong> Buenos Aires, Argentina</li>
                  <li><strong>Sede:</strong> Centro Gallego de Buenos Aires</li>
                </ul>
              ),
            },
            {
              title: "Inversión",
              content: (
                <ul className="space-y-2 text-foreground/80">
                  <li><strong>Profesionales:</strong> USD $2,800</li>
                  <li><strong>Residentes:</strong> USD $1,850</li>
                  <li><strong>Incluye:</strong> Material académico, certificación, coffee breaks, acceso al campus virtual, acompañamiento 1:1 y entrenamiento práctico.</li>
                </ul>
              ),
            },
            {
              title: "Dirigido a",
              content: (
                <ul className="space-y-2 text-foreground/80">
                  <li>✓ Cardiólogos</li>
                  <li>✓ Internistas</li>
                  <li>✓ Reumatólogos</li>
                  <li>✓ Neumonólogos</li>
                </ul>
              ),
            },
          ].map((item, idx) => (
            <Card key={idx} className="border-accent/20">
              <CardContent className="pt-6">
                <h3 className="text-2xl font-semibold text-primary mb-4">{item.title}</h3>
                <div className="text-foreground/80 leading-relaxed">{item.content}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* === VIDEO === */}
        <div className="bg-card rounded-lg shadow-lg p-8 mb-12 text-center">
          <h3 className="text-2xl font-semibold text-primary mb-6 text-center">
            Video Informativo
          </h3>

          <div className="flex flex-col items-center">
            <video
              controls
              preload="metadata"
              className="rounded-lg shadow-md w-full max-w-3xl h-auto"
            >
              <source src="/video.mp4" type="video/mp4" />
              Tu navegador no soporta la reproducción de video.
            </video>

            <p className="mt-4 text-muted-foreground">
              Video informativo sobre la Maestría en Circulación Pulmonar
            </p>
          </div>
        </div>

        {/* === VISOR DE PDF === */}
        <div className="bg-card rounded-lg shadow-lg p-8 text-center" ref={containerRef}>
          <h3 className="text-2xl font-semibold text-primary mb-6 text-center">
            Programa Completo (PDF)
          </h3>

          <div className="flex flex-col items-center">
            <div className="border rounded-lg shadow-inner bg-muted p-4 w-full overflow-hidden relative">
              <Document
                file="/MAESTRIA_CP_2025.pdf"
                onLoadSuccess={onDocumentLoadSuccess}
                className="flex flex-col items-center"
              >
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={pageNumber}
                    initial={{ opacity: 0, x: direction === "next" ? 50 : -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: direction === "next" ? -50 : 50 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="flex justify-center"
                  >
                    <Page
                      pageNumber={pageNumber}
                      width={pdfWidth}
                      renderAnnotationLayer={false}
                      renderTextLayer={false}
                    />
                  </motion.div>
                </AnimatePresence>
              </Document>
            </div>

            <div className="flex justify-center items-center gap-4 mt-6">
              <Button onClick={prevPage} disabled={pageNumber <= 1}>
                ⬅️ Anterior
              </Button>
              <span className="text-sm text-muted-foreground">
                Página {pageNumber} de {numPages ?? "…"}
              </span>
              <Button onClick={nextPage} disabled={numPages ? pageNumber >= numPages : false}>
                Siguiente ➡️
              </Button>
            </div>

            <a
              href="/MAESTRIA_CP_2025.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 text-accent hover:underline text-sm"
            >
              📖 Ver PDF completo
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
