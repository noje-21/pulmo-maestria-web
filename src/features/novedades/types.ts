export interface Novedad {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  image_url?: string;
  published_at: string;
  created_at: string;
  author_id: string;
  reactions_count: number;
  profiles?: {
    full_name: string;
  };
}

export interface RelatedNovedad {
  id: string;
  title: string;
  slug: string;
  image_url?: string;
  published_at: string;
}