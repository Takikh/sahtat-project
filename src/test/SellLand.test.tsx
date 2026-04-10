import { describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import SellLand from "@/pages/SellLand";

vi.mock("@/components/layout/Layout", () => ({
  Layout: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/hooks/useSeo", () => ({
  useSeo: () => {},
}));

vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: vi.fn() }),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, fallback?: string) => fallback || key,
  }),
}));

describe("SellLand page", () => {
  it("renders dedicated land offer title and submit button", () => {
    render(
      <MemoryRouter>
        <SellLand />
      </MemoryRouter>,
    );

    expect(screen.getByText("sellLand.title")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit land offer/i })).toBeInTheDocument();
  });
});
