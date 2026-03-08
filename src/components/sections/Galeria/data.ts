import gallery1 from "@/assets/secion/maestria1.jpg";
import gallery2 from "@/assets/secion/maestria2.jpg";
import gallery3 from "@/assets/secion/maestria3.jpg";
import gallery12 from "@/assets/secion/maestria12.jpg";
import gallery13 from "@/assets/secion/maestria13.jpg";
import gallery14 from "@/assets/secion/maestria14.jpg";
import gallery15 from "@/assets/secion/maestria15.jpg";
import gallery16 from "@/assets/secion/maestria16.jpg";
import gallery22 from "@/assets/secion/maestria22.jpg";
import gallery23 from "@/assets/secion/maestria23.jpg";
import gallery24 from "@/assets/secion/maestria24.jpg";
import gallery25 from "@/assets/secion/maestria25.jpg";
import gallery26 from "@/assets/secion/maestria26.jpg";
import gallery32 from "@/assets/secion/maestria32.jpg";
import gallery33 from "@/assets/secion/maestria33.jpg";
import gallery34 from "@/assets/secion/maestria34.jpg";
import gallery35 from "@/assets/secion/maestria35.jpg";
import gallery36 from "@/assets/secion/maestria36.jpg";

// Mobile-optimized hero images (640px wide)
// @ts-ignore - vite-imagetools preset
import gallery1Mobile from "@/assets/secion/maestria1.jpg?mobile";
// @ts-ignore - vite-imagetools preset
import gallery2Mobile from "@/assets/secion/maestria2.jpg?mobile";
// @ts-ignore - vite-imagetools preset
import gallery3Mobile from "@/assets/secion/maestria3.jpg?mobile";

import type { YearGallery } from "./types";

export const galeriasPorAño: YearGallery[] = [
  {
    year: 2024,
    title: "Programa Académico 2024",
    subtitle: "Innovación en Circulación Pulmonar",
    description: "Avances en hemodinamia y cateterismo cardiaco derecho",
    hero: gallery3,
    heroMobile: gallery3Mobile,
    images: [
      { src: gallery1, alt: "Evaluación Hemodinámica Avanzada", category: "Hemodinamia" },
      { src: gallery12, alt: "Técnicas de Cateterismo Derecho", category: "Procedimientos" },
      { src: gallery13, alt: "Análisis de Casos Complejos", category: "Casos Clínicos" },
      { src: gallery14, alt: "Fisiopatología de la Circulación Pulmonar", category: "Bases Teóricas" },
      { src: gallery15, alt: "Interpretación de Estudios Hemodinámicos", category: "Diagnóstico" },
      { src: gallery16, alt: "Actualización en Hipertensión Pulmonar", category: "Formación Continua" },
    ],
  },
  {
    year: 2023,
    title: "Programa Académico 2023",
    subtitle: "Consolidación del Conocimiento",
    description: "Diagnóstico y manejo de patologías cardiopulmonares",
    hero: gallery2,
    heroMobile: gallery2Mobile,
    images: [
      { src: gallery2, alt: "Monitorización Cardiorrespiratoria en UCI", category: "Cuidados Críticos" },
      { src: gallery22, alt: "Ecocardiografía Transesofágica", category: "Imagenología" },
      { src: gallery23, alt: "Manejo Invasivo del Shock Cardiogénico", category: "Emergencias" },
      { src: gallery24, alt: "Valoración del Ventrículo Derecho", category: "Función Ventricular" },
      { src: gallery25, alt: "Estratificación de Riesgo Cardiovascular", category: "Evaluación Clínica" },
      { src: gallery26, alt: "Simposio de Cardiología Intervencionista", category: "Congresos" },
    ],
  },
  {
    year: 2022,
    title: "Programa Académico 2022",
    subtitle: "Bases en Cardiología Avanzada",
    description: "Fundamentos de la circulación pulmonar y hemodinámica",
    hero: gallery1,
    heroMobile: gallery1Mobile,
    images: [
      { src: gallery3, alt: "Introducción a la Hemodinamia", category: "Fundamentos" },
      { src: gallery32, alt: "Anatomía y Fisiología del Corazón Derecho", category: "Bases Anatómicas" },
      { src: gallery33, alt: "Electrocardiografía en Patología Pulmonar", category: "Electrocardiografía" },
      { src: gallery34, alt: "Pruebas de Función Respiratoria", category: "Diagnóstico Funcional" },
      { src: gallery35, alt: "Metodología de Investigación Clínica", category: "Investigación" },
      { src: gallery36, alt: "Ceremonia de Apertura Académica", category: "Eventos Institucionales" },
    ],
  },
];
