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
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/authStore";
import NiceModal from "@ebay/nice-modal-react";
import { Heart, LogIn, LogOut, Menu, Plus, Search, User } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import LoginDialog from "../login-dialog";
import { cn } from "@/lib/utils";

type HeaderProps = {
  className?: string;
};
export default function Header({ className }: HeaderProps) {
  const t = useTranslations("auth");
  const { user } = useAuthStore();
  const { signOut } = useAuth();

  const handleClickLogin = () => {
    NiceModal.show(LoginDialog);
  };

  const isLoggedIn = !!user;

  const primaryNav = [
    { label: "Trang chủ", href: "/" },
    { label: "Bản đồ", href: "/map" },
    { label: "Bài đăng", href: "/posts" },
    { label: "Tin tức", href: "/blog" },
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
              src="/logo.svg"
              alt="logo"
              width={100}
              height={100}
              className="object-contain"
            />
          </Link>
          <nav className="hidden lg:flex items-center gap-3 text-sm font-medium text-muted-foreground">
            {primaryNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-3 py-1 transition-colors hover:bg-muted hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center justify-end gap-4">
          <div className="hidden md:flex items-center justify-end gap-2">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            <Link href="/favorites">
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/posts/create">
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Đăng bài
              </Button>
            </Link>
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
                    {t("login")}
                  </DropdownMenuItem>
                )}
                {isLoggedIn && (
                  <DropdownMenuItem onClick={signOut} className="gap-2">
                    <LogOut className="h-4 w-4" />
                    {t("logout")}
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[340px]">
                <SheetHeader>
                  <SheetTitle>
                    <div className="flex items-center gap-3">
                      <Image
                        src="/logo.svg"
                        alt="logo"
                        width={100}
                        height={100}
                        className="object-contain"
                      />
                    </div>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6 px-4">
                  <div className="flex flex-col gap-4">
                    <p className="text-xs uppercase text-muted-foreground">
                      Khám phá
                    </p>
                    {primaryNav.map((item) => (
                      <SheetClose key={item.href} asChild>
                        <Link
                          href={item.href}
                          className="text-base font-medium"
                        >
                          {item.label}
                        </Link>
                      </SheetClose>
                    ))}
                  </div>

                  <div className="flex flex-col gap-3">
                    <Button variant="outline" className="justify-start gap-2">
                      <Search className="h-4 w-4" />
                      Tìm kiếm
                    </Button>
                    <Button variant="outline" className="justify-start gap-2">
                      <Heart className="h-4 w-4" />
                      Danh sách yêu thích
                    </Button>
                    <Link href="/posts/create">
                      <Button className="w-full gap-2">
                        <Plus className="h-4 w-4" />
                        Đăng bài mới
                      </Button>
                    </Link>
                  </div>

                  <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                    {!isLoggedIn ? (
                      <Button
                        onClick={handleClickLogin}
                        className="w-full gap-2"
                      >
                        <LogIn className="h-4 w-4" />
                        {t("login")}
                      </Button>
                    ) : (
                      <Button
                        onClick={signOut}
                        variant="outline"
                        className="w-full gap-2"
                      >
                        <LogOut className="h-4 w-4" />
                        {t("logout")}
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
