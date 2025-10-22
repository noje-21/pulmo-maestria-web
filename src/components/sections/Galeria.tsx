import gallery1 from "@/assets/secion/maestria1.jpg";
import gallery12 from "@/assets/secion/maestria12.jpg";
import gallery13 from "@/assets/secion/maestria13.jpg";
import gallery14 from "@/assets/secion/maestria14.jpg";
import gallery15 from "@/assets/secion/maestria15.jpg";
import gallery2 from "@/assets/secion/maestria2.jpg";
import gallery22 from "@/assets/secion/maestria22.jpg";
import gallery23 from "@/assets/secion/maestria23.jpg";
import gallery24 from "@/assets/secion/maestria24.jpg";
import gallery25 from "@/assets/secion/maestria25.jpg";

const images = [
  { src: gallery1, alt: "Sesión académica 2022" },
  { src: gallery12, alt: "Sesión académica 2022" },
  { src: gallery13, alt: "Sesión académica 2022" },
  { src: gallery14, alt: "Sesión académica 2022" },
  { src: gallery15, alt: "Sesión académica 2022" },
  { src: gallery2, alt: "Sesión académica 2023" },
  { src: gallery22, alt: "Sesión académica 2023" },
  { src: gallery23, alt: "Sesión académica 2023" },
  { src: gallery24, alt: "Sesión académica 2023" },
  { src: gallery25, alt: "Sesión académica 2023" }
];

export const Galeria = () => {
  return (
    <section id="galeria" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4 text-center">
          Galería
        </h2>
        <p className="text-xl text-muted-foreground mb-12 text-center">
          Momentos destacados de nuestras sesiones académicas
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image, index) => (
            <div 
              key={index}
              className="relative overflow-hidden rounded-lg shadow-lg group cursor-pointer aspect-video"
            >
              <img 
                src={image.src} 
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <p className="text-white font-medium">{image.alt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
