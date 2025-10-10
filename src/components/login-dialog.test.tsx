import { render, screen, fireEvent } from "@testing-library/react";
import LoginDialog from "./login-dialog";

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

// Get the mocked module to access mock functions
const mockedNiceModal = jest.requireMock("@ebay/nice-modal-react");

describe("LoginDialog", () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
    const cancelBtn = screen.getByRole("button", { name: "common.cancel" });
    fireEvent.click(cancelBtn);

    expect(mockHideInstance).toHaveBeenCalled();
  });

  it("renders Google login button", () => {
    render(<LoginDialog id="login-dialog" />);
    // Adjust selector/text based on the actual button label
    const googleBtn = screen.getByRole("button", {
      name: /auth\.login_with_google/i,
    });
    expect(googleBtn).toBeInTheDocument();
  });
});
