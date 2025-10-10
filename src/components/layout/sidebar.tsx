"use client";

import NiceModal from "@ebay/nice-modal-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogIn, LogOut } from "lucide-react";
import { useTranslations } from "next-intl";
import LoginDialog from "../login-dialog";

export default function Sidebar() {
  const t = useTranslations("auth");
  const handleClickLogin = () => {
    NiceModal.show(LoginDialog);
  };

  return (
    <aside className="w-[60px] bg-gray-100 p-2 flex flex-col items-center">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="ml-2">
          <DropdownMenuItem onClick={handleClickLogin}>
            <LogIn className="w-4 h-4" />
            {t("login")}
          </DropdownMenuItem>
          <DropdownMenuItem>
            <LogOut className="w-4 h-4" />
            {t("logout")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </aside>
  );
}
