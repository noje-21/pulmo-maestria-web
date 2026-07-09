import { useEffect, useMemo, useState } from "react";
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import type { ForumPost, SortBy } from "../types";

export const FORUM_PAGE_SIZE = 20;

/** Strip PostgREST `.or()` metacharacters so user input can't break the filter. */
const sanitizeIlike = (raw: string) =>
  raw.replace(/[,()%*]/g, " ").replace(/\s+/g, " ").trim();

/** Simple debounce for the search box so we don't fire a query per keystroke. */
export function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

interface Params {
  searchQuery: string;
  categoryFilter: string;
  authorFilter: string;
  sortBy: SortBy;
}

interface Page {
  posts: ForumPost[];
  nextPage: number | null;
}

async function fetchForumPage(
  { searchQuery, categoryFilter, authorFilter, sortBy }: Params,
  page: number,
): Promise<Page> {
  const from = page * FORUM_PAGE_SIZE;
  const to = from + FORUM_PAGE_SIZE - 1;

  let query = supabase
    .from("forum_posts")
    .select(`*, profiles!forum_posts_user_id_fkey(full_name)`)
    .eq("status", "published")
    .range(from, to);

  const safe = sanitizeIlike(searchQuery);
  if (safe) {
    query = query.or(`title.ilike.%${safe}%,content.ilike.%${safe}%`);
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
    query = query.order("comments_count", { ascending: false });
  } else {
    query = query
      .order("featured", { ascending: false })
      .order("is_pinned", { ascending: false })
      .order("created_at", { ascending: false });
  }

  const { data, error } = await query;
  if (error) throw error;

  const posts = (data as any as ForumPost[]) || [];
  return {
    posts,
    nextPage: posts.length < FORUM_PAGE_SIZE ? null : page + 1,
  };
}

/**
 * Paginated forum feed backed by React Query. Also batches the "did I react?"
 * lookup for every post on the current page into a single RPC call, killing
 * the N+1 that used to fire from each ReactionButton.
 */
export function useForumPosts(params: Params) {
  const { user } = useAuth();
  const query = useInfiniteQuery({
    queryKey: ["forum-posts", params],
    queryFn: ({ pageParam = 0 }) => fetchForumPage(params, pageParam as number),
    getNextPageParam: (last) => last.nextPage,
    initialPageParam: 0,
  });

  useEffect(() => {
    if (query.error) {
      console.error("Error loading posts:", query.error);
      toast.error("No pudimos cargar las publicaciones. Intenta refrescar.");
    }
  }, [query.error]);

  const posts = useMemo(
    () => query.data?.pages.flatMap((p) => p.posts) ?? [],
    [query.data],
  );

  const postIds = useMemo(() => posts.map((p) => p.id), [posts]);

  const reactionsQuery = useQuery({
    queryKey: ["forum-user-reactions", user?.id ?? null, postIds],
    enabled: !!user && postIds.length > 0,
    staleTime: 30_000,
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_user_reactions", {
        _post_type: "forum",
        _post_ids: postIds,
      });
      if (error) throw error;
      return new Set<string>((data as string[]) ?? []);
    },
  });

  return {
    posts,
    loading: query.isLoading,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: !!query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
    reactedIds: reactionsQuery.data ?? new Set<string>(),
  };
}

export function useForumAuthors() {
  const { data } = useQuery({
    queryKey: ["forum-authors"],
    staleTime: 5 * 60_000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("user_id, full_name")
        .order("full_name");
      if (error) throw error;
      return data?.map((p) => ({ id: p.user_id, name: p.full_name })) || [];
    },
  });
  return data ?? [];
}

export function useIsAdmin() {
  const { user } = useAuth();
  const { data } = useQuery({
    queryKey: ["is-admin", user?.id ?? null],
    enabled: !!user,
    staleTime: 5 * 60_000,
    queryFn: async () => {
      if (!user) return false;
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle();
      if (error) return false;
      return data?.role === "admin";
    },
  });
  return !!data;
}

/** Utility to invalidate the forum list after a mutation. */
export function useInvalidateForum() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: ["forum-posts"] });
}