import { describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import { ProtectedRoute } from "@/components/ProtectedRoute";

vi.mock("@/hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from "@/hooks/useAuth";

const mockedUseAuth = vi.mocked(useAuth);

describe("ProtectedRoute", () => {
  it("redirects unauthenticated user to /auth", () => {
    mockedUseAuth.mockReturnValue({
      user: null,
      session: null,
      loading: false,
      isAdmin: false,
      signUp: vi.fn(),
      signIn: vi.fn(),
      signOut: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={["/private"]}>
        <Routes>
          <Route
            path="/private"
            element={
              <ProtectedRoute>
                <div>Private page</div>
              </ProtectedRoute>
            }
          />
          <Route path="/auth" element={<div>Auth page</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Auth page")).toBeInTheDocument();
  });

  it("renders children for authenticated user", () => {
    mockedUseAuth.mockReturnValue({
      user: { id: "u1" } as never,
      session: null,
      loading: false,
      isAdmin: false,
      signUp: vi.fn(),
      signIn: vi.fn(),
      signOut: vi.fn(),
    });

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Private page</div>
        </ProtectedRoute>
      </MemoryRouter>,
    );

    expect(screen.getByText("Private page")).toBeInTheDocument();
  });
});
