import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { ForumPost, SortBy } from "../types";

interface Params {
  searchQuery: string;
  categoryFilter: string;
  authorFilter: string;
  sortBy: SortBy;
}

export function useForumPosts({ searchQuery, categoryFilter, authorFilter, sortBy }: Params) {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        let query = supabase
          .from("forum_posts")
          .select(`
            *,
            profiles!forum_posts_user_id_fkey(full_name),
            forum_comments!post_id(count)
          `)
          .eq("status", "published");

        if (searchQuery) {
          query = query.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`);
        }
        if (categoryFilter !== "all") {
          query = query.eq("category", categoryFilter as any);
        }
        if (authorFilter !== "all") {
          query = query.eq("user_id", authorFilter);
        }

        if (sortBy === "popular") {
          query = query.order("views_count", { ascending: false });
        } else if (sortBy === "commented") {
          query = query.order("reactions_count", { ascending: false });
        } else {
          query = query
            .order("featured", { ascending: false })
            .order("is_pinned", { ascending: false })
            .order("created_at", { ascending: false });
        }

        const { data, error } = await query;
        if (error) throw error;
        if (!cancelled) setPosts((data as any) || []);
      } catch (error: any) {
        console.error("Error loading posts:", error);
        if (!cancelled) toast.error("No pudimos cargar las publicaciones. Intenta refrescar.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [searchQuery, categoryFilter, authorFilter, sortBy]);

  return { posts, loading };
}

export function useForumAuthors() {
  const [authors, setAuthors] = useState<{ id: string; name: string }[]>([]);
  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("user_id, full_name")
          .order("full_name");
        if (error) throw error;
        setAuthors(data?.map((p) => ({ id: p.user_id, name: p.full_name })) || []);
      } catch (error: any) {
        console.error("Error loading authors:", error);
      }
    })();
  }, []);
  return authors;
}

export function useIsAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .single();
        setIsAdmin(data?.role === "admin");
      }
    })();
  }, []);
  return isAdmin;
}