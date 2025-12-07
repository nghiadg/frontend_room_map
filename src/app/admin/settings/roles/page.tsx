"use client";

import { useTranslations } from "next-intl";
import { RolesGrid } from "./components/roles-grid";

export default function RolesPage() {
  const t = useTranslations();

  return (
    <div className="flex flex-col h-full">
      <div className="pb-6 shrink-0">
        <h1 className="text-2xl font-bold">
          {t("admin.settings.roles.title")}
        </h1>
        <p className="text-muted-foreground">
          {t("admin.settings.roles.description")}
        </p>
      </div>

      <RolesGrid />
    </div>
  );
}
