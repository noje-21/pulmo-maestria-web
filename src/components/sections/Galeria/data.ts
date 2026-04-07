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

// 2025 images
import g2025_1 from "@/assets/secion/maestria_2025_1.jpg";
import g2025_2 from "@/assets/secion/maestria_2025_2.jpg";
import g2025_3 from "@/assets/secion/maestria_2025_3.jpg";
import g2025_4 from "@/assets/secion/maestria_2025_4.jpg";
import g2025_5 from "@/assets/secion/maestria_2025_5.jpg";
import g2025_6 from "@/assets/secion/maestria_2025_6.jpg";
import g2025_7 from "@/assets/secion/maestria_2025_7.jpg";
import g2025_8 from "@/assets/secion/maestria_2025_8.jpg";
import g2025_9 from "@/assets/secion/maestria_2025_9.jpg";
import g2025_11 from "@/assets/secion/maestria_2025_11.jpg";
import g2025_12 from "@/assets/secion/maestria_2025_12.jpg";
import g2025_13 from "@/assets/secion/maestria_2025_13.jpg";
import g2025_14 from "@/assets/secion/maestria_2025_14.jpg";
import g2025_15 from "@/assets/secion/maestria_2025_15.jpg";
import g2025_16 from "@/assets/secion/maestria_2025_16.jpg";
import g2025_17 from "@/assets/secion/maestria_2025_17.jpg";
import g2025_18 from "@/assets/secion/maestria_2025_18.jpg";

import type { YearGallery, ImageData, MasterSlide } from "./types";

/** Unified master slides with separator slides between year groups */
export const getMasterSlides = (galleries: YearGallery[]): MasterSlide[] =>
  galleries.flatMap((g, i) => {
    const images: MasterSlide[] = g.images.map((img) => ({
      ...img,
      type: "image" as const,
      flyerId: `flyer-${g.year}`,
    }));
    // Add separator before each year group (including first)
    const separator: MasterSlide = { type: "separator", year: g.year, title: g.title };
    return [separator, ...images];
  });

export const galeriasPorAño: YearGallery[] = [
  {
    year: 2025,
    title: "Programa Académico 2025",
    subtitle: "Formación Clínica de Excelencia",
    description: "Rotaciones hospitalarias, hemodinamia práctica y trabajo en equipo",
    hero: g2025_13,
    images: [
      // 1. Formación teórica y conferencias
      { src: g2025_1, alt: "Clase Magistral de Factores de Riesgo", category: "Formación Teórica" },
      { src: g2025_14, alt: "Disertación en atril sobre hipertensión pulmonar", category: "Conferencias" },
      { src: g2025_17, alt: "Análisis de imagen diagnóstica en sesión académica", category: "Casos Clínicos" },
      // 2. Práctica clínica y procedimientos
      { src: g2025_2, alt: "Cateterismo Cardíaco en Sala de Hemodinamia", category: "Procedimientos" },
      { src: g2025_3, alt: "Ecocardiografía con Strain", category: "Imagenología" },
      { src: g2025_4, alt: "Simulación con Transductor Ecográfico", category: "Simulación" },
      { src: g2025_7, alt: "Monitoreo Hemodinámico Invasivo", category: "Hemodinamia" },
      { src: g2025_8, alt: "Práctica en Sala de Cateterismo", category: "Rotación Hospitalaria" },
      { src: g2025_16, alt: "Rotación en hospital María Ferrer", category: "Rotación Hospitalaria" },
      { src: g2025_15, alt: "Mentoría clínica en consultorio", category: "Mentoría" },
      // 3. Talleres y formación práctica
      { src: g2025_18, alt: "Equipo académico en taller práctico", category: "Talleres" },
      // 4. Congresos y eventos
      { src: g2025_11, alt: "Auditorio con conferencia híbrida", category: "Congresos" },
      { src: g2025_12, alt: "Entrevista de prensa durante el evento", category: "Prensa" },
      // 5. Equipo y comunidad
      { src: g2025_5, alt: "Equipo Docente y Alumnos 2025", category: "Equipo" },
      { src: g2025_13, alt: "Foto grupal en escenario del congreso", category: "Comunidad" },
      { src: g2025_9, alt: "Cena de Camaradería del Programa", category: "Vida Académica" },
    ],
  },
  {
    year: 2024,
    title: "Programa Académico 2024",
    subtitle: "Innovación en Circulación Pulmonar",
    description: "Avances en hemodinamia y cateterismo cardiaco derecho",
    hero: gallery1,
    images: [
      { src: gallery32, alt: "Anatomía y Fisiología del Corazón Derecho", category: "Bases Anatómicas" },
      { src: gallery3, alt: "Introducción a la Hemodinamia", category: "Fundamentos" },
      { src: gallery33, alt: "Electrocardiografía en Patología Pulmonar", category: "Electrocardiografía" },
      { src: gallery34, alt: "Pruebas de Función Respiratoria", category: "Diagnóstico Funcional" },
      { src: gallery35, alt: "Metodología de Investigación Clínica", category: "Investigación" },
      { src: gallery36, alt: "Ceremonia de Apertura Académica", category: "Eventos Institucionales" },
    ],
  },
  {
    year: 2023,
    title: "Programa Académico 2023",
    subtitle: "Consolidación del Conocimiento",
    description: "Diagnóstico y manejo de patologías cardiopulmonares",
    hero: gallery2,
    images: [
      // Evaluación → Imagenología → Emergencias → Función ventricular → Congresos
      { src: gallery25, alt: "Estratificación de Riesgo Cardiovascular", category: "Evaluación Clínica" },
      { src: gallery22, alt: "Ecocardiografía Transesofágica", category: "Imagenología" },
      { src: gallery24, alt: "Valoración del Ventrículo Derecho", category: "Función Ventricular" },
      { src: gallery2, alt: "Monitorización Cardiorrespiratoria en UCI", category: "Cuidados Críticos" },
      { src: gallery23, alt: "Manejo Invasivo del Shock Cardiogénico", category: "Emergencias" },
      { src: gallery26, alt: "Simposio de Cardiología Intervencionista", category: "Congresos" },
    ],
  },
  {
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
  },
];
