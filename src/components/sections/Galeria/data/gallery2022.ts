import gallery1 from "@/assets/secion/maestria1.jpg";
import gallery3 from "@/assets/secion/maestria3.jpg";
import gallery12 from "@/assets/secion/maestria12.jpg";
import gallery13 from "@/assets/secion/maestria13.jpg";
import gallery14 from "@/assets/secion/maestria14.jpg";
import gallery15 from "@/assets/secion/maestria15.jpg";
import gallery16 from "@/assets/secion/maestria16.jpg";
import type { YearGallery } from "../types";

export const gallery2022: YearGallery = {
  year: 2022,
  title: "Programa Académico 2022",
  subtitle: "Bases en Cardiología Avanzada",
  description: "Fundamentos de la circulación pulmonar y hemodinámica",
  hero: gallery3,
  images: [
    { src: gallery14, alt: "Fisiopatología de la Circulación Pulmonar", category: "Bases Teóricas" },
    { src: gallery1, alt: "Evaluación Hemodinámica Avanzada", category: "Hemodinamia" },
    { src: gallery12, alt: "Técnicas de Cateterismo Derecho", category: "Procedimientos" },
    { src: gallery15, alt: "Interpretación de Estudios Hemodinámicos", category: "Diagnóstico" },
    { src: gallery13, alt: "Análisis de Casos Complejos", category: "Casos Clínicos" },
    { src: gallery16, alt: "Actualización en Hipertensión Pulmonar", category: "Formación Continua" },
  ],
};
