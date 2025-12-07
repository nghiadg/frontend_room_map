"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  description?: string;
  isLoading?: boolean;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  description,
  isLoading = false,
}: StatsCardProps) {
  return (
    <Card className="py-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <>
            <Skeleton className="h-8 w-24 mb-1" />
            {description && <Skeleton className="h-4 w-32" />}
          </>
        ) : (
          <>
            <div className="text-2xl font-bold">
              {typeof value === "number"
                ? value.toLocaleString("vi-VN")
                : value}
            </div>
            {description && (
              <p className="text-xs text-muted-foreground mt-1">
                {description}
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
