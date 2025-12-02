"use client";

import PostCard from "@/components/post-card";
import { Button } from "@/components/ui/button";
import { SearchIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { PostsFilterBar } from "./components/posts-filter-bar";
import { usePostFilters } from "./hooks/use-post-filters";

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
];

export default function AccountPostsPage() {
  const t = useTranslations();

  const {
    filteredPosts,
    filters,
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {t("posts.manage.title")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("posts.manage.description")}
          </p>
        </div>
        <Button className="w-full sm:w-auto">
          {t("posts.manage.create_new")}
        </Button>
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
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => <PostCard key={post.id} {...post} />)
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
    </div>
  );
}
