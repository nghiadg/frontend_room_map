import Header from "@/components/layout/header";

export default function MapLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-screen h-screen relative">
      <Header className="fixed top-0 left-0 w-full z-50 backdrop-blur-sm" />
      <>{children}</>
    </div>
  );
}
