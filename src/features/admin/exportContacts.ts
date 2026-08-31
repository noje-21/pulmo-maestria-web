import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export interface ExportableContact {
  name: string;
  email: string;
  country: string;
  specialty: string;
  message: string;
  status: string;
  created_at: string;
  cv_url: string | null;
}

const STATUS_LABEL: Record<string, string> = {
  nuevo: "Nuevo",
  leido: "Leído",
  respondido: "Respondido",
  spam: "Spam",
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("es-AR", { dateStyle: "short", timeStyle: "short" });

const timestamp = () => new Date().toISOString().slice(0, 10);

/** Descarga los envíos como CSV (compatible con Excel / Google Sheets). */
export function exportContactsCsv(rows: ExportableContact[]) {
  const headers = ["Nombre", "Email", "País", "Especialidad", "Estado", "Fecha", "CV", "Mensaje"];
  const escape = (value: string) => `"${String(value ?? "").replace(/"/g, '""')}"`;
  const lines = [
    headers.join(";"),
    ...rows.map((r) =>
      [
        r.name,
        r.email,
        r.country,
        r.specialty,
        STATUS_LABEL[r.status] ?? r.status,
        formatDate(r.created_at),
        r.cv_url ? "Sí" : "No",
        (r.message ?? "").replace(/\s+/g, " "),
      ]
        .map(escape)
        .join(";")
    ),
  ];

  const blob = new Blob(["\uFEFF" + lines.join("\r\n")], { type: "text/csv;charset=utf-8;" });
  triggerDownload(blob, `envios-contacto-${timestamp()}.csv`);
}

/** Descarga los envíos como PDF tabular horizontal. */
export function exportContactsPdf(rows: ExportableContact[]) {
  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });

  doc.setFontSize(16);
  doc.text("Envíos de Contacto — Maestría CP", 40, 40);
  doc.setFontSize(10);
  doc.setTextColor(120);
  doc.text(`Generado el ${formatDate(new Date().toISOString())} · ${rows.length} envíos`, 40, 58);

  autoTable(doc, {
    startY: 75,
    head: [["Nombre", "Email", "País", "Especialidad", "Estado", "Fecha", "CV", "Mensaje"]],
    body: rows.map((r) => [
      r.name,
      r.email,
      r.country,
      r.specialty,
      STATUS_LABEL[r.status] ?? r.status,
      formatDate(r.created_at),
      r.cv_url ? "Sí" : "No",
      r.message ?? "",
    ]),
    styles: { fontSize: 8, cellPadding: 4, overflow: "linebreak", valign: "top" },
    headStyles: { fillColor: [33, 62, 204], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [244, 246, 253] },
    columnStyles: {
      0: { cellWidth: 90 },
      1: { cellWidth: 120 },
      2: { cellWidth: 60 },
      3: { cellWidth: 80 },
      4: { cellWidth: 55 },
      5: { cellWidth: 70 },
      6: { cellWidth: 30 },
      7: { cellWidth: "auto" },
    },
    margin: { left: 40, right: 40 },
  });

  doc.save(`envios-contacto-${timestamp()}.pdf`);
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
