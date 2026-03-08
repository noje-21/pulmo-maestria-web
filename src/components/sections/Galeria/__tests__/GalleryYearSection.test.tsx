// @ts-nocheck
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import GalleryYearSection from "../GalleryYearSection";
import type { YearGallery } from "../types";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, className }: any) => <div className={className}>{children}</div>,
  },
}));

// Mock Swiper components
vi.mock("swiper/react", () => ({
  Swiper: ({ children }: any) => <div data-testid="swiper">{children}</div>,
  SwiperSlide: ({ children }: any) => <div data-testid="swiper-slide">{children}</div>,
}));

vi.mock("swiper/modules", () => ({
  Autoplay: {},
  Navigation: {},
  Pagination: {},
}));

const mockGallery: YearGallery = {
  year: 2024,
  title: "Programa Académico 2024",
  subtitle: "Innovación en Circulación Pulmonar",
  description: "Avances en hemodinamia",
  hero: "/hero-2024.jpg",
  images: [
    { src: "/img1.jpg", alt: "Imagen 1", category: "Cat 1" },
    { src: "/img2.jpg", alt: "Imagen 2", category: "Cat 2" },
  ],
};

describe("GalleryYearSection", () => {
  const onImageClick = vi.fn();

  it("renders the year badge", () => {
    render(
      <GalleryYearSection gallery={mockGallery} galleryIndex={0} onImageClick={onImageClick} />
    );
    expect(screen.getByText("2024")).toBeInTheDocument();
  });

  it("renders the title and subtitle", () => {
    render(
      <GalleryYearSection gallery={mockGallery} galleryIndex={0} onImageClick={onImageClick} />
    );
    expect(screen.getByText("Programa Académico 2024")).toBeInTheDocument();
    expect(screen.getByText("Innovación en Circulación Pulmonar")).toBeInTheDocument();
  });

  it("renders the description", () => {
    render(
      <GalleryYearSection gallery={mockGallery} galleryIndex={0} onImageClick={onImageClick} />
    );
    expect(screen.getByText("Avances en hemodinamia")).toBeInTheDocument();
  });

  it("renders hero banner image", () => {
    render(
      <GalleryYearSection gallery={mockGallery} galleryIndex={0} onImageClick={onImageClick} />
    );
    const heroImg = screen.getByAlt("Edición 2024");
    expect(heroImg).toBeInTheDocument();
    expect(heroImg).toHaveAttribute("src", "/hero-2024.jpg");
    expect(heroImg).toHaveAttribute("loading", "lazy");
  });

  it("renders swiper with correct number of slides", () => {
    render(
      <GalleryYearSection gallery={mockGallery} galleryIndex={0} onImageClick={onImageClick} />
    );
    const slides = screen.getAllByTestId("swiper-slide");
    expect(slides).toHaveLength(2);
  });

  it("renders navigation buttons", () => {
    render(
      <GalleryYearSection gallery={mockGallery} galleryIndex={0} onImageClick={onImageClick} />
    );
    expect(screen.getByLabelText("Anterior")).toBeInTheDocument();
    expect(screen.getByLabelText("Siguiente")).toBeInTheDocument();
  });

  it("renders all gallery images with alt text", () => {
    render(
      <GalleryYearSection gallery={mockGallery} galleryIndex={0} onImageClick={onImageClick} />
    );
    // BlurUpImage renders alt text both on img and in overlay
    expect(screen.getAllByText("Imagen 1").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Imagen 2").length).toBeGreaterThanOrEqual(1);
  });
});
