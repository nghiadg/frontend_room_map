import { render, screen, fireEvent } from "@testing-library/react";
import LoginDialog from "./login-dialog";

// Mock dependencies
const mockSignInWithGoogle = jest.fn();

jest.mock("@/hooks/use-auth");
jest.mock("@ebay/nice-modal-react", () => {
  const mockHideFn = jest.fn();
  const mockShowFn = jest.fn();

  return {
    __esModule: true,
    default: {
      create: (component: React.ComponentType) => component,
      show: mockShowFn,
      hide: mockHideFn,
    },
    useModal: () => ({
      visible: true,
      hide: mockHideFn,
      show: mockShowFn,
    }),
  };
});

// Mock next-intl
jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      "auth.login": "Đăng nhập",
      "auth.login_with_google": "Đăng nhập với Google",
      "common.cancel": "Huỷ bỏ",
    };
    return translations[key] || key;
  },
}));

// Mock Button component
jest.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    onClick,
    disabled,
    variant,
    className,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    variant?: string;
    className?: string;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      data-variant={variant}
      className={className}
    >
      {children}
    </button>
  ),
}));

// Mock Dialog components
jest.mock("@/components/ui/dialog", () => ({
  Dialog: ({
    children,
    open,
  }: {
    children: React.ReactNode;
    open: boolean;
    onOpenChange?: (open: boolean) => void;
  }) => (open ? <div role="dialog">{children}</div> : null),
  DialogContent: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
    showCloseButton?: boolean;
  }) => <div className={className}>{children}</div>,
  DialogTitle: ({ children }: { children: React.ReactNode }) => (
    <h2>{children}</h2>
  ),
}));

// Mock IconGoogle
jest.mock("@/components/icons", () => ({
  IconGoogle: () => <svg data-testid="google-icon" />,
}));

import { useAuth } from "@/hooks/use-auth";

// Get the mocked module to access mock functions
const mockedNiceModal = jest.requireMock("@ebay/nice-modal-react");

describe("LoginDialog", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({
      signInWithGoogle: mockSignInWithGoogle,
      isLoading: false,
    });
  });

  it("renders without crashing", () => {
    render(<LoginDialog id="login-dialog" />);
    // Check for a dialog or content unique to LoginDialog
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("calls modal.hide on cancel button click", () => {
    const mockHideInstance = jest.fn();

    // Override useModal for this test
    mockedNiceModal.useModal = jest.fn(() => ({
      visible: true,
      hide: mockHideInstance,
      show: jest.fn(),
    }));

    render(<LoginDialog id="login-dialog" />);
    const cancelBtn = screen.getByRole("button", { name: "Huỷ bỏ" });
    fireEvent.click(cancelBtn);

    expect(mockHideInstance).toHaveBeenCalled();
  });

  it("renders Google login button", () => {
    render(<LoginDialog id="login-dialog" />);
    // Adjust selector/text based on the actual button label
    const googleBtn = screen.getByRole("button", {
      name: /Đăng nhập với Google/i,
    });
    expect(googleBtn).toBeInTheDocument();
  });

  it("calls signInWithGoogle when Google button is clicked", () => {
    render(<LoginDialog id="login-dialog" />);
    const googleBtn = screen.getByRole("button", {
      name: /Đăng nhập với Google/i,
    });
    fireEvent.click(googleBtn);

    expect(mockSignInWithGoogle).toHaveBeenCalled();
  });

  it("disables Google button when loading", () => {
    (useAuth as jest.Mock).mockReturnValue({
      signInWithGoogle: mockSignInWithGoogle,
      isLoading: true,
    });

    render(<LoginDialog id="login-dialog" />);
    const googleBtn = screen.getByRole("button", {
      name: /Đăng nhập với Google/i,
    });

    expect(googleBtn).toBeDisabled();
  });

  it("renders dialog title", () => {
    render(<LoginDialog id="login-dialog" />);
    expect(screen.getByText("Đăng nhập")).toBeInTheDocument();
  });

  it("renders Google icon", () => {
    render(<LoginDialog id="login-dialog" />);
    expect(screen.getByTestId("google-icon")).toBeInTheDocument();
  });
});
