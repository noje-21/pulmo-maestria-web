export interface ImageData {
  src: string;
  alt: string;
  category?: string;
  flyerId?: string;
}

export interface YearGallery {
  year: number;
  title: string;
  subtitle: string;
  description: string;
  hero: string;
  heroMobile?: string;
  images: ImageData[];
}
