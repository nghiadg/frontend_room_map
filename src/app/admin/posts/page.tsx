"use client";

import { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { usePostsColumns } from "./posts-columns";
import { useAdminPosts } from "./hooks/use-admin-posts";
import { useTranslations } from "next-intl";
import { PostsTableSkeleton } from "./components/posts-table-skeleton";
import { EmptyPostsState } from "./components/empty-posts-state";
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

const STATUS_OPTIONS = ["all", "available", "rented", "deleted"] as const;

export default function PostsPage() {
  const t = useTranslations();
  const columns = usePostsColumns();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("all");

  const hasFilters = search !== "" || status !== "all";

  const { data, isLoading } = useAdminPosts({
    page,
    pageSize,
    search: search || undefined,
    status: status === "all" ? undefined : status,
  });

  // Debounce search to avoid too many API calls
  const handleSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1); // Reset to first page on search
  }, 300);

  const handleStatusChange = (value: string) => {
    setStatus(value);
    setPage(1); // Reset to first page on filter change
  };

  return (
    <div className="flex flex-col h-full">
      <div className="shrink-0 pb-4">
        <h1 className="text-2xl font-bold">{t("admin.posts.title")}</h1>
        <p className="text-muted-foreground">{t("admin.posts.description")}</p>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4 pb-4 shrink-0">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("admin.posts.searchPlaceholder")}
            className="pl-9"
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <Select value={status} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t("admin.posts.filterStatus")} />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {option === "all"
                  ? t("admin.posts.allStatus")
                  : t(`admin.posts.status.${option}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 min-h-0">
        <DataTable
          columns={columns}
          data={data?.posts ?? []}
          pageCount={data?.totalPages}
          pageIndex={page - 1}
          pageSize={pageSize}
          onPaginationChange={(pagination) => {
            setPage(pagination.pageIndex + 1);
            setPageSize(pagination.pageSize);
          }}
          isLoading={isLoading}
          emptyContent={<EmptyPostsState hasFilters={hasFilters} />}
          loadingSkeleton={<PostsTableSkeleton rows={pageSize} />}
        />
      </div>
    </div>
  );
}
