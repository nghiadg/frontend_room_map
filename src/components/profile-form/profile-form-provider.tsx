"use client";

import { GENDER } from "@/constants/gender";
import { FormProvider, Resolver, useForm } from "react-hook-form";
import { ProfileFormData } from "./profile-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ERROR_MESSAGE } from "@/constants/error-message";

const schema = z.object({
  name: z.string().min(1, { message: ERROR_MESSAGE.REQUIRED }),
  gender: z.string().min(1, { message: ERROR_MESSAGE.REQUIRED }),
  birthday: z.date().optional(),
  phone: z.string().min(1, { message: ERROR_MESSAGE.REQUIRED }),
  province: z.object({
    code: z.string(),
    name: z.string(),
  }),
  district: z.object({
    code: z.string(),
    name: z.string(),
    provinceCode: z.string(),
  }),
  ward: z.object({
    code: z.string(),
    name: z.string(),
    districtCode: z.string(),
  }),
  address: z.string().min(1, { message: ERROR_MESSAGE.REQUIRED }),
});

export default function ProfileFormProvider({
  defaultValues,
  children,
}: {
  children: React.ReactNode;
  defaultValues?: ProfileFormData;
}) {
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(schema) as unknown as Resolver<ProfileFormData>,
    defaultValues: {
      ...defaultValues,
    },
  });

  return <FormProvider {...form}>{children}</FormProvider>;
}
