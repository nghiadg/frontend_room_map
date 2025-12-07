"use client";

import PostCard from "@/components/user/post-card";
import { Button } from "@/components/ui/button";
import { SearchIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { PostsFilterBar } from "./components/posts-filter-bar";
import { usePostFilters } from "./hooks/use-post-filters";
import { useUserPosts } from "./hooks/use-user-posts";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { getVisiblePages, shouldShowEllipsis } from "./utils/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { mapPostToCardProps } from "./utils/post-mapper";

export default function AccountPostsPage() {
  const t = useTranslations();

  const {
    filters,
    currentPage,
    setCurrentPage,
    setSearch,
    setStatus,
    setSortBy,
    setDateRange,
    hasActiveFilters,
    clearAllFilters,
  } = usePostFilters();

  const { data, isLoading, error } = useUserPosts({
    filters,
    currentPage,
    pageSize: 9,
  });

  // Helper to get property type with fallback
  const getPropertyType = (type: string) =>
    type || t("posts.manage.property_type_unknown");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {t("posts.manage.title")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t("posts.manage.description")}
        </p>
      </div>

      {/* Filter Bar */}
      <div className="mt-6">
        <PostsFilterBar
          filters={filters}
          onSearchChange={setSearch}
          onStatusChange={setStatus}
          onSortByChange={setSortBy}
          onDateRangeChange={setDateRange}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearAllFilters}
          resultsCount={data?.totalCount || 0}
        />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div
          className="mt-6 flex flex-col items-center justify-center py-16 text-center"
          role="alert"
        >
          <div className="rounded-full bg-destructive/10 p-6 mb-4">
            <SearchIcon className="h-12 w-12 text-destructive" />
          </div>
          <h3 className="text-lg font-semibold mb-2">
            {t("posts.manage.error.title")}
          </h3>
          <p className="text-sm text-muted-foreground max-w-md mb-4">
            {error.message || t("posts.manage.error.description")}
          </p>
          <Button onClick={() => window.location.reload()} variant="outline">
            {t("posts.manage.error.retry")}
          </Button>
        </div>
      )}

      {/* Posts Grid */}
      {!isLoading && !error && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {data && data.posts.length > 0 ? (
            data.posts.map((post) => {
              const mapped = mapPostToCardProps(post);
              return (
                <PostCard
                  key={post.id}
                  {...mapped}
                  propertyType={getPropertyType(mapped.propertyType)}
                />
              );
            })
          ) : (
            <div
              className="col-span-full flex flex-col items-center justify-center py-16 text-center"
              role="status"
              aria-live="polite"
            >
              <div
                className="rounded-full bg-muted p-6 mb-4"
                aria-hidden="true"
              >
                <SearchIcon className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {t("posts.manage.empty_state.title")}
              </h3>
              <p className="text-sm text-muted-foreground max-w-md">
                {t("posts.manage.empty_state.description")}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && data && data.totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination
            role="navigation"
            aria-label={t("posts.manage.pagination.label")}
          >
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setCurrentPage(Math.max(1, currentPage - 1));
                    }
                  }}
                  aria-disabled={currentPage === 1}
                  aria-label={t("posts.manage.pagination.previous_page")}
                  tabIndex={currentPage === 1 ? -1 : 0}
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                >
                  {t("posts.manage.pagination.previous")}
                </PaginationPrevious>
              </PaginationItem>

              {/* Page numbers */}
              {getVisiblePages(currentPage, data.totalPages).map(
                (page, index, array) => (
                  <PaginationItem key={page}>
                    {/* Show ellipsis if there's a gap */}
                    {shouldShowEllipsis(page, array[index - 1]) && (
                      <PaginationEllipsis />
                    )}
                    <PaginationLink
                      onClick={() => setCurrentPage(page)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setCurrentPage(page);
                        }
                      }}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                      aria-label={t("posts.manage.pagination.go_to_page", {
                        page,
                      })}
                      aria-current={currentPage === page ? "page" : undefined}
                      tabIndex={0}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage(Math.min(data.totalPages, currentPage + 1))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setCurrentPage(
                        Math.min(data.totalPages, currentPage + 1)
                      );
                    }
                  }}
                  aria-disabled={currentPage === data.totalPages}
                  aria-label={t("posts.manage.pagination.next_page")}
                  tabIndex={currentPage === data.totalPages ? -1 : 0}
                  className={
                    currentPage === data.totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                >
                  {t("posts.manage.pagination.next")}
                </PaginationNext>
              </PaginationItem>
            </PaginationContent>
          </Pagination>

          {/* Screen reader page info */}
          <span className="sr-only" role="status" aria-live="polite">
            {t("posts.manage.pagination.page_info", {
              current: currentPage,
              total: data.totalPages,
            })}
          </span>
        </div>
      )}
    </div>
  );
}
