"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Area, AreaChart, XAxis, YAxis, CartesianGrid } from "recharts";
import { usePostsTrend } from "../hooks/use-posts-trend";
import { useTranslations } from "next-intl";
import { format, parseISO } from "date-fns";
import { vi } from "date-fns/locale";
import { PRIMARY_CHART_COLOR, CHART_HEIGHT } from "../types";

export function PostsTrendChart() {
  const t = useTranslations();
  const { data, isLoading, error } = usePostsTrend();

  const chartConfig: ChartConfig = {
    count: {
      label: t("admin.dashboard.charts.postsTrend"),
      color: PRIMARY_CHART_COLOR,
    },
  };

  // Transform data for chart - format date for display
  const chartData =
    data?.map((item) => ({
      date: item.date,
      dateFormatted: format(parseISO(item.date), "dd/MM", { locale: vi }),
      count: item.count,
    })) || [];

  return (
    <Card className="py-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">
          {t("admin.dashboard.charts.postsTrend")}
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
            <AreaChart
              data={chartData}
              margin={{ left: 0, right: 12, top: 12 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="dateFormatted"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11 }}
                interval="preserveStartEnd"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11 }}
                width={30}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(_, payload) => {
                      if (payload?.[0]?.payload?.date) {
                        return format(
                          parseISO(payload[0].payload.date),
                          "dd/MM/yyyy",
                          { locale: vi }
                        );
                      }
                      return "";
                    }}
                  />
                }
              />
              <defs>
                <linearGradient id="fillCount" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={PRIMARY_CHART_COLOR}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={PRIMARY_CHART_COLOR}
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="count"
                stroke={PRIMARY_CHART_COLOR}
                strokeWidth={2}
                fill="url(#fillCount)"
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
