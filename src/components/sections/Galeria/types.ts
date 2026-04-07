export interface ImageData {
  src: string;
  alt: string;
  category?: string;
  flyerId?: string;
}

export interface SeparatorSlide {
  type: "separator";
  year: number;
  title: string;
}

export type MasterSlide = (ImageData & { type?: "image" }) | SeparatorSlide;

export interface YearGallery {
  year: number;
  title: string;
  subtitle: string;
  description: string;
  hero: string;
  heroMobile?: string;
  images: ImageData[];
}
