import { useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { SEO } from "@/components/common/SEO";
import { ContactForm } from "@/components/sections/Contacto/ContactForm";
import { ContactInfo } from "@/components/sections/Contacto/ContactInfo";
import { useContactForm } from "@/components/sections/Contacto/useContactForm";
import { CampaignHero } from "@/components/campaign/CampaignHero";
import { CampaignSections } from "@/components/campaign/CampaignSections";
import { CampaignAteneos } from "@/components/campaign/CampaignAteneos";
import { CampaignFooter } from "@/components/campaign/CampaignFooter";
import { CAMPAIGN_META, buildWhatsAppLink } from "@/components/campaign/campaignData";
import { OG_IMAGES, SITE_URL } from "@/lib/ogImages";

/**
 * Landing de campaña (/inscripcion).
 * Página aislada: no usa la navegación del sitio ni aparece en menús.
 * Conserva los parámetros UTM de la URL y los adjunta al mensaje de WhatsApp.
 */
const CampaignLanding = () => {
  const { search } = useLocation();
  const api = useContactForm();
  const whatsappHref = useMemo(() => buildWhatsAppLink(search), [search]);

  const scrollToForm = useCallback(() => {
    document.getElementById("solicitud")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={CAMPAIGN_META.title}
        description={CAMPAIGN_META.description}
        canonicalUrl={`${SITE_URL}/inscripcion`}
        ogImage={OG_IMAGES.inscripcion}
        keywords="maestría circulación pulmonar, hipertensión pulmonar, formación médica, inscripción 2026, Buenos Aires"
      />

      <main>
        <CampaignHero whatsappHref={whatsappHref} onPrimary={scrollToForm} />
        <CampaignSections whatsappHref={whatsappHref} onPrimary={scrollToForm} />
        <CampaignAteneos />

        {/* FORMULARIO / CTA FINAL — reutiliza el flujo de contacto existente */}
        <section id="solicitud" className="scroll-mt-4 bg-muted/40 px-5 py-14 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold text-foreground sm:text-4xl">
                Solicita tu inscripción
              </h2>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                Completa el formulario con tus datos y adjunta tu currículum. El equipo académico te
                responderá por email o WhatsApp.
              </p>
            </div>

            <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:gap-12">
              <ContactForm api={api} />
              <ContactInfo />
            </div>
          </div>
        </section>
      </main>

      <CampaignFooter />
    </div>
  );
};

export default CampaignLanding;
