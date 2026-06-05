import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ateneosData } from "@/data/ateneos";
import { mapAteneoRow } from "../helpers";
import type { Ateneo } from "../types";

export function useAteneo(id: string | undefined, isPreview: boolean) {
  const navigate = useNavigate();
  const [ateneo, setAteneo] = useState<Ateneo | null>(null);
  const [related, setRelated] = useState<Ateneo[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      try {
        let adminVerified = false;
        if (isPreview) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            const { data: roleData } = await supabase.rpc("is_admin", {
              check_user_id: session.user.id,
            });
            adminVerified = !!roleData;
            setIsAdmin(!!roleData);
          }
          if (!adminVerified) {
            navigate(`/ateneos/${id}`, { replace: true });
            return;
          }
        }

        let query = supabase.from("ateneos").select("*").eq("id", id);
        if (!isPreview || !adminVerified) {
          query = query.eq("status", "published");
        }

        const { data, error } = await query.single();

        if (data && !error) {
          setAteneo(mapAteneoRow(data));

          const { data: relData } = await supabase
            .from("ateneos")
            .select("*")
            .eq("status", "published")
            .neq("id", id)
            .order("fecha", { ascending: false })
            .limit(3);

          setRelated((relData || []).map(mapAteneoRow));
        } else {
          const mock = ateneosData.find((a) => a.id === id);
          setAteneo(mock || null);
          setRelated(ateneosData.filter((a) => a.id !== id).slice(0, 3));
        }
      } catch {
        const mock = ateneosData.find((a) => a.id === id);
        setAteneo(mock || null);
        setRelated(ateneosData.filter((a) => a.id !== id).slice(0, 3));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, isPreview, navigate]);

  return { ateneo, related, loading, isAdmin };
}