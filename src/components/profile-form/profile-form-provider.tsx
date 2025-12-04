"use client";

import { createContext, useContext } from "react";
import { FormProvider, Resolver, useForm } from "react-hook-form";
import { ProfileFormData } from "./profile-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ERROR_MESSAGE } from "@/constants/error-message";
import { Role } from "@/types/role";

const schema = z.object({
  name: z.string().min(1, { message: ERROR_MESSAGE.REQUIRED }),
  gender: z.string().min(1, { message: ERROR_MESSAGE.REQUIRED }),
  role: z.string().optional(),
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

// Context to share roles without prop drilling
const RolesContext = createContext<Role[]>([]);
export const useRoles = () => useContext(RolesContext);

export default function ProfileFormProvider({
  roles,
  defaultValues,
  children,
}: {
  roles: Role[];
  children: React.ReactNode;
  defaultValues?: ProfileFormData;
}) {
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(schema) as unknown as Resolver<ProfileFormData>,
    defaultValues: {
      ...defaultValues,
    },
  });

  return (
    <FormProvider {...form}>
      <RolesContext.Provider value={roles}>{children}</RolesContext.Provider>
    </FormProvider>
  );
}
