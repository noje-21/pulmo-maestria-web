import { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Clock, Reply, ChevronDown, ChevronUp, Send } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { getInitials } from "../helpers";
import type { ForumComment } from "../types";

interface Props {
  comment: ForumComment;
  depth?: number;
  user: any;
  replyingTo: string | null;
  setReplyingTo: (id: string | null) => void;
  expandedReplies: Set<string>;
  toggleReplies: (id: string) => void;
  submitting: boolean;
  onSubmitReply: (parentId: string, content: string) => Promise<boolean> | boolean;
}

function CommentItemImpl({
  comment,
  depth = 0,
  user,
  replyingTo,
  setReplyingTo,
  expandedReplies,
  toggleReplies,
  submitting,
  onSubmitReply,
}: Props) {
  const hasReplies = comment.replies && comment.replies.length > 0;
  const isExpanded = expandedReplies.has(comment.id);
  const [replyText, setReplyText] = useState("");
  const isReplying = replyingTo === comment.id;

  const handleReply = async () => {
    const ok = await onSubmitReply(comment.id, replyText);
    if (ok) setReplyText("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={depth > 0 ? "ml-4 sm:ml-8 mt-3" : "mt-4"}
    >
      <div className={`relative bg-muted/30 rounded-xl p-4 sm:p-5 ${depth > 0 ? "border-l-2 border-primary/20" : ""}`}>
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="flex-shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-primary font-semibold text-xs sm:text-sm">
              {getInitials(comment.profiles?.full_name || "")}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="font-medium text-sm sm:text-base">
                {comment.profiles?.full_name || "Usuario"}
              </span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: es })}
              </span>
            </div>

            <p className="text-sm sm:text-base text-foreground/90 whitespace-pre-wrap leading-relaxed mb-3">
              {comment.content}
            </p>

            <div className="flex items-center gap-4">
              {user && (
                <button
                  onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                  className="text-xs sm:text-sm text-muted-foreground hover:text-primary font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Reply className="w-3.5 h-3.5" />
                  {replyingTo === comment.id ? "Cancelar" : "Responder"}
                </button>
              )}
              {hasReplies && (
                <button
                  onClick={() => toggleReplies(comment.id)}
                  className="text-xs sm:text-sm text-muted-foreground hover:text-primary font-medium flex items-center gap-1.5 transition-colors"
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="w-3.5 h-3.5" />
                      Ocultar respuestas
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-3.5 h-3.5" />
                      Ver {comment.replies!.length} respuesta{comment.replies!.length > 1 ? "s" : ""}
                    </>
                  )}
                </button>
              )}
            </div>

            <AnimatePresence>
              {replyingTo === comment.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 space-y-3"
                >
                  <Textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="¿Qué opinas sobre esto?"
                    className="min-h-[80px] resize-none rounded-xl"
                  />
                  <Button
                    onClick={handleReply}
                    size="sm"
                    disabled={submitting || !replyText.trim()}
                    className="gap-2"
                  >
                    <Send className="w-4 h-4" />
                    {submitting ? "Publicando..." : "Responder"}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {hasReplies && isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            {comment.replies!.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                depth={depth + 1}
                user={user}
                replyingTo={replyingTo}
                setReplyingTo={setReplyingTo}
                expandedReplies={expandedReplies}
                toggleReplies={toggleReplies}
                submitting={submitting}
                onSubmitReply={onSubmitReply}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

const CommentItem = memo(CommentItemImpl);
export default CommentItem;