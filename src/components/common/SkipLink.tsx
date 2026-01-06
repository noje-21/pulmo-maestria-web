import { cn } from "@/lib/utils";

interface SkipLinkProps {
  href?: string;
  children?: React.ReactNode;
}

export const SkipLink = ({ 
  href = "#main-content", 
  children = "Saltar al contenido principal" 
}: SkipLinkProps) => {
  return (
    <a
      href={href}
      className={cn(
        "sr-only focus:not-sr-only",
        "focus:fixed focus:top-4 focus:left-4 focus:z-[100]",
        "focus:px-4 focus:py-2 focus:rounded-lg",
        "focus:bg-primary focus:text-primary-foreground",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        "font-medium text-sm transition-all"
      )}
    >
      {children}
    </a>
  );
};
