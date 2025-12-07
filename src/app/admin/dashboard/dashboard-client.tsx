"use client";

import { useTranslations } from "next-intl";
import { FileText, CheckCircle, XCircle, Users } from "lucide-react";
import { StatsCard } from "./components/stats-card";
import { PostsTrendChart } from "./components/posts-trend-chart";
import { PostsByPropertyTypeChart } from "./components/posts-by-property-type-chart";
import { PostsStatusChart } from "./components/posts-status-chart";
import { TopDistrictsChart } from "./components/top-districts-chart";
import { useDashboardOverview } from "./hooks/use-dashboard-overview";

export function DashboardClient() {
  const t = useTranslations();
  const { data: overview, isLoading } = useDashboardOverview();

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold">{t("admin.dashboard.title")}</h1>
        <p className="text-muted-foreground">{t("admin.dashboard.welcome")}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title={t("admin.dashboard.stats.totalPosts")}
          value={overview?.totalPosts ?? 0}
          icon={FileText}
          isLoading={isLoading}
        />
        <StatsCard
          title={t("admin.dashboard.stats.availablePosts")}
          value={overview?.availablePosts ?? 0}
          icon={CheckCircle}
          isLoading={isLoading}
        />
        <StatsCard
          title={t("admin.dashboard.stats.rentedPosts")}
          value={overview?.rentedPosts ?? 0}
          icon={XCircle}
          isLoading={isLoading}
        />
        <StatsCard
          title={t("admin.dashboard.stats.totalUsers")}
          value={overview?.totalUsers ?? 0}
          icon={Users}
          isLoading={isLoading}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <PostsTrendChart />
        <PostsByPropertyTypeChart />
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <PostsStatusChart />
        <TopDistrictsChart />
      </div>
    </div>
  );
}
