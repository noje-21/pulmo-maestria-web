import Navigation from "@/components/common/Navigation";
import AnimatedOnView from "@/components/common/AnimatedOnView";
import { SEO } from "@/components/common/SEO";
import { SkipLink } from "@/components/common/SkipLink";
import { HeroFlyer } from "@/components/sections/HeroFlyer";
import { Diferencial } from "@/components/sections/Diferencial";
import { ExperienciaFormativa } from "@/components/sections/ExperienciaFormativa";
import { Testimonios } from "@/components/sections/Testimonios";
import { ResultadoProfesional } from "@/components/sections/ResultadoProfesional";
import { AccionFinal } from "@/components/sections/AccionFinal";
import { Contacto } from "@/components/sections/Contacto";
import { Footer } from "@/components/sections/Footer";
import MobileFunnelCTA from "@/components/common/MobileFunnelCTA";
import { WhatsAppButton } from "@/components/common/WhatsAppButton";
import { AIAssistant } from "@/components/common/AIAssistant";

const Index = () => {
  return (
    <div className="min-h-screen">
      <SEO />
      <SkipLink />
      <Navigation />
      
      <main id="main-content">
        {/* 1️⃣ HERO — Impacto */}
        <HeroFlyer />

        {/* 2️⃣ DIFERENCIAL — ¿Por qué esta maestría? */}
        <AnimatedOnView>
          <Diferencial />
        </AnimatedOnView>

        {/* 3️⃣ EXPERIENCIA FORMATIVA — El ecosistema completo */}
        <AnimatedOnView>
          <ExperienciaFormativa />
        </AnimatedOnView>

        {/* 4️⃣ TESTIMONIOS — Momento WOW */}
        <AnimatedOnView>
          <Testimonios />
        </AnimatedOnView>

        {/* 5️⃣ RESULTADO PROFESIONAL — Transformación */}
        <AnimatedOnView>
          <ResultadoProfesional />
        </AnimatedOnView>

        {/* 6️⃣ ACCIÓN FINAL — CTA + Contacto */}
        <AccionFinal />
        <AnimatedOnView>
          <Contacto />
        </AnimatedOnView>
      </main>
      
      <Footer />
      
      <MobileFunnelCTA />
      <WhatsAppButton />
      <AIAssistant />
    </div>
  );
};

export default Index;
