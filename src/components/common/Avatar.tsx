import { cn } from "@/lib/utils";

interface AvatarProps {
  name: string;
  image?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  sm: "avatar-sm",
  md: "avatar-md",
  lg: "avatar-lg",
  xl: "avatar-xl"
};

const imageSizes = {
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-12 h-12",
  xl: "w-16 h-16"
};

export const Avatar = ({ name, image, size = "md", className }: AvatarProps) => {
  const initials = name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U';

  if (image) {
    return (
      <img
        src={image}
        alt={name}
        className={cn(
          imageSizes[size],
          "rounded-full object-cover border-2 border-border/50",
          className
        )}
        loading="lazy"
      />
    );
  }

  return (
    <div className={cn("avatar-base", sizeClasses[size], className)}>
      {initials}
    </div>
  );
};
