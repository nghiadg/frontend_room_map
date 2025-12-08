"use client";

import { useMemo } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format, addDays, differenceInDays } from "date-fns";
import { vi } from "date-fns/locale";
import type { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

/** Maximum number of days allowed for date range filter (user-side) */
export const MAX_DATE_RANGE_DAYS = 30;

type DateRangePickerProps = {
  placeholder?: string;
  selected?: DateRange;
  onSelect?: (range: DateRange | undefined) => void;
  className?: string;
};

export function DateRangePicker({
  placeholder,
  selected,
  onSelect,
  className,
}: DateRangePickerProps) {
  const t = useTranslations();

  // Stable timestamp for dependency comparison to avoid unnecessary re-renders
  const fromTimestamp = selected?.from?.getTime();

  // Calculate disabled dates based on selected from date
  const disabledDates = useMemo(() => {
    if (!selected?.from) return undefined;

    const maxDate = addDays(selected.from, MAX_DATE_RANGE_DAYS);

    // Disable dates after maxDate (more than 30 days from start)
    return { after: maxDate };
  }, [fromTimestamp, selected?.from]);

  const handleSelect = (range: DateRange | undefined) => {
    if (range?.from && range?.to) {
      const daysDiff = differenceInDays(range.to, range.from);

      if (daysDiff > MAX_DATE_RANGE_DAYS) {
        toast.warning(
          t("posts.manage.date_range.max_range_exceeded", {
            days: MAX_DATE_RANGE_DAYS,
          })
        );
        // Adjust to date to max allowed
        onSelect?.({
          from: range.from,
          to: addDays(range.from, MAX_DATE_RANGE_DAYS),
        });
        return;
      }
    }

    onSelect?.(range);
  };

  const hasSelection = Boolean(selected?.from);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "justify-start text-left font-normal",
            !hasSelection && "text-muted-foreground",
            className
          )}
          aria-label={t("posts.manage.date_range.label")}
        >
          <CalendarIcon className="mr-2 h-4 w-4" aria-hidden="true" />
          {selected?.from ? (
            selected.to ? (
              <>
                {format(selected.from, "dd/MM/yyyy", { locale: vi })} -{" "}
                {format(selected.to, "dd/MM/yyyy", { locale: vi })}
              </>
            ) : (
              format(selected.from, "dd/MM/yyyy", { locale: vi })
            )
          ) : (
            placeholder || t("posts.manage.date_range.label")
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <Calendar
          mode="range"
          selected={selected}
          onSelect={handleSelect}
          locale={vi}
          numberOfMonths={2}
          disabled={disabledDates}
        />
        <div className="border-t p-3 flex items-center justify-between">
          {hasSelection ? (
            <>
              <span className="text-xs text-muted-foreground">
                {t("posts.manage.date_range.max_range_hint", {
                  days: MAX_DATE_RANGE_DAYS,
                })}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSelect?.(undefined)}
                aria-label={t("posts.manage.date_range.clear")}
              >
                {t("posts.manage.date_range.clear")}
              </Button>
            </>
          ) : (
            <span className="text-xs text-muted-foreground">
              {t("posts.manage.date_range.max_range_hint", {
                days: MAX_DATE_RANGE_DAYS,
              })}
            </span>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
