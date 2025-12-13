"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/hooks/use-auth";
import { useAuthStore } from "@/store/authStore";
import NiceModal from "@ebay/nice-modal-react";
import {
  Bell,
  Heart,
  Home,
  List,
  LogIn,
  LogOut,
  Map,
  Menu,
  Plus,
  Search,
  Shield,
  User,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useCallback } from "react";
import LoginDialog from "../login-dialog";
import ComingSoonDialog from "../coming-soon-dialog";
import { cn } from "@/lib/utils";
import { RoleGate } from "@/components/shared/role-gate";
import { PERMISSIONS, USER_ROLE } from "@/constants/user-role";
import {
  COMING_SOON_FEATURES,
  type ComingSoonFeatureKey,
} from "@/constants/coming-soon";

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

type HeaderProps = {
  className?: string;
};

export default function Header({ className }: HeaderProps) {
  const t = useTranslations();
  const { user } = useAuthStore();
  const { signOut } = useAuth();

  const handleClickLogin = useCallback(() => {
    NiceModal.show(LoginDialog);
  }, []);

  const handleComingSoon = useCallback((featureKey: ComingSoonFeatureKey) => {
    NiceModal.show(ComingSoonDialog, { featureKey });
  }, []);

  const isLoggedIn = !!user;

  const primaryNav: NavItem[] = [
    { label: t("navigation.home"), href: "/", icon: Home },
    { label: t("navigation.explore_map"), href: "/map", icon: Map },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.webp"
              alt="logo"
              width={60}
              height={60}
              className="object-contain"
            />
          </Link>
          <nav className="hidden lg:flex items-center gap-3 text-sm font-medium text-muted-foreground">
            {primaryNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full border border-transparent px-4 py-1.5 transition-colors hover:border-primary hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center justify-end gap-4">
          <div className="hidden md:flex items-center justify-end gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleComingSoon(COMING_SOON_FEATURES.SEARCH)}
              aria-label={t("coming_soon.features.search")}
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleComingSoon(COMING_SOON_FEATURES.FAVORITES)}
              aria-label={t("coming_soon.features.favorites")}
            >
              <Heart className="h-5 w-5" />
            </Button>
            <RoleGate permission={PERMISSIONS.CREATE_POST}>
              <Link href="/posts/create">
                <Button size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  {t("navigation.create_post")}
                </Button>
              </Link>
            </RoleGate>
          </div>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar className="border">
                  {isLoggedIn ? (
                    <>
                      <AvatarImage src={user?.user_metadata.avatar_url} />
                      <AvatarFallback>
                        {user?.user_metadata.name}
                      </AvatarFallback>
                    </>
                  ) : (
                    <div className="flex size-full items-center justify-center">
                      <User className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                {!isLoggedIn && (
                  <DropdownMenuItem
                    onClick={handleClickLogin}
                    className="gap-2"
                  >
                    <LogIn className="h-4 w-4" />
                    {t("auth.login")}
                  </DropdownMenuItem>
                )}
                {isLoggedIn && (
                  <>
                    <DropdownMenuItem asChild className="gap-2">
                      <Link href="/account/profile">
                        <User className="h-4 w-4" />
                        {t("account.menu.profile")}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="gap-2"
                      onClick={() =>
                        handleComingSoon(COMING_SOON_FEATURES.NOTIFICATIONS)
                      }
                    >
                      <Bell className="h-4 w-4" />
                      {t("account.menu.notification")}
                    </DropdownMenuItem>
                    <RoleGate permission={PERMISSIONS.EDIT_POST}>
                      <DropdownMenuItem asChild className="gap-2">
                        <Link href="/account/posts">
                          <List className="h-4 w-4" />
                          {t("account.menu.manage_posts")}
                        </Link>
                      </DropdownMenuItem>
                    </RoleGate>
                    <RoleGate role={USER_ROLE.ADMIN}>
                      <DropdownMenuItem asChild className="gap-2">
                        <Link href="/admin">
                          <Shield className="h-4 w-4" />
                          {t("account.menu.admin_dashboard")}
                        </Link>
                      </DropdownMenuItem>
                    </RoleGate>
                    <DropdownMenuItem onClick={signOut} className="gap-2">
                      <LogOut className="h-4 w-4" />
                      {t("auth.logout")}
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">
                    {t("navigation.aria.open_menu")}
                  </span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[340px] p-6">
                <SheetHeader className="p-0">
                  <SheetTitle>
                    <div className="flex items-center gap-3">
                      <Image
                        src="/logo.webp"
                        alt="logo"
                        width={60}
                        height={60}
                        className="object-contain"
                      />
                    </div>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-8 mt-6">
                  {/* Primary Navigation Section */}
                  <div className="flex flex-col gap-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80 border-b border-border pb-2 mb-1">
                      {t("navigation.sections.explore")}
                    </p>
                    {primaryNav.map((item) => (
                      <SheetClose key={item.href} asChild>
                        <Link
                          href={item.href}
                          className="flex items-center gap-3 text-base font-medium py-2.5 px-3 -mx-3 rounded-lg transition-colors hover:bg-accent"
                        >
                          <item.icon className="h-5 w-5 text-muted-foreground" />
                          {item.label}
                        </Link>
                      </SheetClose>
                    ))}
                  </div>

                  {/* Account Section */}
                  {isLoggedIn && (
                    <div className="flex flex-col gap-2">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80 border-b border-border pb-2 mb-1">
                        {t("navigation.sections.account")}
                      </p>
                      <SheetClose asChild>
                        <Link
                          href="/account/profile"
                          className="flex items-center gap-3 text-base font-medium py-2.5 px-3 -mx-3 rounded-lg transition-colors hover:bg-accent"
                        >
                          <User className="h-5 w-5 text-muted-foreground" />
                          {t("account.menu.profile")}
                        </Link>
                      </SheetClose>
                      <button
                        type="button"
                        onClick={() =>
                          handleComingSoon(COMING_SOON_FEATURES.NOTIFICATIONS)
                        }
                        className="flex items-center gap-3 text-base font-medium py-2.5 px-3 -mx-3 rounded-lg transition-colors hover:bg-accent text-left"
                      >
                        <Bell className="h-5 w-5 text-muted-foreground" />
                        {t("account.menu.notification")}
                      </button>
                      <RoleGate permission={PERMISSIONS.EDIT_POST}>
                        <SheetClose asChild>
                          <Link
                            href="/account/posts"
                            className="flex items-center gap-3 text-base font-medium py-2.5 px-3 -mx-3 rounded-lg transition-colors hover:bg-accent"
                          >
                            <List className="h-5 w-5 text-muted-foreground" />
                            {t("account.menu.manage_posts")}
                          </Link>
                        </SheetClose>
                      </RoleGate>
                      <RoleGate role={USER_ROLE.ADMIN}>
                        <SheetClose asChild>
                          <Link
                            href="/admin"
                            className="flex items-center gap-3 text-base font-medium py-2.5 px-3 -mx-3 rounded-lg transition-colors hover:bg-accent"
                          >
                            <Shield className="h-5 w-5 text-muted-foreground" />
                            {t("account.menu.admin_dashboard")}
                          </Link>
                        </SheetClose>
                      </RoleGate>
                    </div>
                  )}

                  {/* Auth Actions */}
                  <div className="flex flex-col gap-3 pt-4 border-t border-border">
                    {!isLoggedIn ? (
                      <Button
                        onClick={handleClickLogin}
                        className="w-full gap-2"
                      >
                        <LogIn className="h-4 w-4" />
                        {t("auth.login")}
                      </Button>
                    ) : (
                      <Button
                        onClick={signOut}
                        variant="outline"
                        className="w-full gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
                      >
                        <LogOut className="h-4 w-4" />
                        {t("auth.logout")}
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
