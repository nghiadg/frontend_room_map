import { UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

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
  role = "Người cho thuê",
}: HostAvatarProps) {
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
        <p className="text-xs text-muted-foreground">{role}</p>
      </div>
    </div>
  );
}
