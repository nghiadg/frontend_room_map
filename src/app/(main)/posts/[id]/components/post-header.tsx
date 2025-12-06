type PostHeaderProps = {
  title: string;
};

export default function PostHeader({ title }: PostHeaderProps) {
  return (
    <>
      <div className="lg:hidden sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-3 px-4 -ml-4 w-[calc(100%+2rem)]">
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold">{title}</h1>
      </div>
    </>
  );
}
