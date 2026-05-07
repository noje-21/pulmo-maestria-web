import { useEffect } from "react";

const SITE_NAME = "Maestría Latinoamericana en Circulación Pulmonar";
const SITE_URL = "https://www.maestriacp.com";

const DEFAULT_JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "EducationalOrganization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/favicon.ico`,
      sameAs: [
        "https://www.facebook.com/share/16s5MUKG3C/",
        "https://instagram.com/magisterenhipertensionpulmonar",
        "https://www.linkedin.com/in/hipertension-pulmonar-655a43253",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+54-9-11-5906-4234",
        contactType: "customer service",
        availableLanguage: ["Spanish"],
      },
    },
    {
      "@type": "EducationEvent",
      name: "Maestría Latinoamericana en Circulación Pulmonar 2026",
      startDate: "2026-11-02",
      endDate: "2026-11-16",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      eventStatus: "https://schema.org/EventScheduled",
      location: {
        "@type": "Place",
        name: "Centro Gallego de Buenos Aires",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Buenos Aires",
          addressCountry: "AR",
        },
      },
      organizer: {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
      },
      description:
        "Formación intensiva en circulación pulmonar dirigida a internistas, cardiólogos, reumatólogos y neumonólogos.",
      maximumAttendeeCapacity: 15,
      inLanguage: "es",
      offers: {
        "@type": "Offer",
        availability: "https://schema.org/LimitedAvailability",
        url: `${SITE_URL}/#contacto`,
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      inLanguage: "es",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  ],
};

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonicalUrl?: string;
  ogType?: string;
  jsonLd?: Record<string, unknown>;
}

export const SEO = ({
  title = "Maestría Latinoamericana en Circulación Pulmonar 2026",
  description = "Formación intensiva en circulación pulmonar dirigida a internistas, cardiólogos, reumatólogos y neumonólogos. Del 2 al 16 de noviembre 2026 en Buenos Aires.",
  keywords = "maestría, circulación pulmonar, hipertensión pulmonar, cardiología, Buenos Aires, medicina, formación médica",
  ogImage = `${SITE_URL}/og-image.jpg`,
  canonicalUrl = `${SITE_URL}/`,
  ogType = "website",
  jsonLd,
}: SEOProps) => {
  useEffect(() => {
    // Update title
    document.title = title;

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, attribute = "name") => {
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      if (element) {
        element.setAttribute("content", content);
      } else {
        element = document.createElement("meta");
        element.setAttribute(attribute, name);
        element.setAttribute("content", content);
        document.head.appendChild(element);
      }
    };

    // Standard meta tags
    updateMetaTag("description", description);
    updateMetaTag("keywords", keywords);

    // Open Graph tags
    updateMetaTag("og:title", title, "property");
    updateMetaTag("og:description", description, "property");
    updateMetaTag("og:image", ogImage, "property");
    updateMetaTag("og:url", canonicalUrl, "property");
    updateMetaTag("og:type", ogType, "property");
    updateMetaTag("og:site_name", SITE_NAME, "property");
    updateMetaTag("og:locale", "es_AR", "property");

    // Twitter tags
    updateMetaTag("twitter:card", "summary_large_image");
    updateMetaTag("twitter:title", title);
    updateMetaTag("twitter:description", description);
    updateMetaTag("twitter:image", ogImage);

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (canonical) {
      canonical.href = canonicalUrl;
    } else {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      canonical.href = canonicalUrl;
      document.head.appendChild(canonical);
    }

    const ld = jsonLd || DEFAULT_JSON_LD;
    let script = document.querySelector('script[data-seo-jsonld]') as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute("data-seo-jsonld", "");
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(ld);
  }, [title, description, keywords, ogImage, canonicalUrl, ogType, jsonLd]);

  return null;
};