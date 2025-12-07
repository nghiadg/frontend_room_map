"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { XCircle } from "lucide-react";

export default function AuthErrorPage() {
  const t = useTranslations();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="max-w-md text-center space-y-6">
        <XCircle className="w-16 h-16 text-destructive mx-auto" />
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">{t("auth.login_error_title")}</h1>
          <p className="text-muted-foreground">
            {t("auth.login_error_description")}
          </p>
        </div>
        <Button asChild>
          <Link href="/">{t("common.back_to_home")}</Link>
        </Button>
      </div>
    </div>
  );
}
