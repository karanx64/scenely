import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthProvider, useAuth } from "../../contexts/AuthContext";

const supabaseMocks = vi.hoisted(() => {
  const insert = vi.fn();

  return {
    getSession: vi.fn(),
    onAuthStateChange: vi.fn(),
    signUp: vi.fn(),
    signInWithPassword: vi.fn(),
    signOut: vi.fn(),
    insert,
    from: vi.fn(() => ({ insert })),
  };
});

vi.mock("../../lib/supabase", () => ({
  supabase: {
    auth: {
      getSession: supabaseMocks.getSession,
      onAuthStateChange: supabaseMocks.onAuthStateChange,
      signUp: supabaseMocks.signUp,
      signInWithPassword: supabaseMocks.signInWithPassword,
      signOut: supabaseMocks.signOut,
    },
    from: supabaseMocks.from,
  },
}));

function AuthConsumer() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Not logged in</div>;
  return <div>{user.email}</div>;
}

describe("AuthContext", () => {
  beforeEach(() => {
    supabaseMocks.getSession.mockReset();
    supabaseMocks.onAuthStateChange.mockReset();
    supabaseMocks.signUp.mockReset();
    supabaseMocks.signInWithPassword.mockReset();
    supabaseMocks.signOut.mockReset();
    supabaseMocks.from.mockClear();
    supabaseMocks.insert.mockReset();
  });

  it("exposes unauthenticated state after session load", async () => {
    supabaseMocks.getSession.mockResolvedValue({ data: { session: null } });
    supabaseMocks.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });

    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>,
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Not logged in")).toBeInTheDocument();
    });
  });

  it("creates a public user profile after sign up", async () => {
    const createdUser = { id: "user-1", email: "test@example.com" };

    supabaseMocks.getSession.mockResolvedValue({ data: { session: null } });
    supabaseMocks.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });
    supabaseMocks.signUp.mockResolvedValue({
      data: { user: createdUser },
      error: null,
    });
    supabaseMocks.insert.mockResolvedValue({ error: null });

    let authValue;

    function CaptureAuth() {
      authValue = useAuth();
      return null;
    }

    render(
      <AuthProvider>
        <CaptureAuth />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(authValue.loading).toBe(false);
    });

    await authValue.signUp("test@example.com", "password123", "tester");

    expect(supabaseMocks.signUp).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
      options: {
        data: {
          username: "tester",
        },
      },
    });
    expect(supabaseMocks.from).toHaveBeenCalledWith("users");
    expect(supabaseMocks.insert).toHaveBeenCalledWith({
      id: "user-1",
      username: "tester",
      email: "test@example.com",
    });
  });
});
