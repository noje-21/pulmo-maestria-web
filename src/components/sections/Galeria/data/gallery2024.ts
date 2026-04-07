import gallery1 from "@/assets/secion/maestria1.jpg";
import gallery3 from "@/assets/secion/maestria3.jpg";
import gallery32 from "@/assets/secion/maestria32.jpg";
import gallery33 from "@/assets/secion/maestria33.jpg";
import gallery34 from "@/assets/secion/maestria34.jpg";
import gallery35 from "@/assets/secion/maestria35.jpg";
import gallery36 from "@/assets/secion/maestria36.jpg";
import type { YearGallery } from "../types";

export const gallery2024: YearGallery = {
  year: 2024,
  title: "Programa Académico 2024",
  subtitle: "Innovación en Circulación Pulmonar",
  description: "Avances en hemodinamia y cateterismo cardiaco derecho",
  hero: gallery3,
  images: [
    { src: gallery32, alt: "Anatomía y Fisiología del Corazón Derecho", category: "Bases Anatómicas" },
    { src: gallery3, alt: "Introducción a la Hemodinamia", category: "Fundamentos" },
    { src: gallery33, alt: "Electrocardiografía en Patología Pulmonar", category: "Electrocardiografía" },
    { src: gallery34, alt: "Pruebas de Función Respiratoria", category: "Diagnóstico Funcional" },
    { src: gallery35, alt: "Metodología de Investigación Clínica", category: "Investigación" },
    { src: gallery36, alt: "Ceremonia de Apertura Académica", category: "Eventos Institucionales" },
  ],
};
