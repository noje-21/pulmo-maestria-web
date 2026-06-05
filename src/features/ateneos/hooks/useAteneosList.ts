import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ateneosData } from "@/data/ateneos";
import { mapAteneoRow } from "../helpers";
import type { Ateneo } from "../types";

export function useAteneosList() {
  const [ateneos, setAteneos] = useState<Ateneo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase
          .from("ateneos")
          .select("*")
          .eq("status", "published")
          .order("fecha", { ascending: false });
        if (error) throw error;
        if (data && data.length > 0) {
          setAteneos(data.map(mapAteneoRow));
        } else {
          setAteneos(ateneosData);
        }
      } catch {
        setAteneos(ateneosData);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { ateneos, loading };
}