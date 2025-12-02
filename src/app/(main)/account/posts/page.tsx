"use client";

import PostCard from "@/components/post-card";
import { Button } from "@/components/ui/button";
import { SearchIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { PostsFilterBar } from "./components/posts-filter-bar";
import { usePostFilters } from "./hooks/use-post-filters";
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

const mockPosts = [
  {
    id: "1",
    title: "Căn hộ studio trung tâm Quận 1",
    publishedAt: new Date(2025, 9, 20),
    price: 3500000,
    deposit: 3500000,
    status: "active" as const,
    statusLabel: "Đang hiển thị",
    area: 25,
    address: "Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh",
    propertyType: "Căn hộ",
    imageCount: 5,
    thumbnail:
      "https://images.unsplash.com/photo-1505691723518-36a5ac3be353?w=800",
  },
  {
    id: "2",
    title: "Phòng trọ giá rẻ gần Đại học Bách Khoa",
    publishedAt: new Date(2025, 9, 18),
    price: 2200000,
    deposit: 2200000,
    status: "pending" as const,
    statusLabel: "Chờ duyệt",
    area: 18,
    address: "Phường Linh Trung, Thủ Đức, TP. Hồ Chí Minh",
    propertyType: "Phòng trọ",
    imageCount: 3,
    thumbnail:
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800",
  },
  {
    id: "3",
    title: "Nhà nguyên căn 2 phòng ngủ",
    publishedAt: new Date(2025, 10, 12),
    price: 11000000,
    deposit: 22000000,
    status: "expired" as const,
    statusLabel: "Hết hạn",
    area: 60,
    address: "Phường Thảo Điền, Quận 2, TP. Hồ Chí Minh",
    propertyType: "Nhà nguyên căn",
    imageCount: 6,
    thumbnail:
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800",
  },
  {
    id: "4",
    title: "Căn hộ cao cấp view sông Sài Gòn",
    publishedAt: new Date(2025, 9, 25),
    price: 15000000,
    deposit: 30000000,
    status: "active" as const,
    statusLabel: "Đang hiển thị",
    area: 80,
    address: "Phường Bình An, Quận 2, TP. Hồ Chí Minh",
    propertyType: "Căn hộ",
    imageCount: 6,
    thumbnail:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
  },
  {
    id: "5",
    title: "Phòng trọ sinh viên giá rẻ",
    publishedAt: new Date(2025, 9, 15),
    price: 1800000,
    deposit: 1800000,
    status: "hidden" as const,
    statusLabel: "Đã ẩn",
    area: 15,
    address: "Phường Đông Hòa, Dĩ An, Bình Dương",
    propertyType: "Phòng trọ",
    imageCount: 4,
    thumbnail:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
  },
  {
    id: "6",
    title: "Chung cư mini gần BX Miền Đông",
    publishedAt: new Date(2025, 10, 5),
    price: 4500000,
    deposit: 4500000,
    status: "draft" as const,
    statusLabel: "Nháp",
    area: 30,
    address: "Phường 14, Gò Vấp, TP. Hồ Chí Minh",
    propertyType: "Chung cư mini",
    imageCount: 3,
    thumbnail:
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800",
  },
  {
    id: "7",
    title: "Phòng trọ đầy đủ nội thất Tân Bình",
    publishedAt: new Date(2025, 9, 22),
    price: 2800000,
    deposit: 2800000,
    status: "active" as const,
    statusLabel: "Đang hiển thị",
    area: 20,
    address: "Phường 15, Tân Bình, TP. Hồ Chí Minh",
    propertyType: "Phòng trọ",
    imageCount: 5,
    thumbnail:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
  },
  {
    id: "8",
    title: "Căn hộ 1PN gần chợ Bến Thành",
    publishedAt: new Date(2025, 9, 19),
    price: 6000000,
    deposit: 12000000,
    status: "active" as const,
    statusLabel: "Đang hiển thị",
    area: 35,
    address: "Phường Bến Thành, Quận 1, TP. Hồ Chí Minh",
    propertyType: "Căn hộ",
    imageCount: 7,
    thumbnail:
      "https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800",
  },
  {
    id: "9",
    title: "Nhà trọ cao cấp gần Lottemart",
    publishedAt: new Date(2025, 10, 1),
    price: 3200000,
    deposit: 3200000,
    status: "pending" as const,
    statusLabel: "Chờ duyệt",
    area: 22,
    address: "Phường Tân Hưng, Quận 7, TP. Hồ Chí Minh",
    propertyType: "Phòng trọ",
    imageCount: 4,
    thumbnail:
      "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800",
  },
  {
    id: "10",
    title: "Studio hiện đại Phú Nhuận",
    publishedAt: new Date(2025, 9, 16),
    price: 4200000,
    deposit: 4200000,
    status: "active" as const,
    statusLabel: "Đang hiển thị",
    area: 28,
    address: "Phường 12, Phú Nhuận, TP. Hồ Chí Minh",
    propertyType: "Căn hộ",
    imageCount: 6,
    thumbnail:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
  },
  {
    id: "11",
    title: "Phòng trọ khép kín Bình Thạnh",
    publishedAt: new Date(2025, 10, 8),
    price: 2500000,
    deposit: 2500000,
    status: "active" as const,
    statusLabel: "Đang hiển thị",
    area: 18,
    address: "Phường 25, Bình Thạnh, TP. Hồ Chí Minh",
    propertyType: "Phòng trọ",
    imageCount: 3,
    thumbnail:
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800",
  },
  {
    id: "12",
    title: "Căn hộ dịch vụ Quận 3",
    publishedAt: new Date(2025, 9, 21),
    price: 7500000,
    deposit: 15000000,
    status: "active" as const,
    statusLabel: "Đang hiển thị",
    area: 45,
    address: "Phường 9, Quận 3, TP. Hồ Chí Minh",
    propertyType: "Căn hộ",
    imageCount: 8,
    thumbnail:
      "https://images.unsplash.com/photo-1560184897-ae75f418493e?w=800",
  },
  {
    id: "13",
    title: "Nhà nguyên căn 3PN Gò Vấp",
    publishedAt: new Date(2025, 10, 3),
    price: 9000000,
    deposit: 18000000,
    status: "draft" as const,
    statusLabel: "Nháp",
    area: 75,
    address: "Phường 10, Gò Vấp, TP. Hồ Chí Minh",
    propertyType: "Nhà nguyên căn",
    imageCount: 10,
    thumbnail:
      "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800",
  },
  {
    id: "14",
    title: "Phòng trọ mới xây Thủ Đức",
    publishedAt: new Date(2025, 9, 14),
    price: 2000000,
    deposit: 2000000,
    status: "active" as const,
    statusLabel: "Đang hiển thị",
    area: 16,
    address: "Phường Linh Chiểu, Thủ Đức, TP. Hồ Chí Minh",
    propertyType: "Phòng trọ",
    imageCount: 4,
    thumbnail:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800",
  },
  {
    id: "15",
    title: "Căn hộ duplex cao cấp",
    publishedAt: new Date(2025, 10, 10),
    price: 20000000,
    deposit: 40000000,
    status: "pending" as const,
    statusLabel: "Chờ duyệt",
    area: 120,
    address: "Phường An Phú, Quận 2, TP. Hồ Chí Minh",
    propertyType: "Căn hộ",
    imageCount: 12,
    thumbnail:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
  },
  {
    id: "16",
    title: "Phòng trọ có gác lửng",
    publishedAt: new Date(2025, 9, 13),
    price: 2300000,
    deposit: 2300000,
    status: "active" as const,
    statusLabel: "Đang hiển thị",
    area: 20,
    address: "Phường Tân Phú, Quận 9, TP. Hồ Chí Minh",
    propertyType: "Phòng trọ",
    imageCount: 5,
    thumbnail:
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800",
  },
];

export default function AccountPostsPage() {
  const t = useTranslations();

  const {
    paginatedPosts,
    filteredPosts,
    filters,
    pagination,
    setSearch,
    setStatus,
    setSortBy,
    setDateRange,
    hasActiveFilters,
    clearAllFilters,
  } = usePostFilters(mockPosts);

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
          resultsCount={filteredPosts.length}
        />
      </div>

      {/* Posts Grid */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {paginatedPosts.length > 0 ? (
          paginatedPosts.map((post) => <PostCard key={post.id} {...post} />)
        ) : (
          <div
            className="col-span-full flex flex-col items-center justify-center py-16 text-center"
            role="status"
            aria-live="polite"
          >
            <div className="rounded-full bg-muted p-6 mb-4" aria-hidden="true">
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

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    pagination.setCurrentPage(
                      Math.max(1, pagination.currentPage - 1)
                    )
                  }
                  aria-disabled={pagination.currentPage === 1}
                  className={
                    pagination.currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                >
                  {t("posts.manage.pagination.previous")}
                </PaginationPrevious>
              </PaginationItem>

              {/* Page numbers */}
              {getVisiblePages(
                pagination.currentPage,
                pagination.totalPages
              ).map((page, index, array) => (
                <PaginationItem key={page}>
                  {/* Show ellipsis if there's a gap */}
                  {shouldShowEllipsis(page, array[index - 1]) && (
                    <PaginationEllipsis />
                  )}
                  <PaginationLink
                    onClick={() => pagination.setCurrentPage(page)}
                    isActive={pagination.currentPage === page}
                    className="cursor-pointer"
                    aria-label={t("posts.manage.pagination.go_to_page", {
                      page,
                    })}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    pagination.setCurrentPage(
                      Math.min(
                        pagination.totalPages,
                        pagination.currentPage + 1
                      )
                    )
                  }
                  aria-disabled={
                    pagination.currentPage === pagination.totalPages
                  }
                  className={
                    pagination.currentPage === pagination.totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                >
                  {t("posts.manage.pagination.next")}
                </PaginationNext>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
