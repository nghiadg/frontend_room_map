"use client";

import { ProfileForm, type ProfileFormData } from "@/components/profile-form";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { useTranslations } from "next-intl";
import { useRef } from "react";
import { type UseFormReturn } from "react-hook-form";

export default function ProfileSetupPage() {
  const t = useTranslations();
  const profileFormRef = useRef<{
    form: UseFormReturn<ProfileFormData, unknown, ProfileFormData>;
  }>(null);

  const onSubmit = (data: ProfileFormData) => {
    console.log(data);
  };

  return (
    <div className="flex justify-center items-center min-h-screen container mx-auto px-4">
      <form
        className="w-full max-w-sm flex-shrink-0"
        onSubmit={(e) => {
          e.preventDefault();
          profileFormRef.current?.form?.handleSubmit(onSubmit)(e);
        }}
      >
        <FieldGroup className="gap-4">
          <ProfileForm ref={profileFormRef} />
          <Field>
            <Button type="submit">{t("profile.setup.submit")}</Button>
            <Button type="button" variant="outline">
              {t("common.cancel")}
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
