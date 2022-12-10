import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import HomePage from "./HomePage";

describe("HomePage", () => {
  test("Should render", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", {
        name: /home/i,
      }),
    ).toBeInTheDocument();
  });
});
