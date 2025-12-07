"use client";

import { Users } from "lucide-react";
import { useTranslations } from "next-intl";

type EmptyUsersStateProps = {
  hasFilters?: boolean;
};

/**
 * Empty state component for users table
 * Shows different messages based on whether filters are applied
 */
export function EmptyUsersState({ hasFilters = false }: EmptyUsersStateProps) {
  const t = useTranslations();

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-6">
        <Users className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">
        {hasFilters
          ? t("admin.users.emptyFiltered.title")
          : t("admin.users.emptyState.title")}
      </h3>
      <p className="text-muted-foreground max-w-sm">
        {hasFilters
          ? t("admin.users.emptyFiltered.description")
          : t("admin.users.emptyState.description")}
      </p>
    </div>
  );
}
