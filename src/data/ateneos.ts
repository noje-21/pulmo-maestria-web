import maestria1 from "@/assets/secion/maestria1.webp";
import maestria2 from "@/assets/secion/maestria2.webp";
import maestria12 from "@/assets/secion/maestria12.webp";
import maestria13 from "@/assets/secion/maestria13.webp";
import maestria14 from "@/assets/secion/maestria14.webp";
import maestria15 from "@/assets/secion/maestria15.webp";

export interface Ateneo {
  id: string;
  titulo: string;
  descripcion: string;
  contenido: string;
  fecha: string;
  imagen: string;
  imagenes?: string[];
  videoUrl?: string;
  pdfUrl?: string;
}

export const ateneosData: Ateneo[] = [
  {
    id: "1",
    titulo: "Ateneo de Hipertensión Arterial Pulmonar: Nuevas Guías 2026",
    descripcion: "Revisión de las últimas guías internacionales de diagnóstico y tratamiento de la hipertensión arterial pulmonar.",
    contenido: `<p>En este ateneo se presentaron las novedades más relevantes de las guías internacionales actualizadas para el manejo de la hipertensión arterial pulmonar (HAP). Se discutieron los cambios en la clasificación hemodinámica, los nuevos umbrales diagnósticos y las estrategias de tratamiento combinado temprano.</p>
    <h3>Puntos clave</h3>
    <ul>
      <li>Nueva definición hemodinámica de hipertensión pulmonar con PAPm > 20 mmHg</li>
      <li>Algoritmo actualizado de tratamiento con terapia combinada inicial</li>
      <li>Importancia del cateterismo cardíaco derecho en el seguimiento</li>
      <li>Nuevos biomarcadores pronósticos</li>
    </ul>
    <p>La discusión fue enriquecida por la participación de especialistas de Argentina, Colombia, México y Chile, quienes aportaron su experiencia clínica en la implementación de estas guías en contextos latinoamericanos.</p>`,
    fecha: "2026-03-15",
    imagenes: [
      maestria1,
      maestria2,
    ],
    imagen: maestria1,
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: "2",
    titulo: "Caso Clínico: Tromboembolismo Pulmonar Crónico",
    descripcion: "Presentación y discusión de un caso complejo de CTEPH con abordaje multidisciplinario.",
    contenido: `<p>Se presentó un caso de un paciente masculino de 52 años con diagnóstico de tromboembolismo pulmonar crónico tromboembólico (CTEPH). Se revisó el abordaje diagnóstico paso a paso, incluyendo ecocardiografía, angiografía pulmonar y cateterismo derecho.</p>
    <h3>Abordaje terapéutico</h3>
    <p>Se discutieron las opciones de tratamiento incluyendo endarterectomía pulmonar, angioplastia con balón y terapia farmacológica con riociguat. El equipo multidisciplinario evaluó la operabilidad del paciente y definió un plan terapéutico combinado.</p>`,
    fecha: "2026-02-20",
    imagen: maestria12,
    imagenes: [
      maestria12,
    ],
    pdfUrl: "https://example.com/caso-cteph.pdf",
  },
  {
    id: "3",
    titulo: "Actualización en Ecocardiografía y Circulación Pulmonar",
    descripcion: "Revisión de las técnicas ecocardiográficas más avanzadas para la evaluación de la función ventricular derecha.",
    contenido: `<p>Este ateneo abordó las técnicas ecocardiográficas de última generación para la evaluación integral de la circulación pulmonar y la función del ventrículo derecho.</p>
    <h3>Temas discutidos</h3>
    <ul>
      <li>Strain del ventrículo derecho por speckle tracking</li>
      <li>Ecocardiografía 3D del ventrículo derecho</li>
      <li>Evaluación de la función diastólica del VD</li>
      <li>Correlación ecocardiográfica-hemodinámica</li>
    </ul>`,
    fecha: "2026-01-10",
    imagen: maestria13,
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: "4",
    titulo: "Hipertensión Pulmonar en Enfermedades del Tejido Conectivo",
    descripcion: "Análisis del screening y manejo de HP en pacientes con esclerosis sistémica y lupus eritematoso.",
    contenido: `<p>Se revisaron los protocolos de screening y seguimiento de hipertensión pulmonar en pacientes con enfermedades del tejido conectivo, con énfasis en esclerosis sistémica y lupus eritematoso sistémico.</p>
    <p>Se presentaron datos del registro latinoamericano de HP asociada a enfermedades autoinmunes y se discutieron las particularidades del tratamiento en esta población.</p>`,
    fecha: "2025-12-05",
    imagen: maestria14,
  },
  {
    id: "5",
    titulo: "Avances en Terapia Génica para Enfermedades Vasculares Pulmonares",
    descripcion: "Estado actual de la investigación en terapia génica y su potencial aplicación en hipertensión pulmonar.",
    contenido: `<p>Este ateneo exploró las fronteras de la investigación en terapia génica aplicada a las enfermedades vasculares pulmonares. Se revisaron los estudios preclínicos más prometedores y las perspectivas de traslación clínica.</p>`,
    fecha: "2025-11-18",
    imagen: maestria15,
  },
  {
    id: "6",
    titulo: "Rehabilitación Cardiopulmonar en Hipertensión Pulmonar",
    descripcion: "Evidencia y experiencia clínica en programas de rehabilitación para pacientes con HP.",
    contenido: `<p>Se revisó la evidencia acumulada sobre los beneficios de la rehabilitación cardiopulmonar supervisada en pacientes con hipertensión pulmonar. Se compartieron protocolos de ejercicio adaptados y resultados de programas regionales.</p>`,
    fecha: "2025-10-22",
    imagen: maestria1,
  },
];