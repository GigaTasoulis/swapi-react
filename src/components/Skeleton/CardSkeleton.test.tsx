import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import CardSkeleton from "./CardSkeleton";

describe("CardSkeleton", () => {
  it("is hidden from assistive tech", () => {
    const { container } = render(<CardSkeleton />);
    expect(container.firstChild).toHaveAttribute("aria-hidden", "true");
  });

  it("renders three skeleton placeholders (title, subtitle, action)", () => {
    const { container } = render(<CardSkeleton />);
    // Three Skeleton components → three direct skeleton elements with the shimmer class.
    // We use a wildcard-friendly selector: any element with role-less span and aria-hidden.
    const skeletons = container.querySelectorAll('[aria-hidden="true"] span');
    expect(skeletons.length).toBeGreaterThanOrEqual(3);
  });
});
