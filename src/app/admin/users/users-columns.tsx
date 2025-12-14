"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { SortableHeader } from "@/components/ui/sortable-header";
import { useTranslations } from "next-intl";
import { formatDate } from "@/lib/utils/date";
import { UserActionsCell } from "./components/user-actions-cell";

export type User = {
  id: number;
  fullName: string;
  email: string;
  avatarUrl?: string;
  role: "renter" | "lessor" | "admin";
  phoneNumber?: string;
  createdAt: string;
  isLocked?: boolean;
};

const ROLE_VARIANTS: Record<
  User["role"],
  "default" | "secondary" | "destructive"
> = {
  renter: "secondary",
  lessor: "default",
  admin: "destructive",
};

/**
 * Hook to get users table columns with i18n support
 */
export function useUsersColumns(): ColumnDef<User>[] {
  const t = useTranslations();

  return [
    {
      accessorKey: "fullName",
      header: ({ column }) => (
        <SortableHeader column={column} titleKey="admin.users.columns.user" />
      ),
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatarUrl} alt={user.fullName} />
              <AvatarFallback>
                {user.fullName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-medium">{user.fullName}</span>
                {user.isLocked && (
                  <Badge
                    variant="outline"
                    className="text-destructive border-destructive"
                  >
                    {t("admin.users.status.locked")}
                  </Badge>
                )}
              </div>
              <span className="text-xs text-muted-foreground">
                {user.email}
              </span>
            </div>
          </div>
        );
      },
      size: 320,
      minSize: 280,
    },
    {
      accessorKey: "phoneNumber",
      header: t("admin.users.columns.phone"),
      cell: ({ row }) => {
        const phone = row.getValue("phoneNumber") as string | undefined;
        return phone || <span className="text-muted-foreground">—</span>;
      },
      size: 140,
      minSize: 140,
    },
    {
      accessorKey: "role",
      header: t("admin.users.columns.role"),
      cell: ({ row }) => {
        const role = row.getValue("role") as User["role"];
        return (
          <Badge variant={ROLE_VARIANTS[role]}>
            {t(`admin.users.roles.${role}`)}
          </Badge>
        );
      },
      size: 140,
      minSize: 140,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          titleKey="admin.users.columns.joinDate"
        />
      ),
      cell: ({ row }) => formatDate(row.getValue("createdAt")),
      size: 140,
      minSize: 140,
    },
    {
      id: "actions",
      header: t("admin.users.columns.actions"),
      cell: ({ row }) => {
        const user = row.original;
        return (
          <UserActionsCell
            profileId={user.id}
            userName={user.fullName}
            isLocked={user.isLocked ?? false}
            isAdmin={user.role === "admin"}
          />
        );
      },
      size: 140,
      minSize: 140,
    },
  ];
}
