"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { PAGE_PATH } from "@/constants/page";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { PROFILE_MENU, ProfilePageTitleMap } from "./constants";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations();
  const pathname = usePathname();
  return (
    <div className="container mx-auto p-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link href="/">{t("common.home")}</Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <Link href={PAGE_PATH.ACCOUNT_PROFILE}>{t("account.title")}</Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <p>{ProfilePageTitleMap[pathname]}</p>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex gap-8 mt-8">
        <div className="w-1/5">
          <ul className="space-y-1">
            {PROFILE_MENU.map((item) => (
              <li
                key={item.href}
                className={cn(
                  "p-2 rounded-md hover:bg-gray-100",
                  pathname === item.href &&
                    "bg-gray-100 text-gray-700 font-medium"
                )}
              >
                <Link href={item.href} className="flex items-center gap-2">
                  <item.icon className="size-4" />
                  <span className="text-sm font-medium text-gray-500 ">
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
