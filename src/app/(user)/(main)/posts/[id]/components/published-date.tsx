import { CalendarIcon } from "lucide-react";
import { formatDate, formatRelativeDate } from "@/lib/utils/date";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

const SIZE_STYLES = {
  sm: {
    container: "text-xs mt-1 gap-1.5",
    icon: "w-3.5 h-3.5",
  },
  md: {
    container: "text-sm mt-2 gap-1.5",
    icon: "w-4 h-4",
  },
} as const;

type PublishedDateProps = {
  date: string;
  size?: keyof typeof SIZE_STYLES;
  className?: string;
};

/**
 * Reusable component for displaying publish date with relative time and absolute date.
 * Example output: "Đăng 3 tuần trước (15/11/2024)"
 */
export default function PublishedDate({
  date,
  size = "md",
  className,
}: PublishedDateProps) {
  const t = useTranslations();
  const styles = SIZE_STYLES[size];

  return (
    <p
      className={cn(
        "flex items-center text-muted-foreground",
        styles.container,
        className
      )}
    >
      <CalendarIcon className={styles.icon} aria-hidden="true" />
      {t("posts.booking.published_at", {
        publishedAt: formatRelativeDate(date),
      })}{" "}
      <span className="text-muted-foreground/70">({formatDate(date)})</span>
    </p>
  );
}
