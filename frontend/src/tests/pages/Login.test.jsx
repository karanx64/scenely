import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Login from "../../pages/Login";

const navigate = vi.fn();
const signIn = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigate,
  };
});

vi.mock("../../contexts/AuthContext", () => ({
  useAuth: () => ({
    signIn,
  }),
}));

describe("Login", () => {
  beforeEach(() => {
    navigate.mockReset();
    signIn.mockReset();
  });

  it("submits credentials and redirects on success", async () => {
    signIn.mockResolvedValue({ user: { id: "123" } });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith("test@example.com", "password123");
    });
    expect(navigate).toHaveBeenCalledWith("/");
  });

  it("renders an error message when sign in fails", async () => {
    signIn.mockRejectedValue(new Error("Invalid credentials"));

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "bad@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "wrong" },
    });
    fireEvent.submit(screen.getByRole("button", { name: "Login" }).closest("form"));

    await waitFor(() => {
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });
  });
});
