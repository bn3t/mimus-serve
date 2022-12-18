import { describe, test, expect, vi } from "vitest";
import { render, screen } from "$test-utils/index";
import "@testing-library/jest-dom";
import ScenariosPage from "./ScenariosPage";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
vi.mock("$lib/hooks/query-scenarios");

describe("ScenariosPage", () => {
  test("Should render", () => {
    render(<ScenariosPage />);

    expect(
      screen.getByRole("heading", {
        name: /scenarios/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("cell", {
        name: /login/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("cell", {
        name: /started/i,
      }),
    ).toBeInTheDocument();
  });
});
