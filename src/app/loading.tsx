import { Loader2 } from "lucide-react";

/**
 * Global loading component for all pages
 * Shown during navigation while server components are rendering
 */
export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Đang tải...</p>
      </div>
    </div>
  );
}
