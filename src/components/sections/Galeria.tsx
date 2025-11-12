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
    <section id="galeria" className="py-20 bg-gradient-to-b from-muted/30 to-background relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4 text-center animate-fade-in">
          Galería de Momentos
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto mb-4 rounded-full"></div>
        <p className="text-xl text-muted-foreground mb-12 text-center">
          Momentos destacados en nuestras sesiones académicas
        </p>

        {Object.entries(galeriasPorAño).map(([año, imagenes]) => (
          <div key={año} className="mb-20">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-accent"></div>
              <h3 className="text-3xl font-bold text-primary bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Sesiones {año}
              </h3>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-accent"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {imagenes.map((src, index) => (
                <div
                  key={index}
                  className="relative overflow-hidden rounded-2xl shadow-xl group cursor-pointer aspect-video border-4 border-transparent hover:border-accent/30 transition-all duration-500"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <img
                    src={src}
                    alt={`Sesión académica ${año}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-125 group-hover:rotate-2"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end p-6">
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <p className="text-white font-bold text-lg mb-1">Sesión Académica</p>
                      <p className="text-accent font-semibold">{año}</p>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 bg-accent/90 backdrop-blur-sm px-3 py-1 rounded-full text-white font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    📸 Ver más
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