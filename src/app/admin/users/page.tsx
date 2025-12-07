"use client";

import { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { useUsersColumns } from "./users-columns";
import { useAdminUsers } from "./hooks/use-admin-users";
import { useTranslations } from "next-intl";
import { UsersTableSkeleton } from "./components/users-table-skeleton";
import { EmptyUsersState } from "./components/empty-users-state";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";

const ROLE_OPTIONS = ["all", "renter", "lessor", "admin"] as const;

export default function UsersPage() {
  const t = useTranslations();
  const columns = useUsersColumns();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<string>("all");

  const hasFilters = search !== "" || role !== "all";

  const { data, isLoading } = useAdminUsers({
    page,
    pageSize,
    search: search || undefined,
    role: role === "all" ? undefined : role,
  });

  // Debounce search to avoid too many API calls
  const handleSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1); // Reset to first page on search
  }, 300);

  const handleRoleChange = (value: string) => {
    setRole(value);
    setPage(1); // Reset to first page on filter change
  };

  return (
    <div className="flex flex-col h-full">
      <div className="shrink-0 pb-4">
        <h1 className="text-2xl font-bold">{t("admin.users.title")}</h1>
        <p className="text-muted-foreground">{t("admin.users.description")}</p>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4 pb-4 shrink-0">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("admin.users.searchPlaceholder")}
            className="pl-9"
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <Select value={role} onValueChange={handleRoleChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t("admin.users.filterRole")} />
          </SelectTrigger>
          <SelectContent>
            {ROLE_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {option === "all"
                  ? t("admin.users.allRoles")
                  : t(`admin.users.roles.${option}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 min-h-0">
        <DataTable
          columns={columns}
          data={data?.users ?? []}
          pageCount={data?.totalPages}
          pageIndex={page - 1}
          pageSize={pageSize}
          onPaginationChange={(pagination) => {
            setPage(pagination.pageIndex + 1);
            setPageSize(pagination.pageSize);
          }}
          isLoading={isLoading}
          emptyContent={<EmptyUsersState hasFilters={hasFilters} />}
          loadingSkeleton={<UsersTableSkeleton rows={pageSize} />}
        />
      </div>
    </div>
  );
}
