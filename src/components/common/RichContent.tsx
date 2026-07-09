import DOMPurify from "dompurify";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface RichContentProps {
  html: string;
  className?: string;
  size?: "sm" | "base" | "lg";
}

/**
 * Renders sanitized rich HTML content with consistent typographic styles.
 * Use for content produced by the RichTextEditor (Foro, Novedades, Ateneos).
 */
const RichContent = ({ html, className, size = "base" }: RichContentProps) => {
  const clean = useMemo(
    () =>
      DOMPurify.sanitize(html || "", {
        USE_PROFILES: { html: true },
        ADD_ATTR: ["target", "rel"],
        FORBID_TAGS: ["style", "script", "iframe", "form", "input", "textarea"],
        FORBID_ATTR: ["onerror", "onload", "onclick", "onmouseover"],
      }),
    [html]
  );

  const sizeClass =
    size === "sm"
      ? "prose-sm"
      : size === "lg"
        ? "prose-base sm:prose-lg"
        : "prose-base";

  return (
    <div
      className={cn(
        "prose dark:prose-invert max-w-none",
        sizeClass,
        // Semantic tokens (no hard-coded colors)
        "prose-headings:font-semibold prose-headings:text-foreground prose-headings:tracking-tight",
        "prose-h1:text-3xl prose-h1:mt-6 prose-h1:mb-4",
        "prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-3",
        "prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-2",
        "prose-p:text-foreground/90 prose-p:leading-relaxed",
        "prose-a:text-primary prose-a:font-medium hover:prose-a:underline prose-a:underline-offset-4",
        "prose-strong:text-foreground prose-strong:font-semibold",
        "prose-em:text-foreground/90",
        "prose-ul:my-4 prose-ol:my-4 prose-li:my-1 prose-li:marker:text-primary",
        "prose-blockquote:border-l-4 prose-blockquote:border-primary/60 prose-blockquote:bg-muted/40 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-blockquote:not-italic prose-blockquote:text-foreground/80",
        "prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none",
        "prose-pre:bg-muted prose-pre:text-foreground prose-pre:border prose-pre:border-border prose-pre:rounded-xl",
        "prose-img:rounded-xl prose-img:border prose-img:border-border/50 prose-img:my-6 prose-img:mx-auto",
        "prose-hr:border-border",
        "prose-table:text-sm prose-th:bg-muted/60 prose-th:font-semibold prose-th:text-foreground prose-th:p-2 prose-td:p-2 prose-td:border prose-td:border-border prose-th:border prose-th:border-border",
        className
      )}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
};

export default RichContent;

/** Utility: strip HTML to plain text (for excerpts, SEO descriptions). */
export const htmlToPlainText = (html: string): string => {
  if (!html) return "";
  const clean = DOMPurify.sanitize(html, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
  const decoded =
    typeof document !== "undefined"
      ? (() => {
          const el = document.createElement("textarea");
          el.innerHTML = clean;
          return el.value;
        })()
      : clean.replace(/&[a-z#0-9]+;/gi, " ");
  return decoded.replace(/\s+/g, " ").trim();
};