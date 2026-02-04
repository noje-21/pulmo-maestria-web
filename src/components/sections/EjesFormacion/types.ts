import { LucideIcon } from "lucide-react";

export interface Modulo {
  id: string;
  numero: number;
  phase: "fundamentos" | "diagnostico" | "clinica" | "tratamiento" | "integracion";
  icon: LucideIcon;
  titulo: string;
  enfoque: string;
  temas: string[];
  docentes?: string[];
}

export interface ProgressionPhase {
  label: string;
  color: string;
  bgColor: string;
  description: string;
}

export type ProgressionPhases = Record<string, ProgressionPhase>;
