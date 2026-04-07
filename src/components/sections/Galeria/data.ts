import { gallery2025 } from "./data/gallery2025";
import { gallery2024 } from "./data/gallery2024";
import { gallery2023 } from "./data/gallery2023";
import { gallery2022 } from "./data/gallery2022";
import type { YearGallery, MasterSlide } from "./types";

/** Re-export individual galleries for independent usage */
export { gallery2025, gallery2024, gallery2023, gallery2022 };

/** Default combined collection — each entry is an independent copy */
export const galeriasPorAño: YearGallery[] = [
  gallery2025,
  gallery2024,
  gallery2023,
  gallery2022,
];

/** Unified master slides with separator slides between year groups */
export const getMasterSlides = (galleries: YearGallery[]): MasterSlide[] =>
  galleries.flatMap((g) => {
    const images: MasterSlide[] = g.images.map((img) => ({
      ...img,
      type: "image" as const,
      flyerId: `flyer-${g.year}`,
    }));
    const separator: MasterSlide = { type: "separator", year: g.year, title: g.title };
    return [separator, ...images];
  });
