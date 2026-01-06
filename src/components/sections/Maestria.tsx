import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Document, Page, pdfjs } from "react-pdf";
import { BookOpen, MapPin, Calendar, Play, ChevronLeft, ChevronRight, ExternalLink, Building } from "lucide-react";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const features = [
  {
    icon: BookOpen,
    title: "Modalidad",
    description: "Maestría presencial intensiva con clases teóricas y prácticas, talleres interactivos y discusión de casos clínicos reales.",
    color: "primary"
  },
  {
    icon: Calendar,
    title: "Fechas",
    description: "Del 3 al 15 de noviembre de 2025. 12 días de formación intensiva con los mejores especialistas.",
    color: "accent"
  },
  {
    icon: MapPin,
    title: "Ubicación",
    description: "Buenos Aires, Argentina. Sede: Centro Gallego de Buenos Aires, en el corazón de la ciudad.",
    color: "primary"
  },
  {
    icon: Building,
    title: "Certificación",
    description: "Certificación oficial respaldada por instituciones médicas de prestigio de Latinoamérica.",
    color: "accent"
  }
];

export const Maestria = () => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [containerWidth, setContainerWidth] = useState<number>(600);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    
    const ro = new ResizeObserver(entries => {
      for (const entry of entries) {
        const cr = entry.contentRect;
        const paddingSubtract = 48;
        const available = Math.max(280, Math.min(800, Math.floor(cr.width - paddingSubtract)));
        setContainerWidth(available);
      }
    });
    
    ro.observe(el);
    const rect = el.getBoundingClientRect();
    setContainerWidth(Math.max(280, Math.min(800, Math.floor(rect.width - 48))));
    
    return () => ro.disconnect();
  }, []);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
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

  return (
    <section id="maestria" className="py-20 md:py-28 bg-gradient-to-b from-muted/50 to-background relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-50" />
      
      <div className="section-container relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="section-header"
        >
          <h2 className="section-title">Sobre la Maestría</h2>
          <div className="section-divider" />
          <p className="section-subtitle">
            Una experiencia educativa única diseñada para profesionales de la salud
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-16"
        >
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="card-base card-hover group bg-card"
            >
              <CardContent className="p-6">
                <div className={`inline-flex p-3 rounded-xl mb-4 transition-transform duration-300 group-hover:scale-110 ${
                  feature.color === 'primary' ? 'bg-primary/10' : 'bg-accent/10'
                }`}>
                  <feature.icon className={`w-6 h-6 ${
                    feature.color === 'primary' ? 'text-primary' : 'text-accent'
                  }`} />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Video Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <Card className="card-base overflow-hidden bg-card">
            <CardContent className="p-0">
              <div className="flex flex-col lg:flex-row">
                {/* Video */}
                <div className="lg:w-2/3 relative">
                  <video 
                    controls 
                    preload="metadata" 
                    className="w-full h-full min-h-[280px] sm:min-h-[360px] lg:min-h-[420px] object-cover"
                    poster={undefined}
                  >
                    <source src="/video.mp4" type="video/mp4" />
                    Tu navegador no soporta la reproducción de video.
                  </video>
                </div>
                
                {/* Video Info */}
                <div className="lg:w-1/3 p-6 md:p-8 flex flex-col justify-center bg-gradient-to-br from-primary/5 to-accent/5">
                  <div className="inline-flex items-center gap-2 text-accent font-semibold mb-3">
                    <Play className="w-5 h-5" />
                    <span>Video Informativo</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3">
                    Conoce nuestra Maestría
                  </h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Descubre todo sobre el programa, los docentes, y cómo esta formación puede impulsar tu carrera médica.
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-fit"
                    onClick={() => window.open("https://www.maestriacp.com/", "_blank")}
                  >
                    Más Información
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* PDF Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="card-base bg-card">
            <CardContent className="p-6 md:p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 text-primary font-semibold mb-2">
                  <BookOpen className="w-5 h-5" />
                  <span>Programa Académico</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-foreground">
                  Programa Completo 2025
                </h3>
              </div>

              {/* PDF Viewer */}
              <div 
                ref={containerRef} 
                className="mx-auto w-full max-w-4xl bg-muted/50 rounded-xl p-4 md:p-6 border border-border/50"
              >
                <Document file="/MAESTRIA_CP_2025.pdf" onLoadSuccess={onDocumentLoadSuccess}>
                  <AnimatePresence mode="wait" custom={direction}>
                    <motion.div 
                      key={pageNumber} 
                      initial={{ opacity: 0, y: direction === "next" ? 10 : -10 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      exit={{ opacity: 0, y: direction === "next" ? -10 : 10 }} 
                      transition={{ duration: 0.25, ease: "easeInOut" }} 
                      className="flex justify-center"
                    >
                      <Page 
                        pageNumber={pageNumber} 
                        width={containerWidth} 
                        renderAnnotationLayer={true} 
                        renderTextLayer={true}
                        className="shadow-lg rounded-lg overflow-hidden"
                      />
                    </motion.div>
                  </AnimatePresence>
                </Document>
              </div>

              {/* PDF Controls */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
                <div className="flex items-center gap-3">
                  <Button 
                    onClick={prevPage} 
                    disabled={pageNumber <= 1} 
                    variant="outline"
                    size="icon"
                    className="rounded-full w-10 h-10"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  
                  <div className="px-5 py-2 bg-muted rounded-full text-sm font-medium">
                    {pageNumber} / {numPages ?? "..."}
                  </div>
                  
                  <Button 
                    onClick={nextPage} 
                    disabled={numPages ? pageNumber >= numPages : false}
                    variant="outline"
                    size="icon"
                    className="rounded-full w-10 h-10"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
                
                <a 
                  href="/MAESTRIA_CP_2025.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Abrir PDF completo
                </a>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};
