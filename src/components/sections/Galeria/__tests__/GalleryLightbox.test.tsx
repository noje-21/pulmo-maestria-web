import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import GalleryLightbox from "../GalleryLightbox";

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  motion: {
    div: ({ children, onClick, className, ...props }: any) => (
      <div onClick={onClick} className={className} data-testid={props["data-testid"]}>
        {children}
      </div>
    ),
  },
}));

describe("GalleryLightbox", () => {
  const mockHandlers = {
    onClose: vi.fn(),
    onPrev: vi.fn(),
    onNext: vi.fn(),
  };

  const selectedImage = {
    src: "/test.jpg",
    alt: "Evaluación Hemodinámica",
    category: "Hemodinamia",
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders nothing when selectedImage is null", () => {
    const { container } = render(
      <GalleryLightbox selectedImage={null} {...mockHandlers} />
    );
    expect(container.innerHTML).toBe("");
  });

  it("renders image when selectedImage is provided", () => {
    render(<GalleryLightbox selectedImage={selectedImage} {...mockHandlers} />);
    const img = screen.getByAlt("Evaluación Hemodinámica");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "/test.jpg");
  });

  it("displays caption text", () => {
    render(<GalleryLightbox selectedImage={selectedImage} {...mockHandlers} />);
    expect(screen.getByText("Evaluación Hemodinámica")).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    render(<GalleryLightbox selectedImage={selectedImage} {...mockHandlers} />);
    const closeBtn = screen.getByLabelText("Cerrar");
    fireEvent.click(closeBtn);
    expect(mockHandlers.onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onPrev when previous button is clicked", () => {
    render(<GalleryLightbox selectedImage={selectedImage} {...mockHandlers} />);
    const prevBtn = screen.getByLabelText("Imagen anterior");
    fireEvent.click(prevBtn);
    expect(mockHandlers.onPrev).toHaveBeenCalledTimes(1);
  });

  it("calls onNext when next button is clicked", () => {
    render(<GalleryLightbox selectedImage={selectedImage} {...mockHandlers} />);
    const nextBtn = screen.getByLabelText("Imagen siguiente");
    fireEvent.click(nextBtn);
    expect(mockHandlers.onNext).toHaveBeenCalledTimes(1);
  });

  it("renders image with eager loading for lightbox", () => {
    render(<GalleryLightbox selectedImage={selectedImage} {...mockHandlers} />);
    const img = screen.getByAlt("Evaluación Hemodinámica");
    expect(img).toHaveAttribute("loading", "eager");
  });

  it("has all three control buttons", () => {
    render(<GalleryLightbox selectedImage={selectedImage} {...mockHandlers} />);
    expect(screen.getByLabelText("Cerrar")).toBeInTheDocument();
    expect(screen.getByLabelText("Imagen anterior")).toBeInTheDocument();
    expect(screen.getByLabelText("Imagen siguiente")).toBeInTheDocument();
  });
});
