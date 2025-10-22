import { useState } from "react";
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

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  return (
    <section id="maestria" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-primary mb-12 text-center">
          Sobre la Maestría
        </h2>

        {/* --- Tarjetas informativas --- */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="border-accent/20">
            <CardContent className="pt-6">
              <h3 className="text-2xl font-semibold text-primary mb-4">Modalidad</h3>
              <p className="text-foreground/80 leading-relaxed">
                Maestría presencial intensiva con clases teóricas y prácticas, talleres interactivos
                y discusión de casos clínicos reales. Incluye acceso a material digital y seguimiento
                post-curso.
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

          <Card className="border-accent/20">
            <CardContent className="pt-6">
              <h3 className="text-2xl font-semibold text-primary mb-4">Inversión</h3>
              <ul className="space-y-2 text-foreground/80">
                <li><strong>Profesionales:</strong> USD $3,000</li>
                <li><strong>Residentes:</strong> USD $1,500</li>
                <li><strong>Incluye:</strong> Material académico, certificación y coffee breaks</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-accent/20">
            <CardContent className="pt-6">
              <h3 className="text-2xl font-semibold text-primary mb-4">Dirigido a</h3>
              <ul className="space-y-2 text-foreground/80">
                <li>✓ Cardiólogos</li>
                <li>✓ Internistas</li>
                <li>✓ Reumatólogos</li>
                <li>✓ Neumonólogos</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* --- Video informativo --- */}
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

        {/* --- Visor del PDF --- */}
        <div className="bg-card rounded-lg shadow-lg p-8">
          <h3 className="text-2xl font-semibold text-primary mb-6 text-center">
            Programa Completo (PDF)
          </h3>
          <div className="w-full" style={{ height: "600px" }}>
            <iframe
              src="/MAESTRIA_CP_2025.pdf#toolbar=1"
              className="w-full h-full rounded-lg border-2 border-accent/20"
              title="Programa de la Maestría"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
