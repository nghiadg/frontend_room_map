import Header from "@/components/user/layout/header";
import { Toaster } from "@/components/ui/sonner";
import Footer from "@/components/user/layout/footer";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen w-screen">
      <Header />
      <main className="flex-1">{children}</main>
      <Toaster />
      <Footer />
    </div>
  );
}
