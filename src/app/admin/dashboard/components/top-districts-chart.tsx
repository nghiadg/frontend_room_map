"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Bar, BarChart, XAxis, YAxis, Cell } from "recharts";
import { useTopDistricts } from "../hooks/use-top-districts";
import { useTranslations } from "next-intl";
import { PROPERTY_TYPE_COLORS, CHART_HEIGHT } from "../types";

export function TopDistrictsChart() {
  const t = useTranslations();
  const { data, isLoading, error } = useTopDistricts();

  const chartConfig: ChartConfig = {
    count: {
      label: t("admin.dashboard.charts.topDistricts"),
    },
  };

  // Transform data for chart - combine district and province name
  const chartData =
    data?.map((item, index) => ({
      name: item.districtName,
      fullName: `${item.districtName}, ${item.provinceName}`,
      count: item.count,
      fill: PROPERTY_TYPE_COLORS[index % PROPERTY_TYPE_COLORS.length],
    })) || [];

  return (
    <Card className="py-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">
          {t("admin.dashboard.charts.topDistricts")}
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
                content={
                  <ChartTooltipContent
                    labelFormatter={(_, payload) => {
                      return payload?.[0]?.payload?.fullName || "";
                    }}
                  />
                }
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
