import { motion } from "framer-motion";
import { Footer } from "@/components/sections/Footer";
import { SEO } from "@/components/common/SEO";
import { BookOpen } from "lucide-react";
import AteneoPromo from "@/features/ateneos/components/AteneoPromo";

const Ateneos = () => {
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
                Ateneos MCP
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed px-2">
                Casos clínicos, actualizaciones y discusiones académicas para mantenerte al día
              </p>
            </div>
          </motion.header>

          <AteneoPromo />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Ateneos;
