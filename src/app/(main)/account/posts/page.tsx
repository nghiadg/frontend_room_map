import PostCard from "@/components/post-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchIcon } from "lucide-react";

const mockPosts = [
  {
    id: "1",
    title: "Căn hộ studio trung tâm Quận 1",
    publishedAt: new Date(2025, 9, 20), // Oct 20, 2025
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
    publishedAt: new Date(2025, 9, 18), // Oct 18, 2025
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
    publishedAt: new Date(2025, 10, 12), // Nov 12, 2025
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
    publishedAt: new Date(2025, 9, 25), // Oct 25, 2025
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
    publishedAt: new Date(2025, 9, 15), // Oct 15, 2025
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
    publishedAt: new Date(2025, 10, 5), // Nov 5, 2025
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

const statusFilters = [
  { label: "Tất cả trạng thái", value: "all" },
  { label: "Đang hiển thị", value: "active" },
  { label: "Chờ duyệt", value: "pending" },
  { label: "Nháp", value: "draft" },
  { label: "Hết hạn", value: "expired" },
  { label: "Đã ẩn", value: "hidden" },
];

export default function AccountPostsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Bài đăng của bạn
          </h1>
          <p className="text-sm text-muted-foreground">
            Quản lý và cập nhật bài đăng của bạn ở một nơi.
          </p>
        </div>
        <Button className="w-full sm:w-auto">Tạo bài đăng mới</Button>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_auto]">
        <div className="relative">
          <Input placeholder="Tìm kiếm bài đăng..." className="pl-9" />
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-full text-sm">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent align="start">
            {statusFilters.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="secondary" className="w-full lg:w-auto">
          Tìm kiếm
        </Button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {mockPosts.map((post) => (
          <PostCard key={post.id} {...post} />
        ))}
      </div>
    </div>
  );
}
