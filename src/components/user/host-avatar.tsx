import { UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

type HostAvatarProps = {
  name: string;
  avatar: string;
  className?: string;
  containerClassName?: string;
  role?: string;
};
export default function HostAvatar({
  name,
  avatar,
  className,
  containerClassName,
  role,
}: HostAvatarProps) {
  const t = useTranslations();

  return (
    <div className={cn("flex items-center gap-3 mb-3", containerClassName)}>
      <Avatar className={cn("w-12 h-12", className)}>
        <AvatarImage src={avatar} />
        <AvatarFallback>
          <UserIcon className="w-4 h-4" />
        </AvatarFallback>
      </Avatar>
      <div>
        <p className="font-semibold">{name}</p>
        <p className="text-xs text-muted-foreground">
          {role ? role : t("common.host_role")}
        </p>
      </div>
    </div>
  );
}
