"use client";

import { ProfileForm, ProfileFormData } from "@/components/profile-form";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useRef } from "react";
import { UseFormReturn } from "react-hook-form";

export default function ProfilePage() {
  const t = useTranslations();
  const profileFormRef = useRef<{
    form: UseFormReturn<ProfileFormData, unknown, ProfileFormData>;
  }>(null);
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {t("account.profile.heading")}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("account.profile.description")}
        </p>
      </div>
      <form className="flex flex-col gap-6">
        <ProfileForm
          ref={profileFormRef}
          heading={t("account.profile.heading")}
          description={t("account.profile.description")}
        />
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button type="submit" className="w-full sm:w-auto">
            {t("account.profile.submit")}
          </Button>
        </div>
      </form>
    </div>
  );
}
