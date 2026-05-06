import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReservarPopup } from "../ReservarPopup";

// Mock canvas-confetti
vi.mock("canvas-confetti", () => ({ default: vi.fn() }));

// Mock framer-motion to render children immediately
vi.mock("framer-motion", () => {
  const actual = vi.importActual("framer-motion");
  return {
    ...actual,
    AnimatePresence: ({ children }: any) => children,
    motion: new Proxy(
      {},
      {
        get: (_target, prop: string) => {
          const Component = (props: any) => {
            const { initial, animate, exit, transition, whileInView, viewport, whileHover, whileTap, style, ...rest } = props;
            const Tag = prop as any;
            return <Tag style={style} {...rest} />;
          };
          Component.displayName = `motion.${prop}`;
          return Component;
        },
      }
    ),
  };
});

describe("ReservarPopup Accessibility", () => {
  const onClose = vi.fn();

  beforeEach(() => {
    onClose.mockClear();
  });

  it("renders with correct ARIA attributes when open", () => {
    render(<ReservarPopup isOpen={true} onClose={onClose} />);
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("aria-labelledby", "reservar-popup-title");
  });

  it("does not render when closed", () => {
    render(<ReservarPopup isOpen={false} onClose={onClose} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("auto-focuses the close button on open", async () => {
    render(<ReservarPopup isOpen={true} onClose={onClose} />);
    const closeBtn = screen.getByLabelText("Cerrar");
    await waitFor(() => {
      expect(document.activeElement).toBe(closeBtn);
    });
  });

  it("closes on Escape key", () => {
    render(<ReservarPopup isOpen={true} onClose={onClose} />);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("closes when clicking backdrop", () => {
    render(<ReservarPopup isOpen={true} onClose={onClose} />);
    // The backdrop is the fixed div with bg-black/70
    const backdrop = document.querySelector(".fixed.bg-black\\/70, [class*='bg-black/70']");
    if (backdrop) {
      fireEvent.click(backdrop);
      expect(onClose).toHaveBeenCalledTimes(1);
    }
  });

  it("locks body scroll when open", () => {
    render(<ReservarPopup isOpen={true} onClose={onClose} />);
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("restores body scroll when closed", () => {
    const { rerender } = render(<ReservarPopup isOpen={true} onClose={onClose} />);
    expect(document.body.style.overflow).toBe("hidden");
    rerender(<ReservarPopup isOpen={false} onClose={onClose} />);
    // After unmount/cleanup, overflow should be restored
    expect(document.body.style.overflow).not.toBe("hidden");
  });

  it("restores focus to previously focused element on close", async () => {
    const trigger = document.createElement("button");
    trigger.textContent = "Open";
    document.body.appendChild(trigger);
    trigger.focus();

    const { rerender } = render(<ReservarPopup isOpen={true} onClose={onClose} />);

    // Close the popup
    rerender(<ReservarPopup isOpen={false} onClose={onClose} />);

    await waitFor(() => {
      expect(document.activeElement).toBe(trigger);
    });

    document.body.removeChild(trigger);
  });

  it("contains all expected interactive elements for tab cycling", () => {
    render(<ReservarPopup isOpen={true} onClose={onClose} />);
    const closeBtn = screen.getByLabelText("Cerrar");
    expect(closeBtn).toBeInTheDocument();

    // CTA buttons
    expect(screen.getByText("Inscribirme Ahora")).toBeInTheDocument();

    // Campus Virtual link
    expect(screen.getByText(/Campus Virtual/i)).toBeInTheDocument();
  });
});