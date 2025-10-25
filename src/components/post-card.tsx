import Image from "next/image";
import { Badge } from "./ui/badge";
import Link from "next/link";

type PostCardProps = {
  id: string;
  thumbnail: string;
  title: string;
  status: string;
  publishedAt: string;
  price: string;
};

export default function PostCard({
  id,
  thumbnail,
  title,
  status,
  publishedAt,
  price,
}: PostCardProps) {
  return (
    <article key={id} className="flex flex-col gap-4">
      <Link href={`/posts/${id}`} className="block">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-muted">
          <Image
            src={thumbnail}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 hover:scale-105"
            priority={false}
          />
          <Badge variant="secondary" className="absolute left-3 top-3">
            {status}
          </Badge>
        </div>
      </Link>
      <div className="space-y-2">
        <div className="flex flex-col gap-1">
          <Link
            href={`/posts/${id}`}
            className="text-base font-semibold leading-tight line-clamp-2"
          >
            {title}
          </Link>
          <p className="text-xs text-muted-foreground sm:text-sm">
            {publishedAt}
          </p>
        </div>
        <div className="flex flex-col gap-1 text-sm text-muted-foreground">
          <p>1 phòng ngủ</p>
          <span className="text-base font-semibold text-foreground">
            {price}
          </span>
        </div>
      </div>
    </article>
  );
}
