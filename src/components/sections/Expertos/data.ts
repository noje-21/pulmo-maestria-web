import Nicolas from "@/assets/nicolas.jpg";
import Fabian from "@/assets/fabiam.jpg";
import Guille from "@/assets/guillermo.jpg";
import Marce from "@/assets/marcelo.jpg";
import Adri from "@/assets/adrien.jpg";
import Alejo from "@/assets/alejandro.jpg";
import Julie from "@/assets/julieta.jpg";
import GuilleS from "@/assets/guillermina.jpg";
import Dora from "@/assets/dora.jpg";

export interface Experto {
  nombre: string;
  cargo: string;
  especialidad: string;
  institucion: string;
  imagen: string;
  destacado?: boolean;
}

export const expertos: Experto[] = [
  {
    nombre: "Dr. Adrián José Lescano",
    cargo: "Director de Maestría",
    especialidad: "Médico Cardiólogo · Magíster en Hipertensión Pulmonar · Especialista en Ultrasonografía Cardiovascular",
    institucion: "Fundación Favaloro · IECS",
    imagen: Adri,
    destacado: true
  },
  {
    nombre: "Dr. Nicolás Caruso",
    cargo: "Especialista en Cardiología",
    especialidad: "Medicina del Deporte",
    institucion: "Sanatorio de La Trinidad Mitre · UBA",
    imagen: Nicolas
  },
  {
    nombre: "Dr. Fabián Caro",
    cargo: "Jefe de Sección EPID",
    especialidad: "Enfermedades Pulmonares Intersticiales Difusas",
    institucion: "Hospital María Ferrer · UBA",
    imagen: Fabian
  },
  {
    nombre: "Dr. Guillermo Bortman",
    cargo: "Jefe de Insuficiencia Cardíaca e HP",
    especialidad: "Ex Director de Transplantes y Cirugía Cardiovascular",
    institucion: "Hospital J.D. Perón · Sanatorio Trinidad",
    imagen: Guille
  },
  {
    nombre: "Dr. Marcelo Nahin",
    cargo: "Jefe de Cirugía Cardiovascular",
    especialidad: "Especialista en Medicina Legal",
    institucion: "Hospital 'El Cruce'",
    imagen: Marce
  },
  {
    nombre: "Dr. Alejandro Nitsche",
    cargo: "Líder Médico en HP y EPI",
    especialidad: "Enfermedades del Tejido Conectivo",
    institucion: "Hospital Alemán · SAPEM · AMA",
    imagen: Alejo
  },
  {
    nombre: "Dra. Julieta Soricetti",
    cargo: "Médica Cardióloga",
    especialidad: "Magíster en HP · Especialista en Insuficiencia Cardíaca",
    institucion: "Universidad de Buenos Aires",
    imagen: Julie
  },
  {
    nombre: "Dra. Guillermina Soracio",
    cargo: "Cardióloga",
    especialidad: "Magíster en Hipertensión Pulmonar",
    institucion: "Pres. Electa Consejo Argentino IC-HP",
    imagen: GuilleS
  },
  {
    nombre: "Dra. Dora Hagg",
    cargo: "Coordinadora IC-HP-Trasplante",
    especialidad: "Especialista en Cardiología Pediátrica",
    institucion: "Hospital Garrahan",
    imagen: Dora
  }
];
