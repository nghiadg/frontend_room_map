"use client";

import { ProfileForm } from "@/components/profile-form/profile-form";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { useTranslations } from "next-intl";

export default function ProfileSetupPage() {
  const t = useTranslations();

  return (
    <div className="flex justify-center items-center min-h-screen container mx-auto px-4">
      <form className="w-full max-w-sm flex-shrink-0">
        <FieldGroup className="gap-4">
          <ProfileForm />
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
