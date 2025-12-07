"use client";

import { ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Column } from "@tanstack/react-table";
import { useTranslations } from "next-intl";

type SortableHeaderProps<TData> = {
  column: Column<TData, unknown>;
  titleKey: string;
};

/**
 * Reusable sortable header component with sort direction indicators
 */
export function SortableHeader<TData>({
  column,
  titleKey,
}: SortableHeaderProps<TData>) {
  const t = useTranslations();
  const sorted = column.getIsSorted();

  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className="-ml-3 hover:bg-transparent"
    >
      {t(titleKey)}
      <div className="ml-2 flex flex-col">
        <ChevronUp
          className={`h-3 w-3 -mb-1 ${
            sorted === "asc" ? "text-foreground" : "text-muted-foreground/50"
          }`}
        />
        <ChevronDown
          className={`h-3 w-3 ${
            sorted === "desc" ? "text-foreground" : "text-muted-foreground/50"
          }`}
        />
      </div>
    </Button>
  );
}
