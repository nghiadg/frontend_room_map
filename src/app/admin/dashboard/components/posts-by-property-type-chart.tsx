"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { usePostsByPropertyType } from "../hooks/use-posts-by-property-type";
import { useTranslations } from "next-intl";
import { PROPERTY_TYPE_COLORS, CHART_HEIGHT } from "../types";

export function PostsByPropertyTypeChart() {
  const t = useTranslations();
  const { data, isLoading, error } = usePostsByPropertyType();

  // Build chart config dynamically based on data
  const chartConfig: ChartConfig = {
    count: {
      label: t("admin.dashboard.charts.postsByPropertyType"),
    },
    ...(data?.reduce((acc, item, index) => {
      acc[item.key] = {
        label: item.name,
        color: PROPERTY_TYPE_COLORS[index % PROPERTY_TYPE_COLORS.length],
      };
      return acc;
    }, {} as ChartConfig) || {}),
  };

  // Transform data for chart
  const chartData =
    data?.map((item, index) => ({
      name: item.name,
      key: item.key,
      count: item.count,
      fill: PROPERTY_TYPE_COLORS[index % PROPERTY_TYPE_COLORS.length],
    })) || [];

  return (
    <Card className="py-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">
          {t("admin.dashboard.charts.postsByPropertyType")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div
            className="flex items-center justify-center"
            style={{ height: CHART_HEIGHT }}
          >
            <Skeleton className="h-full w-full" />
          </div>
        ) : error ? (
          <div
            className="flex items-center justify-center text-muted-foreground"
            style={{ height: CHART_HEIGHT }}
          >
            {t("common.error")}
          </div>
        ) : chartData.length === 0 ? (
          <div
            className="flex items-center justify-center text-muted-foreground"
            style={{ height: CHART_HEIGHT }}
          >
            {t("admin.dashboard.noData")}
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            style={{ height: CHART_HEIGHT }}
            className="w-full"
          >
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ left: 0, right: 16 }}
            >
              <YAxis
                dataKey="name"
                type="category"
                tickLine={false}
                axisLine={false}
                width={100}
                tick={{ fontSize: 12 }}
              />
              <XAxis type="number" tickLine={false} axisLine={false} />
              <ChartTooltip
                cursor={{ fill: "hsl(var(--muted))", opacity: 0.3 }}
                content={<ChartTooltipContent />}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
