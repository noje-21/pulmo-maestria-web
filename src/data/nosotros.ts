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
    bio: "Enfermedades Pulmonares Intersticiales Difusas. Hospital María Ferrer · UBA.",
  },
  {
    id: "4",
    nombre: "Dr. Guillermo Bortman",
    rol: "Jefe de Insuficiencia Cardíaca e HP",
    imagen: Guille,
    bio: "Ex Director de Transplantes y Cirugía Cardiovascular. Hospital J.D. Perón · Sanatorio Trinidad.",
  },
  {
    id: "5",
    nombre: "Dr. Marcelo Nahin",
    rol: "Jefe de Cirugía Cardiovascular",
    imagen: Marce,
    bio: "Especialista en Medicina Legal. Hospital 'El Cruce'.",
  },
  {
    id: "6",
    nombre: "Dr. Alejandro Nitsche",
    rol: "Líder Médico en HP y EPI",
    imagen: Alejo,
    bio: "Enfermedades del Tejido Conectivo. Hospital Alemán · SAPEM · AMA.",
  },
  {
    id: "7",
    nombre: "Dra. Julieta Soricetti",
    rol: "Médica Cardióloga",
    imagen: Julie,
    bio: "Magíster en HP · Especialista en Insuficiencia Cardíaca. Universidad de Buenos Aires.",
  },
  {
    id: "8",
    nombre: "Dra. Guillermina Soracio",
    rol: "Cardióloga",
    imagen: GuilleS,
    bio: "Magíster en Hipertensión Pulmonar. Pres. Electa Consejo Argentino IC-HP.",
  },
  {
    id: "9",
    nombre: "Dra. Dora Hagg",
    rol: "Coordinadora IC-HP-Trasplante",
    imagen: Dora,
    bio: "Especialista en Cardiología Pediátrica. Hospital Garrahan.",
  },
];

export const trabajosData: Trabajo[] = [
  {
    id: "1",
    titulo: "Maestría Latinoamericana en Circulación Pulmonar — Ediciones anteriores",
    descripcion: "Programa intensivo presencial y virtual que ha formado a profesionales de toda Latinoamérica en diagnóstico, tratamiento y seguimiento de la hipertensión pulmonar y enfermedades vasculares del pulmón.",
    imagenes: [
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80",
    ],
    fecha: "2019 – 2025",
  },
  {
    id: "2",
    titulo: "Ateneos Clínicos Multidisciplinarios",
    descripcion: "Sesiones de discusión de casos complejos con la participación de cardiólogos, neumonólogos, reumatólogos y cirujanos cardiovasculares especializados en circulación pulmonar.",
    imagenes: [
      "https://images.unsplash.com/photo-1551190822-a9ce113ac100?w=800&q=80",
    ],
    fecha: "2023 – 2026",
  },
  {
    id: "3",
    titulo: "Jornadas de Actualización en Hipertensión Pulmonar",
    descripcion: "Encuentros anuales con expertos nacionales e internacionales para revisar avances en clasificación, diagnóstico hemodinámico y nuevas terapias en HP.",
    imagenes: [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
    ],
    fecha: "2024",
  },
  {
    id: "4",
    titulo: "Programa de Formación Continua Virtual",
    descripcion: "Módulos online con acceso al Campus Virtual, incluyendo clases grabadas, material bibliográfico y evaluaciones por módulo para alumnos de ediciones anteriores.",
    imagenes: [
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
    ],
    fecha: "2023 – 2026",
  },
];

export const publicacionesData: Publicacion[] = [
  {
    id: "1",
    titulo: "Hipertensión Pulmonar en Latinoamérica: Desafíos diagnósticos y terapéuticos",
    autores: "Lescano AJ, Bortman G, Nitsche A, et al.",
    revista: "Revista Argentina de Cardiología",
    año: "2025",
  },
  {
    id: "2",
    titulo: "Screening de HP en Enfermedades del Tejido Conectivo: Experiencia regional",
    autores: "Nitsche A, Caro F, Soracio G, et al.",
    revista: "Medicina (Buenos Aires)",
    año: "2024",
  },
  {
    id: "3",
    titulo: "Rol del ecocardiograma en la evaluación de la circulación pulmonar",
    autores: "Lescano AJ, Soricetti J, Caruso N, et al.",
    revista: "Insuficiencia Cardíaca",
    año: "2024",
  },
];