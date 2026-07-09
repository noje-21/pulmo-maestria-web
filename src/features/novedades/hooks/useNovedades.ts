import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Novedad } from "../types";

export function useNovedadesList(searchQuery: string, authorFilter: string) {
  const [novedades, setNovedades] = useState<Novedad[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        let query = supabase
          .from("novedades")
          .select(`*, profiles!novedades_author_id_fkey(full_name)`)
          .eq("status", "published")
          .order("published_at", { ascending: false });
        if (searchQuery) {
          query = query.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%,excerpt.ilike.%${searchQuery}%`);
        }
        if (authorFilter !== "all") {
          query = query.eq("author_id", authorFilter);
        }
        const { data, error } = await query;
        if (error) throw error;
        if (!cancelled) setNovedades((data as any) || []);
      } catch (error: any) {
        console.error("Error loading novedades:", error);
        if (!cancelled) toast.error("No pudimos cargar las novedades. Intenta de nuevo.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [searchQuery, authorFilter]);

  return { novedades, loading };
}

export function useNovedadesAuthors() {
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