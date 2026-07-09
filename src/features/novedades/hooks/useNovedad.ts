import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Novedad, RelatedNovedad } from "../types";

export function useNovedad(slug: string | undefined) {
  const navigate = useNavigate();
  const [novedad, setNovedad] = useState<Novedad | null>(null);
  const [related, setRelated] = useState<RelatedNovedad[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await supabase
          .from("novedades")
          .select(`*, profiles!novedades_author_id_fkey(full_name)`)
          .eq("slug", slug)
          .eq("status", "published")
          .maybeSingle();
        if (error) throw error;
        if (!data) {
          if (!cancelled) navigate("/novedades");
          return;
        }
        if (cancelled) return;
        setNovedad(data as any);

        const { data: relData } = await supabase
          .from("novedades")
          .select("id, title, slug, image_url, published_at")
          .eq("status", "published")
          .neq("slug", slug)
          .order("published_at", { ascending: false })
          .limit(3);
        if (!cancelled) setRelated((relData as RelatedNovedad[]) || []);
      } catch (error: any) {
        console.error("Error loading novedad:", error);
        if (!cancelled) navigate("/novedades");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug, navigate]);

  return { novedad, related, loading };
}