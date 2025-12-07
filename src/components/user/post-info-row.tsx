import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type PostInfoRowProps = {
  icon: LucideIcon;
  children: React.ReactNode;
  className?: string;
};

/**
 * Reusable component for displaying a row of post information with an icon.
 * Used in both popup and modal for consistent styling.
 */
export function PostInfoRow({
  icon: Icon,
  children,
  className,
}: PostInfoRowProps) {
  return (
    <div
      className={cn("flex items-center gap-2 text-muted-foreground", className)}
    >
      <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
      <span className="text-sm">{children}</span>
    </div>
  );
}
