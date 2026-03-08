// @ts-nocheck
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import BlurUpImage from "../BlurUpImage";

describe("BlurUpImage", () => {
  const defaultProps = {
    src: "/test-image.jpg",
    alt: "Test image",
    onClick: vi.fn(),
  };

  it("renders the main image with correct attributes", () => {
    render(<BlurUpImage {...defaultProps} />);
    const img = screen.getByAlt("Test image");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "/test-image.jpg");
    expect(img).toHaveAttribute("loading", "lazy");
    expect(img).toHaveAttribute("decoding", "async");
  });

  it("shows skeleton placeholder before image loads", () => {
    const { container } = render(<BlurUpImage {...defaultProps} />);
    const skeleton = container.querySelector(".animate-pulse");
    expect(skeleton).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const onClick = vi.fn();
    render(<BlurUpImage {...defaultProps} onClick={onClick} />);
    const wrapper = screen.getByAlt("Test image").closest("div");
    fireEvent.click(wrapper!);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("applies custom className", () => {
    const { container } = render(<BlurUpImage {...defaultProps} className="custom-class" />);
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("displays alt text in overlay", () => {
    render(<BlurUpImage {...defaultProps} />);
    const overlayText = screen.getByText("Test image");
    expect(overlayText).toBeInTheDocument();
  });

  it("hides skeleton after image loads", () => {
    const { container } = render(<BlurUpImage {...defaultProps} />);
    const img = screen.getByAlt("Test image");
    fireEvent.load(img);
    const skeleton = container.querySelector(".animate-pulse");
    expect(skeleton).not.toBeInTheDocument();
  });

  it("transitions to full opacity after load", () => {
    render(<BlurUpImage {...defaultProps} />);
    const img = screen.getByAlt("Test image");
    expect(img.className).toContain("opacity-0");
    fireEvent.load(img);
    expect(img.className).toContain("opacity-100");
  });
});
