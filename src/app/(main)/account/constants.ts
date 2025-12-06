import { PAGE_PATH } from "@/constants/page";
import { Permission, PERMISSIONS } from "@/constants/user-role";
import { BellIcon, ListIcon, UserIcon, LucideIcon } from "lucide-react";

const PROFILE_TITLES = {
  PROFILE: "Thông tin tài khoản",
  NOTIFICATION: "Thông báo",
  MANAGE_POSTS: "Quản lý bài đăng",
} satisfies Record<string, string>;

export type ProfileMenuItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  permission?: Permission;
};

export const PROFILE_MENU: ProfileMenuItem[] = [
  {
    label: PROFILE_TITLES.PROFILE,
    href: PAGE_PATH.ACCOUNT_PROFILE,
    icon: UserIcon,
  },
  {
    label: PROFILE_TITLES.NOTIFICATION,
    href: PAGE_PATH.ACCOUNT_NOTIFICATION,
    icon: BellIcon,
  },
  {
    label: PROFILE_TITLES.MANAGE_POSTS,
    href: PAGE_PATH.ACCOUNT_MANAGE_POSTS,
    icon: ListIcon,
    permission: PERMISSIONS.CREATE_POST,
  },
];

export const ProfilePageTitleMap: Record<string, string> = {
  [PAGE_PATH.ACCOUNT_PROFILE]: PROFILE_TITLES.PROFILE,
  [PAGE_PATH.ACCOUNT_NOTIFICATION]: PROFILE_TITLES.NOTIFICATION,
  [PAGE_PATH.ACCOUNT_MANAGE_POSTS]: PROFILE_TITLES.MANAGE_POSTS,
};
