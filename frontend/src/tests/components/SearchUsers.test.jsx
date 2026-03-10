import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import SearchUsers from "../../components/SearchUsers";

const routerMocks = vi.hoisted(() => ({
  navigate: vi.fn(),
}));

const supabaseMocks = vi.hoisted(() => {
  const ilike = vi.fn();
  const select = vi.fn(() => ({ ilike }));

  return {
    ilike,
    select,
    from: vi.fn(() => ({ select })),
  };
});

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => routerMocks.navigate,
  };
});

vi.mock("../../lib/supabase", () => ({
  supabase: {
    from: supabaseMocks.from,
  },
}));

describe("SearchUsers", () => {
  beforeEach(() => {
    routerMocks.navigate.mockReset();
    supabaseMocks.from.mockClear();
    supabaseMocks.select.mockClear();
    supabaseMocks.ilike.mockReset();
  });

  it("searches users and renders results", async () => {
    supabaseMocks.ilike.mockResolvedValue({
      data: [
        {
          id: "user-1",
          username: "tester",
          email: "tester@example.com",
          avatar: "",
        },
      ],
      error: null,
    });

    render(
      <MemoryRouter>
        <SearchUsers />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByPlaceholderText("Search users by name..."), {
      target: { value: "test" },
    });
    fireEvent.submit(screen.getByRole("textbox").closest("form"));

    await waitFor(() => {
      expect(supabaseMocks.from).toHaveBeenCalledWith("users");
    });
    expect(supabaseMocks.select).toHaveBeenCalledWith(
      "id, username, email, avatar",
    );
    expect(supabaseMocks.ilike).toHaveBeenCalledWith("username", "%test%");
    expect(screen.getByText("tester")).toBeInTheDocument();
    expect(screen.getByText("tester@example.com")).toBeInTheDocument();
  });

  it("calls onUserSelect when a result is chosen", async () => {
    const onUserSelect = vi.fn();

    supabaseMocks.ilike.mockResolvedValue({
      data: [
        {
          id: "user-2",
          username: "jane",
          email: "jane@example.com",
          avatar: "",
        },
      ],
      error: null,
    });

    render(
      <MemoryRouter>
        <SearchUsers onUserSelect={onUserSelect} />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByPlaceholderText("Search users by name..."), {
      target: { value: "jane" },
    });
    fireEvent.submit(screen.getByRole("textbox").closest("form"));

    await waitFor(() => {
      expect(screen.getByText("jane")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("jane"));

    expect(onUserSelect).toHaveBeenCalledWith({
      id: "user-2",
      username: "jane",
      email: "jane@example.com",
      avatar: "",
    });
    expect(routerMocks.navigate).not.toHaveBeenCalled();
  });
});
