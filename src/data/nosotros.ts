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
}

export const equipoData: MiembroEquipo[] = [
  {
    id: "1",
    nombre: "Dr. Carlos Ramírez",
    rol: "Director Académico",
    imagen: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80",
    bio: "Cardiólogo especialista en hipertensión pulmonar con más de 25 años de experiencia clínica e investigativa.",
  },
  {
    id: "2",
    nombre: "Dra. María González",
    rol: "Coordinadora Científica",
    imagen: "https://images.unsplash.com/photo-1594824476967-48c8b964f137?w=400&q=80",
    bio: "Neumonóloga con enfoque en enfermedades vasculares pulmonares y docencia universitaria.",
  },
  {
    id: "3",
    nombre: "Dr. Fernando López",
    rol: "Coordinador de Investigación",
    imagen: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&q=80",
    bio: "Internista y referente en registros latinoamericanos de hipertensión pulmonar.",
  },
  {
    id: "4",
    nombre: "Dra. Ana Torres",
    rol: "Coordinadora de Extensión",
    imagen: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80",
    bio: "Reumatóloga con amplia experiencia en HP asociada a enfermedades autoinmunes.",
  },
];

export const trabajosData: Trabajo[] = [
  {
    id: "1",
    titulo: "Registro Latinoamericano de HP",
    descripcion: "Estudio multicéntrico que reunió datos de más de 2.000 pacientes de 12 países para caracterizar la epidemiología de la hipertensión pulmonar en la región.",
    imagenes: [
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80",
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=80",
    ],
    fecha: "2025",
  },
  {
    id: "2",
    titulo: "Protocolo de Screening en Esclerosis Sistémica",
    descripcion: "Desarrollo e implementación de un protocolo de detección temprana de HP en pacientes con esclerosis sistémica adaptado a la realidad latinoamericana.",
    imagenes: [
      "https://images.unsplash.com/photo-1551190822-a9ce113ac100?w=800&q=80",
    ],
    fecha: "2024",
  },
  {
    id: "3",
    titulo: "Guías de Rehabilitación Cardiopulmonar",
    descripcion: "Elaboración de las primeras guías latinoamericanas de rehabilitación para pacientes con hipertensión pulmonar.",
    imagenes: [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
    ],
    fecha: "2024",
  },
  {
    id: "4",
    titulo: "Telemedicina en Circulación Pulmonar",
    descripcion: "Proyecto pionero de seguimiento remoto de pacientes con HP en áreas rurales de Latinoamérica.",
    imagenes: [
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
    ],
    fecha: "2023",
  },
];

export const publicacionesData: Publicacion[] = [
  {
    id: "1",
    titulo: "Epidemiology of Pulmonary Hypertension in Latin America: A Multicenter Registry",
    autores: "Ramírez C, González M, López F, et al.",
    revista: "European Respiratory Journal",
    año: "2025",
    url: "#",
  },
  {
    id: "2",
    titulo: "Early Screening Strategies for PAH in Systemic Sclerosis: A Latin American Perspective",
    autores: "Torres A, González M, Ramírez C, et al.",
    revista: "Chest",
    año: "2024",
    url: "#",
  },
  {
    id: "3",
    titulo: "Pulmonary Rehabilitation in Pulmonary Hypertension: Latin American Guidelines",
    autores: "López F, Torres A, Ramírez C, et al.",
    revista: "Journal of Heart and Lung Transplantation",
    año: "2024",
    url: "#",
  },
];