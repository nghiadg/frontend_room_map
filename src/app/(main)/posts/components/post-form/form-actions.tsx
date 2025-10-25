"use client";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

type ActionConfig = {
  label: string;
  variant: "outline" | "default" | "destructive";
  size: "sm" | "default" | "lg" | "icon" | "icon-sm" | "icon-lg";
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
};

type FormActionsProps = {
  mode: "create" | "edit";
  onPreview: () => void;
  onCancel: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
};

export default function FormActions({
  mode,
  onPreview,
  onCancel,
  onSubmit,
  isSubmitting,
}: FormActionsProps) {
  const t = useTranslations();
  const getActionConfig = () => {
    const baseActions: ActionConfig[] = [
      {
        label: t("common.preview"),
        variant: "outline",
        size: "sm",
        onClick: onPreview,
        disabled: false,
        type: "button",
      },
      {
        label: t("common.cancel"),
        variant: "outline",
        size: "sm",
        onClick: onCancel,
        disabled: false,
        type: "button",
      },
    ];

    const submitActions: ActionConfig = {
      label: mode === "create" ? t("common.create") : t("common.update"),
      variant: "default",
      size: "sm",
      onClick: onSubmit,
      disabled: isSubmitting,
      type: "submit",
    };

    return [...baseActions, submitActions];
  };

  const actions = getActionConfig();
  return (
    <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-2">
      {actions.map((action) => (
        <Button
          key={action.label}
          variant={action.variant}
          size={action.size}
          onClick={action.onClick}
          disabled={action.disabled}
          type={action.type}
          className="w-full sm:w-auto"
        >
          {action.label}
        </Button>
      ))}
    </div>
  );
}
