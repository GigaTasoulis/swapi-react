import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import DetailRow from "./DetailRow";

describe("DetailRow", () => {
  it("renders the label and value", () => {
    render(<DetailRow label="Born" value="19BBY" />);
    expect(screen.getByText("Born")).toBeInTheDocument();
    expect(screen.getByText("19BBY")).toBeInTheDocument();
  });

  it("renders numeric values", () => {
    render(<DetailRow label="Episode" value={4} />);
    expect(screen.getByText("4")).toBeInTheDocument();
  });

  it("uses semantic dt and dd tags", () => {
    const { container } = render(<DetailRow label="Born" value="19BBY" />);
    expect(container.querySelector("dt")).toHaveTextContent("Born");
    expect(container.querySelector("dd")).toHaveTextContent("19BBY");
  });
});
