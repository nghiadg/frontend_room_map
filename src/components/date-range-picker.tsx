"use client";

import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, XIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import type { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

type DateRangePickerProps = {
  placeholder?: string;
  selected?: DateRange;
  onSelect?: (range: DateRange | undefined) => void;
  className?: string;
};

export function DateRangePicker({
  placeholder = "Chọn khoảng thời gian",
  selected,
  onSelect,
  className,
}: DateRangePickerProps) {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const [tempRange, setTempRange] = useState<DateRange | undefined>(selected);

  const formatDateRange = (range: DateRange | undefined): string => {
    if (!range) return placeholder;

    const { from, to } = range;
    if (!from) return placeholder;

    if (!to || from.getTime() === to.getTime()) {
      return format(from, "d 'Th'M, yyyy", { locale: vi });
    }

    return `${format(from, "d 'Th'M", { locale: vi })} - ${format(to, "d 'Th'M, yyyy", { locale: vi })}`;
  };

  const clearRange = () => {
    onSelect?.(undefined);
    setTempRange(undefined);
    setOpen(false);
  };

  const handleApply = () => {
    onSelect?.(tempRange);
    setOpen(false);
  };

  const handleCancel = () => {
    setTempRange(selected);
    setOpen(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setTempRange(selected);
    }
    setOpen(isOpen);
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "justify-start text-left font-normal",
            !selected && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {formatDateRange(selected)}
          {selected && (
            <button
              type="button"
              className="ml-auto flex h-4 w-4 items-center justify-center opacity-50 hover:opacity-100"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                clearRange();
              }}
            >
              <XIcon className="h-4 w-4" />
            </button>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <Calendar
          mode="range"
          selected={tempRange}
          onSelect={setTempRange}
          locale={vi}
          numberOfMonths={2}
          formatters={{
            formatMonthDropdown: (date) => format(date, "MMM", { locale: vi }),
          }}
        />
        <div className="flex justify-end gap-2 border-t p-3">
          <Button size="sm" variant="outline" onClick={handleCancel}>
            {t("posts.manage.date_range.cancel")}
          </Button>
          <Button size="sm" onClick={handleApply}>
            {t("posts.manage.date_range.apply")}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
