import { getTranslations } from "next-intl/server";

export default async function DashboardPage() {
  const t = await getTranslations();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">{t("admin.sidebar.dashboard")}</h1>
      <p className="text-muted-foreground">{t("admin.dashboard.welcome")}</p>
    </div>
  );
}
