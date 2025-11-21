import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonicalUrl?: string;
}

export const SEO = ({
  title = "Maestría Latinoamericana en Circulación Pulmonar 2025",
  description = "Formación intensiva en circulación pulmonar dirigida a internistas, cardiólogos, reumatólogos y neumonólogos. Del 3 al 15 de noviembre 2025 en Buenos Aires.",
  keywords = "maestría, circulación pulmonar, hipertensión pulmonar, cardiología, Buenos Aires, medicina, formación médica",
  ogImage = "https://lovable.dev/opengraph-image-p98pqg.png",
  canonicalUrl = "https://www.maestriacp.com/"
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

    // Twitter tags
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
  }, [title, description, keywords, ogImage, canonicalUrl]);

  return null;
};
