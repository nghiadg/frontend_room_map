"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useRoles } from "../hooks/use-roles";
import { Shield, User, Home, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Role configuration with icons and colors
const ROLE_CONFIG: Record<
  string,
  { icon: LucideIcon; color: string; bgColor: string; descriptionKey: string }
> = {
  renter: {
    icon: User,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    descriptionKey: "admin.settings.roles.renterDescription",
  },
  lessor: {
    icon: Home,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
    descriptionKey: "admin.settings.roles.lessorDescription",
  },
  admin: {
    icon: Shield,
    color: "text-red-600",
    bgColor: "bg-red-100",
    descriptionKey: "admin.settings.roles.adminDescription",
  },
};

const DEFAULT_CONFIG = {
  icon: User,
  color: "text-gray-600",
  bgColor: "bg-gray-100",
  descriptionKey: "admin.settings.roles.defaultDescription",
};

/** Number of skeleton cards to show while loading */
const SKELETON_CARD_COUNT = 3;

export function RolesGrid() {
  const t = useTranslations();
  const { data: roles, isLoading, error } = useRoles();

  if (isLoading) {
    return <RolesGridSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-32 text-muted-foreground">
        {t("common.error")}
      </div>
    );
  }

  if (!roles || roles.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-muted-foreground">
        {t("admin.settings.roles.empty")}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {roles.map((role) => {
        const config = ROLE_CONFIG[role.name.toLowerCase()] || DEFAULT_CONFIG;
        const Icon = config.icon;

        return (
          <Card key={role.id} className="border">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <div
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-lg",
                  config.bgColor
                )}
              >
                <Icon className={cn("h-6 w-6", config.color)} />
              </div>
              <div className="flex-1">
                <CardTitle className="text-lg capitalize">
                  {role.name}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {t(config.descriptionKey)}
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {t("admin.settings.roles.usersLabel")}
                </span>
                <span className="text-2xl font-bold">{role.usersCount}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function RolesGridSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: SKELETON_CARD_COUNT }).map((_, i) => (
        <Card key={i} className="border">
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <Skeleton className="h-12 w-12 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-12" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
