import Header from "@/components/layout/header";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen w-screen">
      <Header />
      <main className="flex-1 bg-accent">{children}</main>
    </div>
  );
}
