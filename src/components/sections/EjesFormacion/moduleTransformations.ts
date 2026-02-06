// Microcopy emocional y narrativa de transformación para cada fase
export interface TransformationData {
  hook: string;
  promise: string;
  transformation: string;
  action: string;
}

export const phaseTransformations: Record<string, TransformationData> = {
  fundamentos: {
    hook: "Donde todo comienza",
    promise: "Domina las bases que definen a un verdadero especialista",
    transformation: "De conocer HP a entender HP",
    action: "Construye tu fundamento clínico"
  },
  diagnostico: {
    hook: "Tu ojo clínico se afina",
    promise: "Interpreta lo que otros pasan por alto",
    transformation: "De ver imágenes a leer historias",
    action: "Desarrolla precisión diagnóstica"
  },
  clinica: {
    hook: "Casos que transforman criterio",
    promise: "Cada paciente especial te hace mejor médico",
    transformation: "De seguir protocolos a crear soluciones",
    action: "Expande tu horizonte clínico"
  },
  tratamiento: {
    hook: "El arte de tratar",
    promise: "Algoritmos que salvan vidas en tus manos",
    transformation: "De prescribir a orquestar",
    action: "Domina las estrategias terapéuticas"
  },
  integracion: {
    hook: "Todo converge aquí",
    promise: "Conecta cada pieza del conocimiento",
    transformation: "De aprender a liderar",
    action: "Integra y aplica con maestría"
  }
};

// Progress milestones para cada módulo
export const getProgressMilestone = (moduleIndex: number, totalModules: number): string => {
  const percentage = Math.round(((moduleIndex + 1) / totalModules) * 100);
  
  if (percentage <= 10) return "Inicio de tu transformación";
  if (percentage <= 25) return "Bases sólidas en construcción";
  if (percentage <= 50) return "Mitad del camino al dominio";
  if (percentage <= 75) return "Criterio clínico en formación";
  if (percentage <= 90) return "Casi un experto";
  return "Listo para brillar";
};

// Microcopy emocional para cada módulo basado en su contenido
export const moduleNarratives: Record<string, { impact: string; revelation: string }> = {
  "modulo-1": {
    impact: "Aquí empieza todo",
    revelation: "Entenderás por qué la HP es mucho más que presión elevada"
  },
  "modulo-2": {
    impact: "El corazón del diagnóstico",
    revelation: "Descifrarás el misterio de la HP idiopática"
  },
  "modulo-3": {
    impact: "Tus herramientas fundamentales",
    revelation: "ECG, Eco y cateterismo dejarán de tener secretos"
  },
  "modulo-4": {
    impact: "Cuando la vida depende de ti",
    revelation: "Sabrás cuándo y cómo indicar un trasplante"
  },
  "modulo-5": {
    impact: "Pacientes complejos, decisiones claras",
    revelation: "Conectarás autoinmunidad con hipertensión pulmonar"
  },
  "modulo-6": {
    impact: "Los más pequeños, el mayor desafío",
    revelation: "Adaptarás tu enfoque al paciente pediátrico"
  },
  "modulo-7": {
    impact: "Más allá de lo evidente",
    revelation: "Explorarás la genética detrás de la enfermedad"
  },
  "modulo-8": {
    impact: "Predecir para prevenir",
    revelation: "Construirás modelos que anticipan el futuro"
  },
  "modulo-9": {
    impact: "Dos mundos, un paciente",
    revelation: "Integrarás corazón izquierdo y circulación pulmonar"
  },
  "modulo-10": {
    impact: "Ver más allá de la imagen",
    revelation: "Strain y speckle tracking serán tu lenguaje"
  },
  "modulo-11": {
    impact: "Cuando el trombo se vuelve crónico",
    revelation: "Dominarás el abordaje de la HPTEC"
  },
  "modulo-12": {
    impact: "Pulmón y presión: una relación crítica",
    revelation: "Conectarás patología respiratoria con HP"
  },
  "modulo-13": {
    impact: "Tu arsenal terapéutico",
    revelation: "PDE5, GCs y ARE no tendrán secretos"
  },
  "modulo-14": {
    impact: "Tratamientos que cambian vidas",
    revelation: "Las prostaciclinas serán tu herramienta"
  },
  "modulo-15": {
    impact: "Prevenir el próximo evento",
    revelation: "Estratificarás riesgo como experto"
  },
  "modulo-16": {
    impact: "Dos vidas en tus manos",
    revelation: "Manejarás HP en embarazo con seguridad"
  },
  "modulo-17": {
    impact: "Poblaciones especiales, enfoque especial",
    revelation: "VIH y HP: conexiones que importan"
  },
  "modulo-18": {
    impact: "El pulmón habla, tú escuchas",
    revelation: "EPID y su relación con HP serán claras"
  },
  "modulo-19": {
    impact: "Más allá de los fármacos",
    revelation: "Rehabilitación y soporte integral"
  },
  "modulo-20": {
    impact: "El poder de combinar",
    revelation: "Doble, triple y cuádruple terapia"
  },
  "modulo-21": {
    impact: "Lo congénito, lo adquirido",
    revelation: "Cardiopatías congénitas en adultos"
  },
  "modulo-22": {
    impact: "El futuro del tratamiento",
    revelation: "Sotatercept y nuevas moléculas"
  },
  "modulo-23": {
    impact: "Conocimiento que se aplica",
    revelation: "De la evidencia a tu consulta"
  },
  "modulo-24": {
    impact: "El paciente integral",
    revelation: "Comorbilidades que cambian todo"
  },
  "modulo-25": {
    impact: "Intervención que cura",
    revelation: "Tromboendarterectomía: cuándo y cómo"
  },
  "modulo-26": {
    impact: "El pulmón bajo la lupa",
    revelation: "Función pulmonar y fenotipos de ILD"
  },
  "modulo-27": {
    impact: "Lectura crítica, decisiones sólidas",
    revelation: "Bioestadística para el clínico"
  },
  "modulo-28": {
    impact: "Mirando hacia adelante",
    revelation: "IA y tecnología en HP"
  },
  "modulo-29": {
    impact: "Imágenes que revelan",
    revelation: "Angio TAC sin secretos"
  },
  "modulo-30": {
    impact: "Tu momento de brillar",
    revelation: "Integración final y casos desafiantes"
  }
};
