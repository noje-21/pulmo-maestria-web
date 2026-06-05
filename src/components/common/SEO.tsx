import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

const SITE_NAME = "Maestría Latinoamericana en Circulación Pulmonar";
const SITE_URL = "https://www.maestriacp.com";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;

const DEFAULT_JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "EducationalOrganization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/favicon.ico`,
      description:
        "Programa académico latinoamericano de formación intensiva en circulación pulmonar e hipertensión pulmonar.",
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
      "@type": ["Course", "EducationalOccupationalProgram"],
      "@id": `${SITE_URL}/#course`,
      name: "Maestría Latinoamericana en Circulación Pulmonar 2026",
      description:
        "Programa académico intensivo de 12 días sobre circulación pulmonar e hipertensión pulmonar, dirigido a internistas, cardiólogos, reumatólogos y neumonólogos. 30 módulos y 131 horas académicas.",
      url: SITE_URL,
      inLanguage: "es",
      educationalLevel: "Postgrado",
      occupationalCategory: ["Cardiología", "Neumonología", "Medicina Interna", "Reumatología"],
      timeRequired: "P12D",
      programType: "Maestría",
      provider: { "@id": `${SITE_URL}/#organization` },
      hasCourseInstance: {
        "@type": "CourseInstance",
        courseMode: "Blended",
        startDate: "2026-11-02",
        endDate: "2026-11-16",
        location: {
          "@type": "Place",
          name: "Centro Gallego de Buenos Aires",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Buenos Aires",
            addressCountry: "AR",
          },
        },
        instructor: {
          "@type": "Person",
          name: "Dr. Adrián Lescano",
        },
      },
      offers: {
        "@type": "Offer",
        category: "Inscripción sin costo",
        availability: "https://schema.org/LimitedAvailability",
        url: `${SITE_URL}/#contacto`,
        price: "0",
        priceCurrency: "USD",
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
  breadcrumbs?: { name: string; url: string }[];
  noindex?: boolean;
}

export const SEO = ({
  title = "Maestría Latinoamericana en Circulación Pulmonar 2026",
  description = "Formación intensiva en circulación pulmonar dirigida a internistas, cardiólogos, reumatólogos y neumonólogos. Del 2 al 16 de noviembre 2026 en Buenos Aires.",
  keywords = "maestría, circulación pulmonar, hipertensión pulmonar, cardiología, Buenos Aires, medicina, formación médica",
  ogImage = DEFAULT_OG_IMAGE,
  canonicalUrl,
  ogType = "website",
  jsonLd,
  breadcrumbs,
  noindex = false,
}: SEOProps) => {
  const location = useLocation();
  const canonical = canonicalUrl ?? `${SITE_URL}${location.pathname}`;
  const ld = jsonLd || DEFAULT_JSON_LD;
  const breadcrumbLd = breadcrumbs && breadcrumbs.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbs.map((b, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: b.name,
          item: b.url.startsWith("http") ? b.url : `${SITE_URL}${b.url}`,
        })),
      }
    : null;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonical} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="es_AR" />
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      {/* JSON-LD */}
      <script type="application/ld+json">{JSON.stringify(ld)}</script>
      {breadcrumbLd && (
        <script type="application/ld+json">{JSON.stringify(breadcrumbLd)}</script>
      )}
    </Helmet>
  );
};