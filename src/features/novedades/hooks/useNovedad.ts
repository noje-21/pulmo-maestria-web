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
    (async () => {
      try {
        const { data, error } = await supabase
          .from("novedades")
          .select(`*, profiles!novedades_author_id_fkey(full_name)`)
          .eq("slug", slug)
          .eq("status", "published")
          .single();
        if (error) throw error;
        setNovedad(data as any);

        const { data: relData } = await supabase
          .from("novedades")
          .select("id, title, slug, image_url, published_at")
          .eq("status", "published")
          .neq("slug", slug)
          .order("published_at", { ascending: false })
          .limit(3);
        setRelated((relData as RelatedNovedad[]) || []);
      } catch (error: any) {
        console.error("Error loading novedad:", error);
        navigate("/novedades");
      } finally {
        setLoading(false);
      }
    })();
  }, [slug, navigate]);

  return { novedad, related, loading };
}