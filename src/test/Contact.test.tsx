import { describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import Contact from "@/pages/Contact";

vi.mock("@/components/layout/Layout", () => ({
  Layout: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/components/shared/FaqSection", () => ({
  FaqSection: () => <div>FAQ</div>,
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
    i18n: { language: "en", dir: () => "ltr" },
  }),
}));

describe("Contact page", () => {
  it("shows CTA link to standalone sell-land page", () => {
    render(
      <MemoryRouter>
        <Contact />
      </MemoryRouter>,
    );

    const sellLandLinks = screen.getAllByRole("link", { name: /sell land/i });
    expect(sellLandLinks.length).toBeGreaterThan(0);
    expect(sellLandLinks[0]).toHaveAttribute("href", "/sell-land");
  });
});
