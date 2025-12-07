export default function PostsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto px-4 py-4 md:px-6 md:py-6 lg:px-8 lg:py-8">
      {children}
    </div>
  );
}
