import Nicolas from "@/assets/nicolas.jpg";
import Fabian from "@/assets/fabiam.jpg";
import Guille from "@/assets/guillermo.jpg";
import Marce from "@/assets/marcelo.jpg";
import Adri from "@/assets/adrien.jpg";
import Alejo from "@/assets/alejandro.jpg";
import Julie from "@/assets/julieta.jpg";
import GuilleS from "@/assets/guillermina.jpg";
import Dora from "@/assets/dora.jpg";

export interface Trabajo {
  id: string;
  titulo: string;
  descripcion: string;
  imagenes: string[];
  fecha: string;
}

export interface Publicacion {
  id: string;
  titulo: string;
  autores: string;
  revista: string;
  año: string;
  url?: string;
}

export interface MiembroEquipo {
  id: string;
  nombre: string;
  rol: string;
  imagen: string;
  bio: string;
  destacado?: boolean;
}

export const equipoData: MiembroEquipo[] = [
  {
    id: "1",
    nombre: "Dr. Adrián José Lescano",
    rol: "Director de Maestría",
    imagen: Adri,
    bio: "Médico Cardiólogo · Magíster en Hipertensión Pulmonar · Especialista en Ultrasonografía Cardiovascular. Fundación Favaloro · IECS.",
    destacado: true,
  },
  {
    id: "2",
    nombre: "Dr. Nicolás Caruso",
    rol: "Especialista en Cardiología",
    imagen: Nicolas,
    bio: "Medicina del Deporte. Sanatorio de La Trinidad Mitre · UBA.",
  },
  {
    id: "3",
    nombre: "Dr. Fabián Caro",
    rol: "Jefe de Sección EPID",
    imagen: Fabian,
    bio: "Enfermedades Pulmonares Intersticiales Difusas (Módulo 18). Hospital María Ferrer · UBA.",
  },
  {
    id: "4",
    nombre: "Dr. Guillermo Bortman",
    rol: "Jefe de Insuficiencia Cardíaca e HP",
    imagen: Guille,
    bio: "Tratamiento combinado y algoritmo terapéutico (Módulo 20). Hospital J.D. Perón · Sanatorio Trinidad.",
  },
  {
    id: "5",
    nombre: "Dr. Marcelo Nahin",
    rol: "Jefe de Cirugía Cardiovascular",
    imagen: Marce,
    bio: "Tromboendarterectomía pulmonar (Módulo 25). Hospital 'El Cruce'.",
  },
  {
    id: "6",
    nombre: "Dr. Alejandro Nitsche",
    rol: "Líder Médico en HP y EPI",
    imagen: Alejo,
    bio: "Enfermedad del tejido conectivo (Módulo 5). Hospital Alemán · SAPEM · AMA.",
  },
  {
    id: "7",
    nombre: "Dra. Julieta Soricetti",
    rol: "Secretaria Científica · Cardióloga",
    imagen: Julie,
    bio: "Estratificación pronóstica (Módulo 8). Magíster en HP · Especialista en Insuficiencia Cardíaca. UBA.",
  },
  {
    id: "8",
    nombre: "Dra. Guillermina Soracio",
    rol: "Coordinadora Científica · Cardióloga",
    imagen: GuilleS,
    bio: "HP e IC izquierda, rehabilitación (Módulos 9 y 19). Magíster en HP. Pres. Electa Consejo Argentino IC-HP.",
  },
  {
    id: "9",
    nombre: "Dra. Dora Hagg",
    rol: "Coordinadora IC-HP-Trasplante",
    imagen: Dora,
    bio: "HP en Pediatría (Módulo 6). Especialista en Cardiología Pediátrica. Hospital Garrahan.",
  },
];

export const trabajosData: Trabajo[] = [
  {
    id: "1",
    titulo: "Maestría Latinoamericana en Circulación Pulmonar — 30 Módulos, 131 horas académicas",
    descripcion: "Programa presencial intensivo con módulos teóricos y prácticos que abarcan desde la anatomía y fisiopatología hasta los esquemas terapéuticos en hipertensión pulmonar. Se desarrolla en el Centro Gallego de Buenos Aires, Sanatorio Trinidad Quilmes y Hospital Ferrer.",
    imagenes: [
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80",
    ],
    fecha: "2019 – 2026",
  },
  {
    id: "2",
    titulo: "Simposio Latinoamericano de Hipertensión Pulmonar",
    descripcion: "Jornada de casos clínicos con expertos nacionales e internacionales. Incluye 'Medicina Basada en la Experiencia' y perspectiva de los pacientes, coordinado por Dra. Soricetti y Dr. Silva Chrome.",
    imagenes: [
      "https://images.unsplash.com/photo-1551190822-a9ce113ac100?w=800&q=80",
    ],
    fecha: "Noviembre 2025",
  },
  {
    id: "3",
    titulo: "Talleres Prácticos — CCD, Ecocardiografía y Consultas Clínicas",
    descripcion: "Actividades de interacción entre docentes y pacientes: cateterismo cardíaco derecho, laboratorio de ultrasonografía cardiovascular, capilaroscopia, manejo de bombas de infusión de prostaciclinas y test de caminata de 6 minutos.",
    imagenes: [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
    ],
    fecha: "2024 – 2026",
  },
  {
    id: "4",
    titulo: "Plataforma Virtual y Actividad Bibliográfica",
    descripcion: "Campus virtual con clases grabadas, material bibliográfico y 30 horas de actividad bibliográfica supervisada. Facilita el repaso de los módulos teóricos y complementa la formación presencial.",
    imagenes: [
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
    ],
    fecha: "2023 – 2026",
  },
];

export const publicacionesData: Publicacion[] = [
  {
    id: "1",
    titulo: "Generalidades, clasificación y epidemiología de la Hipertensión Pulmonar — Contenido del Módulo 1",
    autores: "Lescano AJ.",
    revista: "Material académico de la Maestría en Circulación Pulmonar",
    año: "2025",
  },
  {
    id: "2",
    titulo: "Enfermedad del tejido conectivo e HP: Diagnóstico, pronóstico y tratamiento — Módulo 5",
    autores: "Nitsche A, Lescano AJ.",
    revista: "Material académico de la Maestría en Circulación Pulmonar",
    año: "2025",
  },
  {
    id: "3",
    titulo: "Tromboendarterectomía pulmonar: Estrategias de intervención y seguimiento — Módulo 25",
    autores: "Nahim M.",
    revista: "Material académico de la Maestría en Circulación Pulmonar",
    año: "2025",
  },
];