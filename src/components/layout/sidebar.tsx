"use client";

import NiceModal from "@ebay/nice-modal-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogIn, LogOut, User } from "lucide-react";
import { useTranslations } from "next-intl";
import LoginDialog from "../login-dialog";
import { useAuthStore } from "@/store/authStore";
import { useAuth } from "@/hooks/useAuth";

export default function Sidebar() {
  const t = useTranslations("auth");
  const { user } = useAuthStore();
  const { signOut } = useAuth();

  const handleClickLogin = () => {
    NiceModal.show(LoginDialog);
  };

  const isLoggedIn = !!user;

  return (
    <aside className="w-[60px] bg-gray-100 p-2 flex flex-col items-center">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar className="border">
            {isLoggedIn ? (
              <>
                <AvatarImage src={user?.user_metadata.avatar_url} />
                <AvatarFallback>{user?.user_metadata.name}</AvatarFallback>
              </>
            ) : (
              <div className="flex items-center justify-center size-full">
                <User className="w-4 h-4 text-muted-foreground" />
              </div>
            )}
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="ml-2">
          {!isLoggedIn && (
            <DropdownMenuItem onClick={handleClickLogin}>
              <LogIn className="w-4 h-4" />
              {t("login")}
            </DropdownMenuItem>
          )}
          {isLoggedIn && (
            <DropdownMenuItem onClick={signOut}>
              <LogOut className="w-4 h-4" />
              {t("logout")}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </aside>
  );
}
