import PublishedDate from "./published-date";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import { POST_STATUS, PostStatus } from "@/constants/post-status";

type PostHeaderProps = {
  title: string;
  publishedAt?: string;
  status: PostStatus;
};

export default function PostHeader({
  title,
  publishedAt,
  status,
}: PostHeaderProps) {
  const t = useTranslations();

  const isRented = status === POST_STATUS.RENTED;
  const statusStyle = isRented
    ? "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100"
    : "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100";

  const statusLabel = isRented
    ? t("posts.details.status.rented")
    : t("posts.details.status.available");

  return (
    <>
      {/* Mobile Header - Sticky */}
      <div className="lg:hidden sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-3 px-4 -ml-4 w-[calc(100%+2rem)]">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">{title}</h1>
          <Badge variant="outline" className={statusStyle}>
            {statusLabel}
          </Badge>
        </div>
        {publishedAt && <PublishedDate date={publishedAt} size="sm" />}
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block mb-6" aria-hidden="true">
        <div className="flex items-center gap-3">
          <p className="text-2xl md:text-3xl font-semibold" role="presentation">
            {title}
          </p>
          <Badge variant="outline" className={statusStyle}>
            {statusLabel}
          </Badge>
        </div>
        {publishedAt && <PublishedDate date={publishedAt} size="md" />}
      </div>
    </>
  );
}
