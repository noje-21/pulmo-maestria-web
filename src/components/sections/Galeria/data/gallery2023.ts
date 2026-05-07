import gallery2 from "@/assets/secion/maestria2.webp";
import gallery22 from "@/assets/secion/maestria22.webp";
import gallery23 from "@/assets/secion/maestria23.webp";
import gallery24 from "@/assets/secion/maestria24.webp";
import gallery25 from "@/assets/secion/maestria25.webp";
import gallery26 from "@/assets/secion/maestria26.webp";
import type { YearGallery } from "../types";

export const gallery2023: YearGallery = {
  year: 2023,
  title: "Programa Académico 2023",
  subtitle: "Consolidación del Conocimiento",
  description: "Diagnóstico y manejo de patologías cardiopulmonares",
  hero: gallery2,
  images: [
    { src: gallery25, alt: "Estratificación de Riesgo Cardiovascular", category: "Evaluación Clínica" },
    { src: gallery22, alt: "Ecocardiografía Transesofágica", category: "Imagenología" },
    { src: gallery24, alt: "Valoración del Ventrículo Derecho", category: "Función Ventricular" },
    { src: gallery2, alt: "Monitorización Cardiorrespiratoria en UCI", category: "Cuidados Críticos" },
    { src: gallery23, alt: "Manejo Invasivo del Shock Cardiogénico", category: "Emergencias" },
    { src: gallery26, alt: "Simposio de Cardiología Intervencionista", category: "Congresos" },
  ],
};
