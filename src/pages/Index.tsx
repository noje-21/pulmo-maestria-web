import { lazy, Suspense } from "react";
import Navigation from "@/components/common/Navigation";
import AnimatedOnView from "@/components/common/AnimatedOnView";
import { SEO } from "@/components/common/SEO";
import { SkipLink } from "@/components/common/SkipLink";
import { HeroFlyer } from "@/components/sections/HeroFlyer";
import { Footer } from "@/components/sections/Footer";
import MobileFunnelCTA from "@/components/common/MobileFunnelCTA";
import { WhatsAppButton } from "@/components/common/WhatsAppButton";
import { AIAssistant } from "@/components/common/AIAssistant";

// Lazy-loaded sections (below the fold)
const Diferenciales = lazy(() => import("@/components/sections/Diferenciales").then(m => ({ default: m.Diferenciales })));
const Maestria = lazy(() => import("@/components/sections/Maestria").then(m => ({ default: m.Maestria })));
const EjesFormacion = lazy(() => import("@/components/sections/EjesFormacion").then(m => ({ default: m.EjesFormacion })));
const ComoFunciona = lazy(() => import("@/components/sections/ComoFunciona").then(m => ({ default: m.ComoFunciona })));
const Expertos = lazy(() => import("@/components/sections/Expertos").then(m => ({ default: m.Expertos })));
const Eventos = lazy(() => import("@/components/sections/Eventos").then(m => ({ default: m.Eventos })));
const Testimonios = lazy(() => import("@/components/sections/Testimonios").then(m => ({ default: m.Testimonios })));
const QuienesSomos = lazy(() => import("@/components/sections/QuienesSomos").then(m => ({ default: m.QuienesSomos })));
const Galeria = lazy(() => import("@/components/sections/Galeria"));
const CTAFinal = lazy(() => import("@/components/sections/CTAFinal").then(m => ({ default: m.CTAFinal })));
const Contacto = lazy(() => import("@/components/sections/Contacto").then(m => ({ default: m.Contacto })));
const ScrollInvitation = lazy(() => import("@/components/common/ScrollInvitation").then(m => ({ default: m.ScrollInvitation })));
const SectionDivider = lazy(() => import("@/components/common/SectionDivider").then(m => ({ default: m.SectionDivider })));

const Index = () => {
  return (
    <div className="min-h-screen">
      <SEO />
      <SkipLink />
      <Navigation />
      
      <main id="main-content">
        {/* PASO 1: Entrada - Hero Flyer (protagonista) */}
        <HeroFlyer />
        
        {/* All below-the-fold sections lazy-loaded */}
        <Suspense fallback={null}>
          {/* PASO 2: Contexto */}
          <AnimatedOnView>
            <Diferenciales />
          </AnimatedOnView>
          
          <ScrollInvitation text="Descubre lo que te espera" targetId="maestria" />
          
          <AnimatedOnView>
            <Maestria />
          </AnimatedOnView>
          
          <SectionDivider variant="dots" className="my-4" />
          
          <AnimatedOnView>
            <EjesFormacion />
          </AnimatedOnView>
          
          <ScrollInvitation text="Así es el camino" targetId="como-funciona" />
          
          <AnimatedOnView>
            <ComoFunciona />
          </AnimatedOnView>
          
          <SectionDivider variant="gradient" className="my-6" />
          
          <AnimatedOnView>
            <Expertos />
          </AnimatedOnView>
          
          <ScrollInvitation text="Conoce los eventos" targetId="eventos" />
          
          <AnimatedOnView>
            <Eventos />
          </AnimatedOnView>
          
          {/* PASO 3: Validación - Social Proof */}
          <SectionDivider variant="dots" className="my-4" />
          
          <AnimatedOnView>
            <Testimonios />
          </AnimatedOnView>
          
          <AnimatedOnView>
            <QuienesSomos />
          </AnimatedOnView>
          
          <AnimatedOnView>
            <Galeria />
          </AnimatedOnView>
          
          {/* PASO 4: Decisión - CTA Final */}
          <CTAFinal />
          
          {/* PASO 5: Acción - Contacto/Inscripción */}
          <AnimatedOnView>
            <Contacto />
          </AnimatedOnView>
        </Suspense>
      </main>
      
      <Footer />
      
      {/* CTA Fijo Mobile - Funnel de Conversión */}
      <MobileFunnelCTA />
      
      {/* Atención al Cliente */}
      <WhatsAppButton />
      <AIAssistant />
    </div>
  );
};

export default Index;
