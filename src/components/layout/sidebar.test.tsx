import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Sidebar from "./sidebar";
import NiceModal from "@ebay/nice-modal-react";

// Mock dependencies
const mockSignOut = jest.fn();

jest.mock("@/store/authStore");
jest.mock("@/hooks/useAuth");
jest.mock("@ebay/nice-modal-react");

import { useAuthStore } from "@/store/authStore";
import { useAuth } from "@/hooks/useAuth";

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
  Avatar: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div data-testid="avatar" className={className}>
      {children}
    </div>
  ),
  AvatarImage: ({ src }: { src?: string }) =>
    src ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt="avatar" data-testid="avatar-image" />
    ) : null,
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
  DropdownMenuContent: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div data-testid="dropdown-content" className={className}>
      {children}
    </div>
  ),
  DropdownMenuItem: ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
  }) => (
    <div data-testid="dropdown-item" role="menuitem" onClick={onClick}>
      {children}
    </div>
  ),
}));

// Mock lucide-react icons
jest.mock("lucide-react", () => ({
  LogIn: () => <svg data-testid="login-icon" />,
  LogOut: () => <svg data-testid="logout-icon" />,
  User: ({ className }: { className?: string }) => (
    <svg data-testid="user-icon" className={className} />
  ),
}));

describe("Sidebar Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({
      signOut: mockSignOut,
    });
    (NiceModal.show as jest.Mock).mockImplementation(() => {});
  });

  describe("when user is logged out", () => {
    beforeEach(() => {
      (useAuthStore as unknown as jest.Mock).mockReturnValue({
        user: null,
      });
    });

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

    it("renders user icon when logged out", () => {
      render(<Sidebar />);

      const userIcon = screen.getByTestId("user-icon");
      expect(userIcon).toBeInTheDocument();
    });

    it("does not render avatar image when logged out", () => {
      render(<Sidebar />);

      const avatarImage = screen.queryByTestId("avatar-image");
      expect(avatarImage).not.toBeInTheDocument();
    });

    it("renders login menu item with correct text", () => {
      render(<Sidebar />);

      expect(screen.getByText("Đăng nhập")).toBeInTheDocument();
    });

    it("does not render logout menu item when logged out", () => {
      render(<Sidebar />);

      expect(screen.queryByText("Đăng xuất")).not.toBeInTheDocument();
    });

    it("renders login icon", () => {
      render(<Sidebar />);

      const loginIcon = screen.getByTestId("login-icon");
      expect(loginIcon).toBeInTheDocument();
    });

    it("renders exactly one menu item (login)", () => {
      render(<Sidebar />);

      const menuItems = screen.getAllByTestId("dropdown-item");
      expect(menuItems).toHaveLength(1);
    });

    it("shows login dialog when login button is clicked", async () => {
      const user = userEvent.setup();
      render(<Sidebar />);

      const loginMenuItem = screen.getByText("Đăng nhập");
      await user.click(loginMenuItem);

      expect(NiceModal.show).toHaveBeenCalled();
    });
  });

  describe("when user is logged in", () => {
    const mockUser = {
      id: "user-123",
      user_metadata: {
        avatar_url: "https://example.com/avatar.png",
        name: "John Doe",
      },
    };

    beforeEach(() => {
      (useAuthStore as unknown as jest.Mock).mockReturnValue({
        user: mockUser,
      });
    });

    it("renders avatar image with correct src", () => {
      render(<Sidebar />);

      const avatarImage = screen.getByTestId("avatar-image");
      expect(avatarImage).toHaveAttribute(
        "src",
        mockUser.user_metadata.avatar_url
      );
    });

    it("renders avatar fallback with user name", () => {
      render(<Sidebar />);

      const fallback = screen.getByTestId("avatar-fallback");
      expect(fallback).toHaveTextContent(mockUser.user_metadata.name);
    });

    it("does not render user icon when logged in", () => {
      render(<Sidebar />);

      const userIcon = screen.queryByTestId("user-icon");
      expect(userIcon).not.toBeInTheDocument();
    });

    it("renders logout menu item with correct text", () => {
      render(<Sidebar />);

      expect(screen.getByText("Đăng xuất")).toBeInTheDocument();
    });

    it("does not render login menu item when logged in", () => {
      render(<Sidebar />);

      expect(screen.queryByText("Đăng nhập")).not.toBeInTheDocument();
    });

    it("renders logout icon", () => {
      render(<Sidebar />);

      const logoutIcon = screen.getByTestId("logout-icon");
      expect(logoutIcon).toBeInTheDocument();
    });

    it("renders exactly one menu item (logout)", () => {
      render(<Sidebar />);

      const menuItems = screen.getAllByTestId("dropdown-item");
      expect(menuItems).toHaveLength(1);
    });

    it("calls signOut when logout button is clicked", async () => {
      const user = userEvent.setup();
      render(<Sidebar />);

      const logoutMenuItem = screen.getByText("Đăng xuất");
      await user.click(logoutMenuItem);

      expect(mockSignOut).toHaveBeenCalled();
    });
  });

  describe("common functionality", () => {
    beforeEach(() => {
      (useAuthStore as unknown as jest.Mock).mockReturnValue({
        user: null,
      });
    });

    it("renders dropdown menu trigger", () => {
      render(<Sidebar />);

      const trigger = screen.getByTestId("dropdown-trigger");
      expect(trigger).toBeInTheDocument();
    });

    it("dropdown trigger is clickable", async () => {
      const user = userEvent.setup();
      render(<Sidebar />);

      const trigger = screen.getByTestId("dropdown-trigger");
      await user.click(trigger);

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
  });
});
