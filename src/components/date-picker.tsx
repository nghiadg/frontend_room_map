"use client";

import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import type { PropsSingle } from "react-day-picker";
import { vi } from "date-fns/locale";

type SingleDatePickerProps = {
  placeholder?: string;
  defaultSelected?: Date;
  pattern?: string;
} & Omit<React.ComponentProps<typeof Calendar>, keyof PropsSingle> &
  Partial<PropsSingle>;

function SingleDatePicker({
  placeholder,
  selected: controlledSelected,
  onSelect: controlledOnSelect,
  defaultSelected,
  pattern = "dd/MM/yyyy",
  ...props
}: SingleDatePickerProps) {
  const [open, setOpen] = useState<boolean>(false);

  const [uncontrolledSelected, setUncontrolledSelected] = useState<
    Date | undefined
  >(defaultSelected);

  const isControlled = controlledSelected !== undefined;
  const selected = isControlled ? controlledSelected : uncontrolledSelected;

  const handleSelect: PropsSingle["onSelect"] = (date, ...args) => {
    if (!isControlled) {
      setUncontrolledSelected(date);
    }

    controlledOnSelect?.(date, ...args);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!selected}
          className="data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal"
        >
          <CalendarIcon />
          {selected ? (
            format(selected, pattern, { locale: vi })
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          {...props}
          selected={selected}
          onSelect={handleSelect}
          mode="single"
          locale={vi}
          formatters={{
            formatMonthDropdown: (date) => format(date, "MMM", { locale: vi }),
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

export const DatePicker = {
  Single: SingleDatePicker,
};
