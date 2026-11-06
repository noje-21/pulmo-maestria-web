import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import AnnouncementCard from "./AnnouncementCard";
import { markSeen, readSeen, shouldShowAnnouncement, type AnnouncementFrequency } from "./frequency";

interface Announcement {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  cta_label: string;
  cta_url: string;
  delay_seconds: number;
  frequency: AnnouncementFrequency;
}

/** Popup de anuncios institucionales en la página principal. Carga diferida, no bloquea el render. */
export default function AnnouncementPopup() {
  const [ann, setAnn] = useState<Announcement | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    let cancelled = false;
    const load = async () => {
      const { data } = await supabase
        .from("announcements")
        .select("id,title,description,image_url,cta_label,cta_url,delay_seconds,frequency,is_active,starts_at,ends_at")
        .eq("is_active", true)
        .order("priority", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(10);
      if (cancelled || !data) return;
      const now = Date.now();
      const next = data.find((a) => {
        if (a.starts_at && new Date(a.starts_at).getTime() > now) return false;
        if (a.ends_at && new Date(a.ends_at).getTime() <= now) return false;
        const s = readSeen(a.id);
        return shouldShowAnnouncement(a.frequency as AnnouncementFrequency, s.lastSeenAt, s.seenThisSession, now);
      });
      if (!next) return;
      const preload = new Image();
      if (next.image_url) preload.src = next.image_url;
      timer = setTimeout(() => {
        if (cancelled) return;
        setAnn(next as Announcement);
        setOpen(true);
        markSeen(next.id);
      }, Math.max(0, next.delay_seconds) * 1000);
    };
    // Espera a que la página esté inactiva para no competir con la carga inicial
    const idle = (window as Window & { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback;
    if (idle) idle(() => void load());
    else setTimeout(() => void load(), 1200);
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <AnimatePresence>
      {open && ann && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={ann.title}
          className="fixed inset-0 z-[120] flex items-center justify-center bg-background/70 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="flex w-full justify-center"
          >
            <AnnouncementCard announcement={ann} onClose={() => setOpen(false)} onCta={() => setOpen(false)} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
