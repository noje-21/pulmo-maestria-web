import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ReactionButtonProps {
  postType: "forum" | "novedad";
  postId: string;
  initialCount?: number;
}

export default function ReactionButton({ postType, postId, initialCount = 0 }: ReactionButtonProps) {
  const [hasReacted, setHasReacted] = useState(false);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkUserReaction();
  }, [postId]);

  const checkUserReaction = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("post_reactions")
        .select("id")
        .eq("user_id", user.id)
        .eq("post_type", postType)
        .eq("post_id", postId)
        .single();

      setHasReacted(!!data);
    } catch (error) {
      // Usuario no ha reaccionado
    }
  };

  const handleReaction = async () => {
    if (loading) return;

    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Debes iniciar sesión para reaccionar");
        return;
      }

      if (hasReacted) {
        // Eliminar reacción
        const { error } = await supabase
          .from("post_reactions")
          .delete()
          .eq("user_id", user.id)
          .eq("post_type", postType)
          .eq("post_id", postId);

        if (error) throw error;

        setHasReacted(false);
        setCount(prev => Math.max(0, prev - 1));
        toast.success("Reacción eliminada");
      } else {
        // Agregar reacción
        const { error } = await supabase
          .from("post_reactions")
          .insert({
            user_id: user.id,
            post_type: postType,
            post_id: postId,
            reaction_type: "like"
          });

        if (error) throw error;

        setHasReacted(true);
        setCount(prev => prev + 1);
        toast.success("¡Te gusta esta publicación!");
      }
    } catch (error: any) {
      toast.error("Error al procesar la reacción");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={handleReaction}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
        hasReacted
          ? "bg-primary/20 text-primary"
          : "bg-muted hover:bg-muted/80"
      }`}
    >
      <motion.div
        animate={hasReacted ? { scale: [1, 1.3, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        <Heart
          className={`w-5 h-5 ${hasReacted ? "fill-current" : ""}`}
        />
      </motion.div>
      <span className="font-medium">{count}</span>
    </motion.button>
  );
}
