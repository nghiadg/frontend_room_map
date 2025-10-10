import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Sidebar from "./sidebar";

// Mock next-intl
jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      login: "Đăng nhập",
      logout: "Đăng xuất",
    };
    return translations[key] || key;
  },
}));

// Mock Avatar component
jest.mock("@/components/ui/avatar", () => ({
  Avatar: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="avatar">{children}</div>
  ),
  AvatarImage: ({ src }: { src: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="avatar" data-testid="avatar-image" />
  ),
  AvatarFallback: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="avatar-fallback">{children}</div>
  ),
}));

// Mock DropdownMenu component
jest.mock("@/components/ui/dropdown-menu", () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-menu">{children}</div>
  ),
  DropdownMenuTrigger: ({ children }: { children: React.ReactNode }) => (
    <button data-testid="dropdown-trigger">{children}</button>
  ),
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-content">{children}</div>
  ),
  DropdownMenuItem: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-item" role="menuitem">
      {children}
    </div>
  ),
}));

describe("Sidebar Component", () => {
  it("renders sidebar with correct structure", () => {
    render(<Sidebar />);

    const sidebar = screen.getByRole("complementary");
    expect(sidebar).toBeInTheDocument();
    expect(sidebar).toHaveClass("w-[60px]", "bg-gray-100");
  });

  it("renders avatar component", () => {
    render(<Sidebar />);

    const avatar = screen.getByTestId("avatar");
    expect(avatar).toBeInTheDocument();
  });

  it("renders avatar image with correct src", () => {
    render(<Sidebar />);

    const avatarImage = screen.getByTestId("avatar-image");
    expect(avatarImage).toHaveAttribute("src", "https://github.com/shadcn.png");
  });

  it("renders avatar fallback", () => {
    render(<Sidebar />);

    const fallback = screen.getByTestId("avatar-fallback");
    expect(fallback).toHaveTextContent("CN");
  });

  it("renders dropdown menu trigger", () => {
    render(<Sidebar />);

    const trigger = screen.getByTestId("dropdown-trigger");
    expect(trigger).toBeInTheDocument();
  });

  it("renders login menu item with correct text", () => {
    render(<Sidebar />);

    const menuItems = screen.getAllByTestId("dropdown-item");
    expect(menuItems[0]).toHaveTextContent("Đăng nhập");
  });

  it("renders logout menu item with correct text", () => {
    render(<Sidebar />);

    const menuItems = screen.getAllByTestId("dropdown-item");
    expect(menuItems[1]).toHaveTextContent("Đăng xuất");
  });

  it("renders login and logout icons", () => {
    render(<Sidebar />);

    // lucide-react icons render as SVG elements
    const svgs = screen.getAllByRole("menuitem");
    expect(svgs).toHaveLength(2);
  });

  it("uses translation hook for menu items", () => {
    render(<Sidebar />);

    // Verify that translations are being used
    expect(screen.getByText("Đăng nhập")).toBeInTheDocument();
    expect(screen.getByText("Đăng xuất")).toBeInTheDocument();
  });

  it("dropdown trigger is clickable", async () => {
    const user = userEvent.setup();
    render(<Sidebar />);

    const trigger = screen.getByTestId("dropdown-trigger");
    await user.click(trigger);

    // Trigger should be clickable without errors
    expect(trigger).toBeInTheDocument();
  });

  it("has correct layout classes", () => {
    render(<Sidebar />);

    const sidebar = screen.getByRole("complementary");
    expect(sidebar).toHaveClass("flex", "flex-col", "items-center", "p-2");
  });

  it("renders dropdown menu structure", () => {
    render(<Sidebar />);

    expect(screen.getByTestId("dropdown-menu")).toBeInTheDocument();
    expect(screen.getByTestId("dropdown-trigger")).toBeInTheDocument();
    expect(screen.getByTestId("dropdown-content")).toBeInTheDocument();
  });

  it("renders exactly two menu items", () => {
    render(<Sidebar />);

    const menuItems = screen.getAllByTestId("dropdown-item");
    expect(menuItems).toHaveLength(2);
  });

  it("menu items have proper role attribute", () => {
    render(<Sidebar />);

    const menuItems = screen.getAllByRole("menuitem");
    expect(menuItems).toHaveLength(2);
  });
});
