"use client";

import * as React from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTranslations } from "next-intl";

type DateRangePickerProps = {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  className?: string;
};

export function DateRangePicker({
  dateRange,
  onDateRangeChange,
  className,
}: DateRangePickerProps) {
  const t = useTranslations();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !dateRange?.from && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {dateRange?.from ? (
            dateRange.to ? (
              <>
                {format(dateRange.from, "dd/MM/yyyy", { locale: vi })} -{" "}
                {format(dateRange.to, "dd/MM/yyyy", { locale: vi })}
              </>
            ) : (
              format(dateRange.from, "dd/MM/yyyy", { locale: vi })
            )
          ) : (
            t("admin.posts.dateFilter.placeholder")
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={dateRange}
          onSelect={onDateRangeChange}
          numberOfMonths={2}
          locale={vi}
        />
        {dateRange?.from && (
          <div className="border-t p-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDateRangeChange(undefined)}
            >
              {t("admin.posts.dateFilter.clear")}
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
