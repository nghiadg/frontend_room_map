import { cn } from "@/lib/utils";
import { LoaderIcon } from "lucide-react";

type LoadingContainerProps = {
  children: React.ReactNode;
  isLoading: boolean;
  className?: string;
};

export default function LoadingContainer({
  children,
  isLoading = false,
  className,
}: LoadingContainerProps) {
  return (
    <div
      className={cn("relative", className, {
        "pointer-events-none": isLoading,
        "cursor-wait": isLoading,
        "bg-muted/50": isLoading,
      })}
    >
      {isLoading ? (
        <>
          <LoaderIcon
            role="status"
            aria-label="Loading"
            className="size-4 animate-spin absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
          />
          <div className="absolute inset-0 bg-muted/50 z-10" />
        </>
      ) : null}
      {children}
    </div>
  );
}
