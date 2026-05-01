import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Pagination from "./Pagination";

describe("Pagination", () => {
  it("shows the current page", () => {
    render(<Pagination page={3} hasPrevious hasNext onPageChange={() => {}} />);
    expect(screen.getByText("Page 3")).toBeInTheDocument();
  });

  it("disables Previous when hasPrevious is false", () => {
    render(
      <Pagination
        page={1}
        hasPrevious={false}
        hasNext
        onPageChange={() => {}}
      />,
    );
    expect(screen.getByRole("button", { name: /Previous/ })).toBeDisabled();
  });

  it("disables Next when hasNext is false", () => {
    render(
      <Pagination
        page={9}
        hasPrevious
        hasNext={false}
        onPageChange={() => {}}
      />,
    );
    expect(screen.getByRole("button", { name: /Next/ })).toBeDisabled();
  });

  it("calls onPageChange with the next page when Next is clicked", async () => {
    const user = userEvent.setup();
    const handlePageChange = vi.fn();

    render(
      <Pagination
        page={2}
        hasPrevious
        hasNext
        onPageChange={handlePageChange}
      />,
    );
    await user.click(screen.getByRole("button", { name: /Next/ }));

    expect(handlePageChange).toHaveBeenCalledWith(3);
  });

  it("calls onPageChange with the previous page when Previous is clicked", async () => {
    const user = userEvent.setup();
    const handlePageChange = vi.fn();

    render(
      <Pagination
        page={2}
        hasPrevious
        hasNext
        onPageChange={handlePageChange}
      />,
    );
    await user.click(screen.getByRole("button", { name: /Previous/ }));

    expect(handlePageChange).toHaveBeenCalledWith(1);
  });

  it("does not call onPageChange when a disabled button is clicked", async () => {
    const user = userEvent.setup();
    const handlePageChange = vi.fn();

    render(
      <Pagination
        page={1}
        hasPrevious={false}
        hasNext
        onPageChange={handlePageChange}
      />,
    );
    await user.click(screen.getByRole("button", { name: /Previous/ }));

    expect(handlePageChange).not.toHaveBeenCalled();
  });
});
