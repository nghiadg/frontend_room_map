import PublishedDate from "./published-date";

type PostHeaderProps = {
  title: string;
  publishedAt?: string;
};

export default function PostHeader({ title, publishedAt }: PostHeaderProps) {
  return (
    <>
      {/* Mobile Header - Sticky */}
      <div className="lg:hidden sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-3 px-4 -ml-4 w-[calc(100%+2rem)]">
        <h1 className="text-lg font-semibold">{title}</h1>
        {publishedAt && <PublishedDate date={publishedAt} size="sm" />}
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block mb-6" aria-hidden="true">
        <p className="text-2xl md:text-3xl font-semibold" role="presentation">
          {title}
        </p>
        {publishedAt && <PublishedDate date={publishedAt} size="md" />}
      </div>
    </>
  );
}
