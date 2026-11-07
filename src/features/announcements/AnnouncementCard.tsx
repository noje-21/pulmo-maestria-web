import { X, ArrowRight } from "lucide-react";

export interface AnnouncementView {
  title: string;
  description: string;
  image_url: string | null;
  cta_label: string;
  cta_url: string;
}

interface Props {
  announcement: AnnouncementView;
  onClose: () => void;
  onCta?: () => void;
}

/** Tarjeta visual del anuncio; compartida por el popup público y la vista previa del admin. */
export default function AnnouncementCard({ announcement, onClose, onCta }: Props) {
  const external = /^https?:\/\//i.test(announcement.cta_url);
  return (
    <div className="relative w-full max-w-[min(92vw,820px)] max-h-[90dvh] overflow-hidden rounded-2xl border border-primary-foreground/10 bg-[hsl(var(--campaign-ink,222_70%_8%))] text-primary-foreground shadow-2xl grid sm:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <button
        type="button"
        onClick={onClose}
        aria-label="Cerrar anuncio"
        className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full bg-background/20 text-primary-foreground backdrop-blur hover:bg-background/40 transition-colors"
      >
        <X className="h-5 w-5" />
      </button>
      {announcement.image_url && (
        <div className="relative bg-primary/30 max-h-[30dvh] sm:max-h-none overflow-hidden">
          <img
            src={announcement.image_url}
            alt={announcement.title}
            className="h-full w-full object-cover object-top"
            decoding="async"
          />
        </div>
      )}
      <div className="flex flex-col justify-center gap-3 sm:gap-4 p-6 sm:p-8 overflow-y-auto">
        <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-accent">Anuncio MLCP</span>
        <div className="h-px w-12 bg-accent" />
        <h2 className="font-serif text-2xl sm:text-3xl leading-tight !text-primary-foreground">{announcement.title}</h2>
        {announcement.description && (
          <p className="text-sm sm:text-base text-primary-foreground/75 leading-relaxed">{announcement.description}</p>
        )}
        <a
          href={announcement.cta_url}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          onClick={onCta}
          className="mt-2 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-accent px-6 text-sm font-bold uppercase tracking-wider text-accent-foreground shadow-lg hover:brightness-110 transition"
        >
          {announcement.cta_label} <ArrowRight className="h-4 w-4" />
        </a>
        <button type="button" onClick={onClose} className="text-xs text-primary-foreground/60 hover:text-primary-foreground underline-offset-4 hover:underline">
          Ahora no
        </button>
      </div>
    </div>
  );
}
