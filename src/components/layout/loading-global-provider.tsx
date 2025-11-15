"use client";

import { useLoadingGlobal } from "@/store/loading-store";
import LoadingContainer from "../loading-container";

export default function LoadingGlobalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading } = useLoadingGlobal();
  return <LoadingContainer isLoading={isLoading}>{children}</LoadingContainer>;
}
