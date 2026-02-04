import { 
  Heart, 
  Stethoscope, 
  Activity, 
  Microscope,
  Brain,
  Pill,
  Baby,
  Wind,
  Syringe,
  HeartPulse,
  Scan,
  TestTube,
  Users,
  Dna,
  Scale,
  Scissors,
  FileHeart,
  Sparkles,
  GraduationCap,
  ClipboardList
} from "lucide-react";
import { Modulo, ProgressionPhases } from "./types";

export const progressionPhases: ProgressionPhases = {
  fundamentos: {
    label: "Fundamentos",
    color: "text-primary",
    bgColor: "bg-primary/10",
    description: "Bases conceptuales de la circulación pulmonar"
  },
  diagnostico: {
    label: "Herramientas Diagnósticas",
    color: "text-accent",
    bgColor: "bg-accent/10",
    description: "Domina las técnicas de evaluación y diagnóstico"
  },
  clinica: {
    label: "Escenarios Clínicos",
    color: "text-primary",
    bgColor: "bg-primary/10",
    description: "Abordaje de poblaciones y contextos especiales"
  },
  tratamiento: {
    label: "Estrategias Terapéuticas",
    color: "text-accent",
    bgColor: "bg-accent/10",
    description: "Algoritmos de tratamiento específico e inespecífico"
  },
  integracion: {
    label: "Integración Clínica",
    color: "text-primary",
    bgColor: "bg-primary/10",
    description: "Síntesis del conocimiento y aplicación práctica"
  }
};

export const modulos: Modulo[] = [
  // FUNDAMENTOS (Módulos 1-2)
  {
    id: "modulo-1",
    numero: 1,
    phase: "fundamentos",
    icon: Heart,
    titulo: "Generalidades en Circulación Pulmonar",
    enfoque: "Introducción, clasificación y fisiopatología",
    temas: [
      "Introducción y definición de HP",
      "Clasificación actualizada",
      "Epidemiología global y regional",
      "Fisiopatología de la circulación pulmonar"
    ]
  },
  {
    id: "modulo-2",
    numero: 2,
    phase: "fundamentos",
    icon: HeartPulse,
    titulo: "Hipertensión Pulmonar Grupo I",
    enfoque: "HP idiopática y asociada a otras etiologías",
    temas: [
      "Algoritmo diagnóstico inicial",
      "Hipertensión pulmonar idiopática",
      "HP asociada a otras etiologías",
      "Diagnóstico diferencial"
    ]
  },

  // DIAGNÓSTICO (Módulos 3, 10, 26, 29)
  {
    id: "modulo-3",
    numero: 3,
    phase: "diagnostico",
    icon: Stethoscope,
    titulo: "Diagnóstico I: ECG, Eco y Cateterismo",
    enfoque: "Herramientas diagnósticas fundamentales",
    temas: [
      "Electrocardiograma en HP",
      "Ecocardiografía Doppler I",
      "Cateterismo cardíaco derecho",
      "Interpretación hemodinámica"
    ]
  },
  {
    id: "modulo-10",
    numero: 10,
    phase: "diagnostico",
    icon: Scan,
    titulo: "Ecocardiograma Doppler II",
    enfoque: "Nuevas técnicas de imagen cardíaca",
    temas: [
      "Técnicas avanzadas de ecocardiografía",
      "Strain y speckle tracking",
      "Evaluación del ventrículo derecho",
      "Integración con datos hemodinámicos"
    ]
  },
  {
    id: "modulo-26",
    numero: 26,
    phase: "diagnostico",
    icon: Wind,
    titulo: "Evaluación Pulmonar",
    enfoque: "Estudio funcional y fenotipos de ILD",
    temas: [
      "Estudio funcional pulmonar completo",
      "ILD: diferentes fenotipos",
      "Tratamiento específico de ILD",
      "Pronóstico funcional"
    ]
  },
  {
    id: "modulo-29",
    numero: 29,
    phase: "diagnostico",
    icon: Activity,
    titulo: "Angio TAC Cardíaca y de Grandes Vasos",
    enfoque: "Diagnóstico por imágenes avanzado",
    temas: [
      "Diagnóstico por angio TAC",
      "Interpretación de hallazgos",
      "Variables pronósticas",
      "Correlación clínico-radiológica"
    ]
  },

  // ESCENARIOS CLÍNICOS (Módulos 4-9, 11-12, 16-18, 21, 24)
  {
    id: "modulo-4",
    numero: 4,
    phase: "clinica",
    icon: Scissors,
    titulo: "Trasplante Bipulmonar",
    enfoque: "Indicaciones, manejo y seguimiento",
    temas: [
      "Indicaciones del trasplante",
      "Manejo perioperatorio",
      "Seguimiento a largo plazo",
      "Complicaciones y pronóstico"
    ]
  },
  {
    id: "modulo-5",
    numero: 5,
    phase: "clinica",
    icon: Dna,
    titulo: "Enfermedad del Tejido Conectivo",
    enfoque: "HP asociada a enfermedades autoinmunes",
    temas: [
      "Diagnóstico de ETC con HP",
      "Pronóstico y estratificación",
      "Tratamiento multidisciplinario",
      "Seguimiento especializado"
    ]
  },
  {
    id: "modulo-6",
    numero: 6,
    phase: "clinica",
    icon: Baby,
    titulo: "Hipertensión Pulmonar en Pediatría",
    enfoque: "Particularidades del paciente pediátrico",
    temas: [
      "Epidemiología pediátrica",
      "Fenotipos en niños",
      "Diagnóstico adaptado",
      "Tratamiento específico pediátrico"
    ]
  },
  {
    id: "modulo-7",
    numero: 7,
    phase: "clinica",
    icon: FileHeart,
    titulo: "HP Asociadas: Porto-pulmonar y Genética",
    enfoque: "Etiologías especiales y base genética",
    temas: [
      "HP Porto-pulmonar",
      "Genética en HP",
      "Casos clínicos desafiantes",
      "Abordaje multidisciplinario"
    ]
  },
  {
    id: "modulo-8",
    numero: 8,
    phase: "clinica",
    icon: Scale,
    titulo: "Estratificación Pronóstica",
    enfoque: "Predicción de eventos y construcción de modelos",
    temas: [
      "Diferentes scores pronósticos",
      "Predicción de eventos adversos",
      "Construcción de modelos predictivos",
      "Aplicación clínica práctica"
    ]
  },
  {
    id: "modulo-9",
    numero: 9,
    phase: "clinica",
    icon: HeartPulse,
    titulo: "HP e Insuficiencia Cardíaca Izquierda",
    enfoque: "Integrando imágenes, hemodinamia y tratamiento",
    temas: [
      "Diagnóstico diferencial IC-HP",
      "Integración de imágenes y hemodinamia",
      "Tratamiento específico",
      "Valoración de enfermedad coronaria"
    ]
  },
  {
    id: "modulo-11",
    numero: 11,
    phase: "clinica",
    icon: Activity,
    titulo: "HP Tromboembólica Crónica",
    enfoque: "Diagnóstico y tratamiento de HPTEC",
    temas: [
      "Epidemiología de HPTEC",
      "Algoritmo diagnóstico",
      "Tratamiento farmacológico",
      "Tratamiento intervencionista"
    ]
  },
  {
    id: "modulo-12",
    numero: 12,
    phase: "clinica",
    icon: Wind,
    titulo: "HP y Patologías Respiratorias",
    enfoque: "HP asociada a enfermedad pulmonar",
    temas: [
      "Diagnóstico en contexto respiratorio",
      "Imágenes y estudios funcionales",
      "Tratamiento específico",
      "Manejo integrado"
    ]
  },
  {
    id: "modulo-15",
    numero: 15,
    phase: "clinica",
    icon: Activity,
    titulo: "Enfermedad Tromboembólica Venosa",
    enfoque: "Epidemiología, diagnóstico y estratificación",
    temas: [
      "Epidemiología y diagnóstico de ETV",
      "Integración de imágenes",
      "Estratificación del riesgo",
      "Prevención secundaria"
    ]
  },
  {
    id: "modulo-16",
    numero: 16,
    phase: "clinica",
    icon: Baby,
    titulo: "Embarazo e Hipertensión Pulmonar",
    enfoque: "Manejo de la paciente gestante",
    temas: [
      "Algoritmo diagnóstico en embarazo",
      "Estrategias de manejo",
      "Tratamiento farmacológico seguro",
      "Seguimiento periparto"
    ]
  },
  {
    id: "modulo-17",
    numero: 17,
    phase: "clinica",
    icon: Microscope,
    titulo: "HIV e Hipertensión Pulmonar",
    enfoque: "HP en el paciente con VIH",
    temas: [
      "Presentación clínica",
      "Pronóstico específico",
      "Tratamiento adaptado",
      "Interacciones farmacológicas"
    ]
  },
  {
    id: "modulo-18",
    numero: 18,
    phase: "clinica",
    icon: Wind,
    titulo: "Enfermedad Pulmonar Intersticial Difusa",
    enfoque: "EPID y su relación con HP",
    temas: [
      "Algoritmo diagnóstico de EPID",
      "Tratamiento específico",
      "Pronóstico a largo plazo",
      "Taller práctico integrado"
    ]
  },
  {
    id: "modulo-21",
    numero: 21,
    phase: "clinica",
    icon: Heart,
    titulo: "Cardiopatías Congénitas",
    enfoque: "HP asociada a CC en adultos",
    temas: [
      "Diagnóstico en cardiopatías congénitas",
      "Pronóstico según tipo de CC",
      "Tratamiento específico",
      "Seguimiento especializado"
    ]
  },
  {
    id: "modulo-24",
    numero: 24,
    phase: "clinica",
    icon: Scale,
    titulo: "Comorbilidades en HP",
    enfoque: "Síndrome metabólico, diabetes y obesidad",
    temas: [
      "Síndrome metabólico y diabetes",
      "Obesidad y trastornos nutricionales",
      "Comorbilidades y pronóstico",
      "Manejo integral del paciente"
    ]
  },
  {
    id: "modulo-25",
    numero: 25,
    phase: "clinica",
    icon: Scissors,
    titulo: "Tromboendarterectomía Pulmonar",
    enfoque: "Intervención quirúrgica en HPTEC",
    temas: [
      "Estrategias de intervención",
      "Manejo perioperatorio",
      "Seguimiento a largo plazo",
      "Selección de candidatos"
    ]
  },

  // TRATAMIENTO (Módulos 13-14, 19-20, 22)
  {
    id: "modulo-13",
    numero: 13,
    phase: "tratamiento",
    icon: Pill,
    titulo: "Tratamiento Específico I",
    enfoque: "Inhibidores de PDE5, GCs y ARE",
    temas: [
      "Inhibidores de fosfodiesterasa 5",
      "Estimulantes de guanilato ciclasa",
      "Antagonistas de receptores de endotelina",
      "Indicaciones y contraindicaciones"
    ]
  },
  {
    id: "modulo-14",
    numero: 14,
    phase: "tratamiento",
    icon: Syringe,
    titulo: "Tratamiento Específico II: Prostaciclinas",
    enfoque: "Agonistas IP y prostaglandinas",
    temas: [
      "Agonistas del receptor IP",
      "Prostaglandinas inhalatorias",
      "Prostaglandinas parenterales",
      "Bombas de infusión: manejo práctico"
    ]
  },
  {
    id: "modulo-19",
    numero: 19,
    phase: "tratamiento",
    icon: ClipboardList,
    titulo: "Tratamiento Inespecífico",
    enfoque: "Recomendaciones generales y rehabilitación",
    temas: [
      "Recomendaciones generales",
      "Esquemas farmacológicos de soporte",
      "Rehabilitación cardiopulmonar",
      "Síntesis del conocimiento"
    ]
  },
  {
    id: "modulo-20",
    numero: 20,
    phase: "tratamiento",
    icon: Pill,
    titulo: "Tratamiento Específico III: Terapia Combinada",
    enfoque: "Estrategias de combinación avanzada",
    temas: [
      "Estrategias de tratamiento combinado",
      "Doble, triple y cuádruple terapia",
      "Algoritmo terapéutico actualizado",
      "Escalamiento y desescalamiento"
    ]
  },
  {
    id: "modulo-22",
    numero: 22,
    phase: "tratamiento",
    icon: TestTube,
    titulo: "Nuevos Esquemas Terapéuticos",
    enfoque: "Sotatercept e inhibidores de tirosina kinasa",
    temas: [
      "Sotatercept: mecanismo y evidencia",
      "Inhibidores de tirosina kinasa",
      "Pipeline de nuevas moléculas",
      "Aplicación clínica emergente"
    ]
  },

  // INTEGRACIÓN (Módulos 23, 27-28, 30)
  {
    id: "modulo-23",
    numero: 23,
    phase: "integracion",
    icon: Users,
    titulo: "Implementando el Conocimiento en HP",
    enfoque: "Registros y fenotipos en la práctica",
    temas: [
      "Registros de HP a nivel mundial",
      "Diferentes fenotipos clínicos",
      "Aplicación del conocimiento",
      "Medicina basada en evidencia"
    ]
  },
  {
    id: "modulo-27",
    numero: 27,
    phase: "integracion",
    icon: Brain,
    titulo: "Bioestadística Aplicada",
    enfoque: "Lectura crítica y análisis de evidencia",
    temas: [
      "Ateneos bibliográficos",
      "Interpretación de la P estadística",
      "Lectura crítica de estudios",
      "Aplicación clínica de la evidencia"
    ]
  },
  {
    id: "modulo-28",
    numero: 28,
    phase: "integracion",
    icon: Sparkles,
    titulo: "Futuro en Hipertensión Pulmonar",
    enfoque: "Inteligencia artificial y nuevas tecnologías",
    temas: [
      "Inteligencia artificial en HP",
      "Nuevas tecnologías diagnósticas",
      "Tendencias terapéuticas",
      "Visión a futuro de la especialidad"
    ]
  },
  {
    id: "modulo-30",
    numero: 30,
    phase: "integracion",
    icon: GraduationCap,
    titulo: "Integrando el Conocimiento",
    enfoque: "Casos clínicos y evaluación final",
    temas: [
      "Casos clínicos desafiantes",
      "Resolución de problemas complejos",
      "Síntesis del programa",
      "Examen final integrador"
    ]
  }
];
