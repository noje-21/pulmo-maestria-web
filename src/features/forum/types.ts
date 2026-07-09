export interface ForumPost {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  category: string;
  image_url?: string;
  created_at: string;
  updated_at?: string;
  views_count: number;
  reactions_count?: number;
  is_pinned: boolean;
  featured?: boolean;
  status?: string;
  user_id: string;
  comments_count?: number;
  profiles?: {
    full_name: string;
  };
  forum_comments?: any[];
}

export interface ForumComment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  parent_id: string | null;
  profiles?: {
    full_name: string;
  };
  replies?: ForumComment[];
}

export type SortBy = "recent" | "popular" | "commented";