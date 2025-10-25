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
import { usePathname, useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations();
  const pathname = usePathname();
  const router = useRouter();
  const currentMenu = PROFILE_MENU.find((item) => item.href === pathname);
  const pageTitle =
    ProfilePageTitleMap[pathname] || currentMenu?.label || t("account.title");

  const handleNavigate = (value: string) => {
    router.push(value);
  };
  return (
    <div className="container mx-auto p-4">
      <Breadcrumb>
        <BreadcrumbList className="flex flex-wrap gap-1 text-sm text-muted-foreground">
          <BreadcrumbItem>
            <Link href="/">{t("common.home")}</Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <Link href={PAGE_PATH.ACCOUNT_PROFILE}>{t("account.title")}</Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <span className="text-foreground">{pageTitle}</span>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="mt-6 flex flex-col gap-6 lg:mt-10 lg:flex-row lg:gap-10">
        <div className="lg:w-1/4 lg:flex-none">
          <div className="lg:hidden">
            <Select
              value={currentMenu?.href || pathname}
              onValueChange={handleNavigate}
            >
              <SelectTrigger aria-label={t("account.title")}>
                <SelectValue placeholder={t("account.title")}>
                  {pageTitle}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {PROFILE_MENU.map((item) => (
                  <SelectItem key={item.href} value={item.href}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <ul className="hidden lg:flex lg:flex-col lg:space-y-1">
            {PROFILE_MENU.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                      isActive && "text-foreground"
                    )}
                  >
                    <item.icon className="size-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="flex-1 lg:min-w-0">{children}</div>
      </div>
    </div>
  );
}
