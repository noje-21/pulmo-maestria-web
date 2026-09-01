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

const BRAND = [33, 62, 204] as const;
const ACCENT = [206, 32, 32] as const;

/**
 * Documento institucional: portada con marca, resumen por estado,
 * índice tabular y una ficha completa por cada envío.
 */
export function exportContactsPdf(rows: ExportableContact[]) {
  const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 42;

  // ---- Encabezado institucional ----
  doc.setFillColor(BRAND[0], BRAND[1], BRAND[2]);
  doc.rect(0, 0, pageW, 96, "F");
  doc.setFillColor(ACCENT[0], ACCENT[1], ACCENT[2]);
  doc.rect(0, 96, pageW, 4, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(17);
  doc.text("Maestría Latinoamericana en Circulación Pulmonar", margin, 44);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text("Reporte institucional de Envíos de Contacto", margin, 64);
  doc.setFontSize(9);
  doc.text(
    `Generado el ${formatDate(new Date().toISOString())} · ${rows.length} registro${rows.length !== 1 ? "s" : ""}`,
    margin,
    81
  );

  // ---- Resumen por estado ----
  const counts = rows.reduce<Record<string, number>>((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {});

  autoTable(doc, {
    startY: 118,
    head: [["Estado", "Cantidad"]],
    body: Object.keys(STATUS_LABEL)
      .filter((k) => counts[k])
      .map((k) => [STATUS_LABEL[k], String(counts[k])]),
    theme: "grid",
    styles: { fontSize: 9, cellPadding: 5 },
    headStyles: { fillColor: [33, 62, 204], textColor: 255, fontStyle: "bold" },
    margin: { left: margin, right: margin },
    tableWidth: 220,
  });

  // ---- Índice general ----
  autoTable(doc, {
    startY: (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 24,
    head: [["#", "Nombre", "Email", "País", "Especialidad", "Estado", "Fecha"]],
    body: rows.map((r, i) => [
      String(i + 1),
      r.name,
      r.email,
      r.country,
      r.specialty,
      STATUS_LABEL[r.status] ?? r.status,
      formatDate(r.created_at),
    ]),
    theme: "striped",
    styles: { fontSize: 8, cellPadding: 4, overflow: "linebreak" },
    headStyles: { fillColor: [33, 62, 204], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [244, 246, 253] },
    columnStyles: { 0: { cellWidth: 20 }, 2: { cellWidth: 130 } },
    margin: { left: margin, right: margin },
  });

  // ---- Ficha completa por envío ----
  rows.forEach((r, i) => {
    doc.addPage();
    doc.setFillColor(BRAND[0], BRAND[1], BRAND[2]);
    doc.rect(0, 0, pageW, 48, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(`Ficha de contacto #${i + 1}`, margin, 30);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(formatDate(r.created_at), pageW - margin, 30, { align: "right" });

    autoTable(doc, {
      startY: 70,
      body: [
        ["Nombre completo", r.name],
        ["Correo electrónico", r.email],
        ["País", r.country],
        ["Especialidad", r.specialty],
        ["Estado del envío", STATUS_LABEL[r.status] ?? r.status],
        ["Fecha de recepción", formatDate(r.created_at)],
        ["Currículum", r.cv_url ? "Adjuntó CV (disponible en el panel de administración)" : "No adjuntó"],
        ["Mensaje", r.message ?? ""],
      ],
      theme: "grid",
      styles: { fontSize: 10, cellPadding: 7, overflow: "linebreak", valign: "top" },
      columnStyles: {
        0: { cellWidth: 140, fontStyle: "bold", fillColor: [244, 246, 253], textColor: [40, 48, 80] },
        1: { cellWidth: "auto" },
      },
      margin: { left: margin, right: margin },
    });
  });

  // ---- Pie de página en todas las páginas ----
  const total = doc.getNumberOfPages();
  for (let p = 1; p <= total; p++) {
    doc.setPage(p);
    const h = doc.internal.pageSize.getHeight();
    doc.setDrawColor(230, 233, 245);
    doc.line(margin, h - 42, pageW - margin, h - 42);
    doc.setTextColor(140, 148, 170);
    doc.setFontSize(8);
    doc.text("Documento interno · Maestría en Circulación Pulmonar", margin, h - 26);
    doc.text(`Página ${p} de ${total}`, pageW - margin, h - 26, { align: "right" });
  }

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
