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
    <div className="max-w-md">
      <form>
        <ProfileForm
          ref={profileFormRef}
          heading={t("account.profile.heading")}
          description={t("account.profile.description")}
        />
        <Button type="submit" className="mt-4">
          {t("account.profile.submit")}
        </Button>
      </form>
    </div>
  );
}
