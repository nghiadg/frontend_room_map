"use client";

import { useLoadingGlobal } from "@/store/loading-store";
import { LoaderIcon } from "lucide-react";

export default function LoadingGlobalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading } = useLoadingGlobal();
  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <LoaderIcon className="size-8 animate-spin" />
        </div>
      )}
      {children}
    </>
  );
}
