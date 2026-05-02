import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchInput from "./SearchInput";

describe("SearchInput", () => {
  it("renders the label for accessibility", () => {
    render(
      <SearchInput value="" onChange={() => {}} label="Search characters" />,
    );
    expect(screen.getByLabelText("Search characters")).toBeInTheDocument();
  });

  it("shows the current value", () => {
    render(<SearchInput value="Luke" onChange={() => {}} label="Search" />);
    expect(screen.getByLabelText("Search")).toHaveValue("Luke");
  });

  it("calls onChange with the new value as the user types", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<SearchInput value="" onChange={handleChange} label="Search" />);
    await user.type(screen.getByLabelText("Search"), "L");

    expect(handleChange).toHaveBeenCalledWith("L");
  });

  it("does not show the clear button when empty", () => {
    render(<SearchInput value="" onChange={() => {}} label="Search" />);
    expect(
      screen.queryByRole("button", { name: "Clear search" }),
    ).not.toBeInTheDocument();
  });

  it("shows the clear button when there is a value", () => {
    render(<SearchInput value="Luke" onChange={() => {}} label="Search" />);
    expect(
      screen.getByRole("button", { name: "Clear search" }),
    ).toBeInTheDocument();
  });

  it("calls onChange with empty string when the clear button is clicked", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<SearchInput value="Luke" onChange={handleChange} label="Search" />);
    await user.click(screen.getByRole("button", { name: "Clear search" }));

    expect(handleChange).toHaveBeenCalledWith("");
  });

  it("uses the provided placeholder", () => {
    render(
      <SearchInput
        value=""
        onChange={() => {}}
        label="Search"
        placeholder="Type a name…"
      />,
    );
    expect(screen.getByPlaceholderText("Type a name…")).toBeInTheDocument();
  });
});
