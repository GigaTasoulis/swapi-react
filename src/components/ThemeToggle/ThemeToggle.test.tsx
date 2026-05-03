import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ThemeToggle from "./ThemeToggle";

beforeEach(() => {
  localStorage.clear();
  delete document.documentElement.dataset.theme;
});

afterEach(() => {
  delete document.documentElement.dataset.theme;
});

describe("ThemeToggle", () => {
  it("renders three options", () => {
    render(<ThemeToggle />);
    expect(
      screen.getByRole("radio", { name: "Light mode" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("radio", { name: "System mode" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("radio", { name: "Dark mode" }),
    ).toBeInTheDocument();
  });

  it('marks "system" as checked by default', () => {
    render(<ThemeToggle />);
    expect(screen.getByRole("radio", { name: "System mode" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    expect(screen.getByRole("radio", { name: "Light mode" })).toHaveAttribute(
      "aria-checked",
      "false",
    );
    expect(screen.getByRole("radio", { name: "Dark mode" })).toHaveAttribute(
      "aria-checked",
      "false",
    );
  });

  it("marks the stored preference as checked on mount", () => {
    localStorage.setItem("swapi-theme", "dark");
    render(<ThemeToggle />);
    expect(screen.getByRole("radio", { name: "Dark mode" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
  });

  it("switches to dark when the Dark button is clicked", async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);

    await user.click(screen.getByRole("radio", { name: "Dark mode" }));

    expect(screen.getByRole("radio", { name: "Dark mode" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(localStorage.getItem("swapi-theme")).toBe("dark");
  });

  it("switches to light when the Light button is clicked", async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);

    await user.click(screen.getByRole("radio", { name: "Light mode" }));

    expect(screen.getByRole("radio", { name: "Light mode" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    expect(document.documentElement.dataset.theme).toBe("light");
  });

  it("removes data-theme when switching back to system", async () => {
    const user = userEvent.setup();
    localStorage.setItem("swapi-theme", "dark");
    render(<ThemeToggle />);

    await user.click(screen.getByRole("radio", { name: "System mode" }));

    expect(document.documentElement.dataset.theme).toBeUndefined();
  });

  it("wraps options in a radiogroup with accessible label", () => {
    render(<ThemeToggle />);
    expect(
      screen.getByRole("radiogroup", { name: "Theme" }),
    ).toBeInTheDocument();
  });
});
