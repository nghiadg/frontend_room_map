"use client";

import { FileText } from "lucide-react";
import { useTranslations } from "next-intl";

type EmptyPostsStateProps = {
  hasFilters?: boolean;
};

/**
 * Empty state component for posts table
 * Shows different messages based on whether filters are applied
 */
export function EmptyPostsState({ hasFilters = false }: EmptyPostsStateProps) {
  const t = useTranslations();

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-6">
        <FileText className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">
        {hasFilters
          ? t("admin.posts.emptyFiltered.title")
          : t("admin.posts.emptyState.title")}
      </h3>
      <p className="text-muted-foreground max-w-sm">
        {hasFilters
          ? t("admin.posts.emptyFiltered.description")
          : t("admin.posts.emptyState.description")}
      </p>
    </div>
  );
}
