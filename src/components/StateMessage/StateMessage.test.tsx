import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import StateMessage from "./StateMessage";

describe("StateMessage", () => {
  it("renders the title", () => {
    render(<StateMessage variant="loading" title="Loading characters…" />);
    expect(screen.getByText("Loading characters…")).toBeInTheDocument();
  });

  it("renders the description when provided", () => {
    render(
      <StateMessage
        variant="error"
        title="Couldn't load"
        description="Try again in a moment."
      />,
    );
    expect(screen.getByText("Try again in a moment.")).toBeInTheDocument();
  });

  it("does not render description when none is provided", () => {
    const { container } = render(
      <StateMessage variant="empty" title="No items" />,
    );
    // Only the title <p> should exist
    expect(container.querySelectorAll("p")).toHaveLength(1);
  });

  it('uses role="alert" for error variant', () => {
    render(<StateMessage variant="error" title="Boom" />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it('uses role="status" for loading variant', () => {
    render(<StateMessage variant="loading" title="Loading…" />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it('uses role="status" for empty variant', () => {
    render(<StateMessage variant="empty" title="Nothing here" />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders the action node when provided", () => {
    render(
      <StateMessage
        variant="error"
        title="Boom"
        action={<button>Try again</button>}
      />,
    );
    expect(
      screen.getByRole("button", { name: "Try again" }),
    ).toBeInTheDocument();
  });
});
