"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Pie, PieChart, Cell } from "recharts";
import { usePostsByStatus } from "../hooks/use-posts-by-status";
import { useTranslations } from "next-intl";
import { STATUS_COLORS, CHART_HEIGHT } from "../types";

export function PostsStatusChart() {
  const t = useTranslations();
  const { data, isLoading, error } = usePostsByStatus();

  const chartConfig: ChartConfig = {
    active: {
      label: t("admin.dashboard.status.active"),
      color: STATUS_COLORS.active,
    },
    rented: {
      label: t("admin.dashboard.status.rented"),
      color: STATUS_COLORS.rented,
    },
    hidden: {
      label: t("admin.dashboard.status.hidden"),
      color: STATUS_COLORS.hidden,
    },
    deleted: {
      label: t("admin.dashboard.status.deleted"),
      color: STATUS_COLORS.deleted,
    },
  };

  // Transform data for chart
  const chartData =
    data?.map((item) => ({
      status: item.status,
      count: item.count,
      fill: STATUS_COLORS[item.status] ?? "hsl(0, 0%, 50%)", // gray fallback for unknown status
    })) || [];

  const total = chartData.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card className="py-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">
          {t("admin.dashboard.charts.postsStatus")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div
            className="flex items-center justify-center"
            style={{ height: CHART_HEIGHT }}
          >
            <Skeleton className="h-full w-full rounded-full max-w-[200px] max-h-[200px] mx-auto" />
          </div>
        ) : error ? (
          <div
            className="flex items-center justify-center text-muted-foreground"
            style={{ height: CHART_HEIGHT }}
          >
            {t("common.error")}
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            style={{ height: CHART_HEIGHT }}
            className="w-full"
          >
            <PieChart>
              <ChartTooltip
                content={<ChartTooltipContent nameKey="status" />}
              />
              <Pie
                data={chartData}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
              >
                {chartData.map((entry) => (
                  <Cell key={entry.status} fill={entry.fill} />
                ))}
              </Pie>
              <ChartLegend content={<ChartLegendContent nameKey="status" />} />
              {/* Center label */}
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-foreground text-2xl font-bold"
              >
                {total.toLocaleString("vi-VN")}
              </text>
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
