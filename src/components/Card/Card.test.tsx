import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Card from "./Card";

function renderCard(props: { to: string; title: string; subtitle?: string }) {
  return render(
    <MemoryRouter>
      <Card {...props} />
    </MemoryRouter>,
  );
}

describe("Card", () => {
  it("renders the title", () => {
    renderCard({ to: "/characters/1", title: "Luke Skywalker" });
    expect(
      screen.getByRole("heading", { name: "Luke Skywalker" }),
    ).toBeInTheDocument();
  });

  it("renders the subtitle when provided", () => {
    renderCard({ to: "/characters/1", title: "Luke", subtitle: "Born 19BBY" });
    expect(screen.getByText("Born 19BBY")).toBeInTheDocument();
  });

  it("does not render a subtitle element when none is provided", () => {
    const { container } = renderCard({ to: "/characters/1", title: "Luke" });
    expect(container.querySelector("p")).not.toBeInTheDocument();
  });

  it("links to the given route", () => {
    renderCard({ to: "/characters/1", title: "Luke" });
    const link = screen.getByRole("link", { name: /Luke/ });
    expect(link).toHaveAttribute("href", "/characters/1");
  });
});
