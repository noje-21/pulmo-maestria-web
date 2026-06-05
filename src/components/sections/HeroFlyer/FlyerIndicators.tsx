import { memo } from "react";
import { cn } from "@/lib/utils";

/* ─── Progress dots ─── */
export const FlyerIndicators = memo(function FlyerIndicators({
  total,
  current,
  onSelect,
}: {
  total: number;
  current: number;
  onSelect: (i: number) => void;
}) {
  return (
    <div className="flex items-center gap-2 justify-center mt-3">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          aria-label={`Video ${i + 1}`}
          className={cn(
            "rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-accent",
            "transition-[width,height,background-color,box-shadow] duration-500",
            i === current
              ? "w-8 h-2.5 bg-accent shadow-[0_0_12px_hsl(var(--accent)/0.5)]"
              : "w-2 h-2 bg-white/30 hover:bg-white/60"
          )}
        />
      ))}
    </div>
  );
});