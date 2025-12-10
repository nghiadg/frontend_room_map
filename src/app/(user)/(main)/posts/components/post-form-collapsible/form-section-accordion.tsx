"use client";

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AlertCircleIcon, CheckCircle2Icon, CircleIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { memo } from "react";
import { SectionStatus } from "./utils";

type FormSectionAccordionProps = {
  value: string;
  title: string;
  description?: string;
  status: SectionStatus;
  children: React.ReactNode;
};

const STATUS_CONFIG: Record<
  SectionStatus,
  {
    icon: typeof CheckCircle2Icon;
    variant: "default" | "destructive" | "secondary" | "outline";
    className: string;
    labelKey: string;
  }
> = {
  valid: {
    icon: CheckCircle2Icon,
    variant: "default",
    className: "bg-green-500/10 text-green-600 border-green-200",
    labelKey: "posts.form.section_status.valid",
  },
  error: {
    icon: AlertCircleIcon,
    variant: "destructive",
    className: "",
    labelKey: "posts.form.section_status.error",
  },
  pending: {
    icon: CircleIcon,
    variant: "secondary",
    className: "bg-muted text-muted-foreground",
    labelKey: "posts.form.section_status.pending",
  },
};

function FormSectionAccordionComponent({
  value,
  title,
  description,
  status,
  children,
}: FormSectionAccordionProps) {
  const t = useTranslations();
  const config = STATUS_CONFIG[status];
  const StatusIcon = config.icon;

  return (
    <AccordionItem value={value} className="border rounded-lg px-4 mb-3">
      <AccordionTrigger className="hover:no-underline">
        <div className="flex flex-col items-start gap-1 flex-1">
          <div className="flex items-center gap-3 w-full">
            <span className="font-semibold text-base">{title}</span>
            <Badge
              variant={config.variant}
              className={cn("ml-auto mr-2 gap-1", config.className)}
            >
              <StatusIcon className="size-3" aria-hidden="true" />
              <span className="text-xs">{t(config.labelKey)}</span>
            </Badge>
          </div>
          {description && (
            <span className="text-sm text-muted-foreground font-normal">
              {description}
            </span>
          )}
        </div>
      </AccordionTrigger>
      <AccordionContent>{children}</AccordionContent>
    </AccordionItem>
  );
}

// Memoize to prevent unnecessary re-renders when other sections update
export const FormSectionAccordion = memo(FormSectionAccordionComponent);
