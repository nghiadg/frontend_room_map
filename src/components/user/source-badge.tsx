"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { POST_SOURCE, PostSource } from "@/constants/post-source";
import { cn } from "@/lib/utils";

type SourceBadgeProps = {
  /** Post source - can be undefined for backward compatibility */
  source?: PostSource | string | null;
  /** Size of the badge */
  size?: "sm" | "md" | "lg";
  /** Additional class names */
  className?: string;
  /** Show tooltip on hover */
  showTooltip?: boolean;
};

const SIZE_CONFIG = {
  sm: { width: 16, height: 16 },
  md: { width: 20, height: 20 },
  lg: { width: 24, height: 24 },
} as const;

/**
 * Type guard to check if source is a valid special source (admin or bot)
 */
const isSpecialSource = (source: unknown): source is PostSource => {
  return source === POST_SOURCE.ADMIN || source === POST_SOURCE.BOT;
};

/**
 * SourceBadge component displays a badge icon for bot or admin posts.
 * Shows nothing for regular user posts or when source is undefined/null.
 *
 * @note Requires TooltipProvider from parent component or layout.
 */
export function SourceBadge({
  source,
  size = "md",
  className,
  showTooltip = true,
}: SourceBadgeProps) {
  const t = useTranslations();

  // Don't render anything for regular user posts or invalid sources
  if (!isSpecialSource(source)) {
    return null;
  }

  const isBot = source === POST_SOURCE.BOT;
  const iconSrc = isBot ? "/icons/bot-badge.svg" : "/icons/admin-badge.svg";
  const tooltipKey = isBot
    ? "post_source.bot_tooltip"
    : "post_source.admin_tooltip";
  const altText = t(isBot ? "post_source.bot" : "post_source.admin");
  const { width, height } = SIZE_CONFIG[size];

  const badge = (
    <span
      className={cn(
        "inline-flex items-center justify-center shrink-0",
        className
      )}
      role="img"
      aria-label={altText}
    >
      <Image
        src={iconSrc}
        alt=""
        width={width}
        height={height}
        className="rounded-full"
        aria-hidden="true"
      />
    </span>
  );

  if (!showTooltip) {
    return badge;
  }

  return (
    <Tooltip delayDuration={300}>
      <TooltipTrigger asChild>{badge}</TooltipTrigger>
      <TooltipContent side="top" className="text-xs">
        {t(tooltipKey)}
      </TooltipContent>
    </Tooltip>
  );
}
