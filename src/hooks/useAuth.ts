import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

const AUTH_KEY = ["auth-session"] as const;

/**
 * Global auth hook backed by React Query.
 *
 * - Single source of truth for the current Supabase session across the app.
 * - `onAuthStateChange` pushes updates into the cache and invalidates the
 *   queries that depend on the current user (admin flag, reactions, ...).
 * - Reads the initial session from local storage via `getSession()` — no
 *   network round-trip on mount.
 */
export function useAuth() {
  const qc = useQueryClient();

  const query = useQuery<Session | null>({
    queryKey: AUTH_KEY,
    staleTime: Infinity,
    gcTime: Infinity,
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session ?? null;
    },
  });

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      qc.setQueryData(AUTH_KEY, session ?? null);
      // Refresh anything that depends on the current user.
      qc.invalidateQueries({ queryKey: ["is-admin"] });
      qc.invalidateQueries({ queryKey: ["forum-user-reactions"] });
    });
    return () => subscription.unsubscribe();
  }, [qc]);

  const session = query.data ?? null;
  return {
    session,
    user: session?.user ?? null,
    loading: query.isLoading,
  };
}