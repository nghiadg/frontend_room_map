import { renderHook, waitFor } from "@testing-library/react";
import { useAuth } from "./useAuth";

// Suppress jsdom navigation errors before any setup
const originalError = console.error;
console.error = (...args: unknown[]) => {
  // Check for jsdom navigation error (both string and Error object forms)
  const message = args[0];
  if (
    (typeof message === "string" &&
      message.includes("Not implemented: navigation")) ||
    (message instanceof Error &&
      message.message?.includes("Not implemented: navigation")) ||
    (typeof message === "object" &&
      message !== null &&
      "type" in message &&
      (message as { type: string }).type === "not implemented")
  ) {
    return;
  }
  originalError.call(console, ...args);
};

// Mock dependencies - use jest.fn() directly to avoid hoisting issues
const mockSignInWithOAuth = jest.fn();
const mockSignOut = jest.fn();

jest.mock("@/lib/supabase/client");
jest.mock("@/lib/errors");
jest.mock("./useBoolean");

import { createSupabaseClient } from "@/lib/supabase/client";
import { errorHandler } from "@/lib/errors";
import { useBoolean } from "./useBoolean";

// Setup mocks after imports
(createSupabaseClient as jest.Mock).mockReturnValue({
  auth: {
    signInWithOAuth: mockSignInWithOAuth,
    signOut: mockSignOut,
  },
});

(errorHandler as jest.Mock).mockImplementation(() => {});

(useBoolean as jest.Mock).mockReturnValue({
  value: false,
  setTrue: jest.fn(),
  setFalse: jest.fn(),
});

describe("useAuth", () => {
  beforeAll(() => {
    // Mock window.location
    // @ts-expect-error - Delete existing location
    delete window.location;
    // @ts-expect-error - Set mocked location
    window.location = { origin: "http://localhost" };
  });

  afterAll(() => {
    // Restore console.error
    console.error = originalError;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize with isLoading false", () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.isLoading).toBe(false);
  });

  it("signInWithGoogle calls supabase.auth.signInWithOAuth with correct params", async () => {
    mockSignInWithOAuth.mockResolvedValue({ error: null });
    const { result } = renderHook(() => useAuth());

    await result.current.signInWithGoogle();

    expect(mockSignInWithOAuth).toHaveBeenCalledWith({
      provider: "google",
      options: {
        redirectTo: "http://localhost/auth/callback",
      },
    });
  });

  it("signInWithGoogle handles errors", async () => {
    const error = new Error("Sign in failed!");
    mockSignInWithOAuth.mockResolvedValue({ error });
    const { result } = renderHook(() => useAuth());

    await result.current.signInWithGoogle();

    await waitFor(() => {
      expect(errorHandler).toHaveBeenCalledWith(error, {
        title: "Sign in with Google failed",
      });
    });
  });

  it("signOut calls supabase.auth.signOut", async () => {
    mockSignOut.mockResolvedValue({});
    const { result } = renderHook(() => useAuth());

    await result.current.signOut();

    expect(mockSignOut).toHaveBeenCalled();
  });

  it("signOut handles errors", async () => {
    const error = new Error("Sign out failed!");
    mockSignOut.mockRejectedValue(error);
    const { result } = renderHook(() => useAuth());

    await result.current.signOut();

    await waitFor(() => {
      expect(errorHandler).toHaveBeenCalledWith(error, {
        title: "Sign out failed",
      });
    });
  });
});
