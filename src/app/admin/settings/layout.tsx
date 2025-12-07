interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  // Simple pass-through layout - settings sidebar is now in main admin sidebar
  return <>{children}</>;
}
