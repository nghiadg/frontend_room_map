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
    publishedAt: "20/10/2025",
    price: "3.500.000đ/đêm",
    status: "Đang hiển thị",
    thumbnail:
      "https://images.unsplash.com/photo-1505691723518-36a5ac3be353?w=800",
  },
  {
    id: "2",
    title: "Phòng trọ giá rẻ gần Đại học Bách Khoa",
    publishedAt: "18/10/2025",
    price: "2.200.000đ/đêm",
    status: "Chờ duyệt",
    thumbnail:
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800",
  },
  {
    id: "3",
    title: "Nhà nguyên căn 2 phòng ngủ",
    publishedAt: "12/11/2025",
    price: "11.000.000đ/đêm",
    status: "Hết hạn",
    thumbnail:
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800",
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
