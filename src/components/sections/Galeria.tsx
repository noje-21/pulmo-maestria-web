import gallery1 from "@/assets/secion/maestria1.jpg";
import gallery12 from "@/assets/secion/maestria12.jpg";
import gallery13 from "@/assets/secion/maestria13.jpg";
import gallery14 from "@/assets/secion/maestria14.jpg";
import gallery15 from "@/assets/secion/maestria15.jpg";
import gallery16 from "@/assets/secion/maestria16.jpg";
import gallery2 from "@/assets/secion/maestria2.jpg";
import gallery22 from "@/assets/secion/maestria22.jpg";
import gallery23 from "@/assets/secion/maestria23.jpg";
import gallery24 from "@/assets/secion/maestria24.jpg";
import gallery25 from "@/assets/secion/maestria25.jpg";
import gallery26 from "@/assets/secion/maestria26.jpg";
import gallery3 from "@/assets/secion/maestria3.jpg";
import gallery32 from "@/assets/secion/maestria32.jpg";
import gallery33 from "@/assets/secion/maestria33.jpg";
import gallery34 from "@/assets/secion/maestria34.jpg";
import gallery35 from "@/assets/secion/maestria35.jpg";
import gallery36 from "@/assets/secion/maestria36.jpg";

const galeriasPorAño = {
  2022: [
    gallery1, gallery12, gallery13, gallery14, gallery15, gallery16
  ],
  2023: [
    gallery2, gallery22, gallery23, gallery24, gallery25, gallery26
  ],
  2024: [
    gallery3, gallery32, gallery33, gallery34, gallery35, gallery36
  ],
};

export const Galeria = () => {
  return (
    <section id="galeria" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4 text-center">
          Galería
        </h2>
        <p className="text-xl text-muted-foreground mb-12 text-center">
          Momentos destacados en nuestras sesiones académicas
        </p>

        {/* Recorremos cada año */}
        {Object.entries(galeriasPorAño).map(([año, imagenes]) => (
          <div key={año} className="mb-16">
            {/* Título del año */}
            <h3 className="text-3xl font-semibold text-primary mb-6 text-center">
              Sesiones {año}
            </h3>

            {/* Grid de imágenes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {imagenes.map((src, index) => (
                <div
                  key={index}
                  className="relative overflow-hidden rounded-lg shadow-lg group cursor-pointer aspect-video"
                >
                  <img
                    src={src}
                    alt={`Sesión académica ${año}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <p className="text-white font-medium">Sesión académica {año}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};