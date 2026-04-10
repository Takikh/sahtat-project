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
      role: null,
      isAdmin: false,
      isSecretary: false,
      isSuperAdmin: false,
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
      role: "client",
      isAdmin: false,
      isSecretary: false,
      isSuperAdmin: false,
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

  it("redirects non-admin users to /dashboard when admin route is required", () => {
    mockedUseAuth.mockReturnValue({
      user: { id: "u2" } as never,
      session: null,
      loading: false,
      role: "client",
      isAdmin: false,
      isSecretary: false,
      isSuperAdmin: false,
      signUp: vi.fn(),
      signIn: vi.fn(),
      signOut: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={["/admin"]}>
        <Routes>
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin>
                <div>Admin page</div>
              </ProtectedRoute>
            }
          />
          <Route path="/dashboard" element={<div>Dashboard page</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Dashboard page")).toBeInTheDocument();
  });
});
