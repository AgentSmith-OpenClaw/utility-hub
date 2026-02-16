import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// ─── Types ──────────────────────────────────────────────────────────
export interface PDFInputItem {
  label: string;
  value: string;
}

export interface PDFMetricCard {
  label: string;
  value: string;
  subtitle?: string;
}

export interface PDFTableColumn {
  header: string;
  key: string;
  align?: 'left' | 'right' | 'center';
}

export interface PDFTable {
  title: string;
  columns: PDFTableColumn[];
  rows: Record<string, string | number>[];
  maxRows?: number;
}

export interface PDFChartCapture {
  title: string;
  elementId: string;
  width?: 'full' | 'half';
}

export interface PDFSection {
  type: 'inputs' | 'metrics' | 'table' | 'charts' | 'message' | 'spacer';
  title?: string;
  inputs?: PDFInputItem[];
  metrics?: PDFMetricCard[];
  table?: PDFTable;
  charts?: PDFChartCapture[];
  message?: { heading?: string; text: string; color?: string };
  height?: number;
}

export interface PDFReportConfig {
  title: string;
  subtitle?: string;
  filename: string;
  sections: PDFSection[];
  orientation?: 'portrait' | 'landscape';
}

// ─── Constants ──────────────────────────────────────────────────────
const MARGIN = 15;

// ─── Logo drawing ───────────────────────────────────────────────────
function drawLogo(pdf: jsPDF, x: number, y: number, size: number) {
  const r = size * 0.2;
  pdf.setFillColor(79, 70, 229);
  pdf.roundedRect(x, y, size, size, r, r, 'F');
  pdf.setFillColor(255, 255, 255);
  const barH = size * 0.15;
  const barY = y + size * 0.26;
  const barX = x + size * 0.18;
  const barW = size * 0.64;
  pdf.roundedRect(barX, barY, barW, barH, barH * 0.25, barH * 0.25, 'F');
  const colW = size * 0.15;
  const colX = x + (size - colW) / 2;
  const colY = barY + barH * 0.6;
  const colH = size * 0.42;
  pdf.roundedRect(colX, colY, colW, colH, colW * 0.2, colW * 0.2, 'F');
}

// ─── Watermark on every page ────────────────────────────────────────
function addWatermark(pdf: jsPDF) {
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const logoSize = 5;
  const textStr = 'Analysis by toolisk.com';
  pdf.setFontSize(8);
  pdf.setTextColor(180, 180, 200);
  const textW = pdf.getTextWidth(textStr);
  const totalW = logoSize + 2 + textW;
  const baseX = pageW - MARGIN - totalW;
  const baseY = pageH - 8;
  drawLogo(pdf, baseX, baseY - logoSize + 1, logoSize);
  pdf.text(textStr, baseX + logoSize + 2, baseY);
  pdf.setDrawColor(220, 220, 235);
  pdf.setLineWidth(0.3);
  pdf.line(MARGIN, 8, pageW - MARGIN, 8);
}

// ─── Header (first page) ───────────────────────────────────────────
function drawHeader(pdf: jsPDF, config: PDFReportConfig): number {
  const pageW = pdf.internal.pageSize.getWidth();
  let y = 14;
  const logoSize = 10;
  drawLogo(pdf, MARGIN, y - 2, logoSize);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(79, 70, 229);
  pdf.text('Toolisk', MARGIN + logoSize + 3, y + 4);
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(148, 163, 184);
  pdf.text('toolisk.com', MARGIN + logoSize + 3, y + 8);
  const dateStr = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  pdf.setFontSize(8);
  pdf.setTextColor(148, 163, 184);
  pdf.text(dateStr, pageW - MARGIN, y + 4, { align: 'right' });
  y += 16;
  pdf.setDrawColor(79, 70, 229);
  pdf.setLineWidth(0.8);
  pdf.line(MARGIN, y, pageW - MARGIN, y);
  y += 6;
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(30, 41, 59);
  pdf.text(config.title, MARGIN, y + 5);
  y += 8;
  if (config.subtitle) {
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 116, 139);
    pdf.text(config.subtitle, MARGIN, y + 4);
    y += 7;
  }
  y += 4;
  return y;
}

// ─── Ensure space, add page if needed ──────────────────────────────
function ensureSpace(pdf: jsPDF, y: number, needed: number): number {
  const pageH = pdf.internal.pageSize.getHeight();
  if (y + needed > pageH - 15) {
    pdf.addPage();
    addWatermark(pdf);
    return 14;
  }
  return y;
}

// ─── Section Title ─────────────────────────────────────────────────
function drawSectionTitle(pdf: jsPDF, title: string, y: number): number {
  y = ensureSpace(pdf, y, 12);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(79, 70, 229);
  pdf.text(title, MARGIN, y + 4);
  pdf.setDrawColor(79, 70, 229);
  pdf.setLineWidth(0.5);
  pdf.line(MARGIN, y + 6, MARGIN + pdf.getTextWidth(title) + 2, y + 6);
  return y + 10;
}

// ─── Input Parameters (2-column key-value) ─────────────────────────
function drawInputs(pdf: jsPDF, inputs: PDFInputItem[], y: number): number {
  const pageW = pdf.internal.pageSize.getWidth();
  const usableW = pageW - 2 * MARGIN;
  const colW = usableW / 2;
  const rows = Math.ceil(inputs.length / 2);
  const boxH = rows * 6 + 4;
  y = ensureSpace(pdf, y, boxH + 4);
  pdf.setFillColor(248, 250, 252);
  pdf.roundedRect(MARGIN, y - 1, usableW, boxH, 2, 2, 'F');
  pdf.setDrawColor(226, 232, 240);
  pdf.setLineWidth(0.3);
  pdf.roundedRect(MARGIN, y - 1, usableW, boxH, 2, 2, 'S');
  y += 2;
  for (let i = 0; i < inputs.length; i++) {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const xBase = MARGIN + 3 + col * colW;
    const yRow = y + row * 6 + 3;
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 116, 139);
    pdf.text(inputs[i].label + ':', xBase, yRow);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(30, 41, 59);
    const labelW = pdf.getTextWidth(inputs[i].label + ': ');
    pdf.text(inputs[i].value, xBase + labelW, yRow);
  }
  y += boxH + 4;
  return y;
}

// ─── Metric Cards (grid) ──────────────────────────────────────────
function drawMetrics(pdf: jsPDF, metrics: PDFMetricCard[], y: number): number {
  const pageW = pdf.internal.pageSize.getWidth();
  const usableW = pageW - 2 * MARGIN;
  const cols = Math.min(metrics.length, 4);
  const cardW = (usableW - (cols - 1) * 3) / cols;
  const cardH = 18;
  const totalRows = Math.ceil(metrics.length / cols);
  y = ensureSpace(pdf, y, totalRows * (cardH + 3) + 3);
  metrics.forEach((metric, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = MARGIN + col * (cardW + 3);
    const cardY = y + row * (cardH + 3);
    pdf.setFillColor(255, 255, 255);
    pdf.roundedRect(x, cardY, cardW, cardH, 2, 2, 'F');
    pdf.setDrawColor(226, 232, 240);
    pdf.setLineWidth(0.3);
    pdf.roundedRect(x, cardY, cardW, cardH, 2, 2, 'S');
    pdf.setFillColor(79, 70, 229);
    pdf.rect(x, cardY, cardW, 1.2, 'F');
    pdf.setFontSize(7);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 116, 139);
    pdf.text(metric.label, x + 3, cardY + 5.5);
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(30, 41, 59);
    const maxChars = Math.floor(cardW / 2.5);
    const valText = metric.value.length > maxChars ? metric.value.substring(0, maxChars) + '…' : metric.value;
    pdf.text(valText, x + 3, cardY + 11.5);
    if (metric.subtitle) {
      pdf.setFontSize(6.5);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(148, 163, 184);
      pdf.text(metric.subtitle, x + 3, cardY + 15.5);
    }
  });
  y += totalRows * (cardH + 3) + 3;
  return y;
}

// ─── Message Box ───────────────────────────────────────────────────
function drawMessage(pdf: jsPDF, msg: { heading?: string; text: string; color?: string }, y: number): number {
  const pageW = pdf.internal.pageSize.getWidth();
  const usableW = pageW - 2 * MARGIN;
  // Calculate needed height based on text
  pdf.setFontSize(8);
  const lines = pdf.splitTextToSize(msg.text, usableW - 10);
  const lineCount = Math.min(lines.length, 4);
  const boxH = (msg.heading ? 5 : 0) + lineCount * 4 + 6;
  y = ensureSpace(pdf, y, boxH + 4);
  pdf.setFillColor(238, 242, 255);
  pdf.roundedRect(MARGIN, y, usableW, boxH, 2, 2, 'F');
  pdf.setFillColor(79, 70, 229);
  pdf.rect(MARGIN, y, 1.5, boxH, 'F');
  let textY = y + 4;
  if (msg.heading) {
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(30, 41, 59);
    pdf.text(msg.heading, MARGIN + 5, textY + 1);
    textY += 5;
  }
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(71, 85, 105);
  pdf.text(lines.slice(0, 4), MARGIN + 5, textY + 1);
  y += boxH + 4;
  return y;
}

// ─── Table ─────────────────────────────────────────────────────────
function drawTable(pdf: jsPDF, table: PDFTable, y: number): number {
  const pageW = pdf.internal.pageSize.getWidth();
  const usableW = pageW - 2 * MARGIN;
  const cols = table.columns;
  const colW = usableW / cols.length;
  const rowH = 5.5;
  const headerH = 7;
  const rows = table.maxRows ? table.rows.slice(0, table.maxRows) : table.rows;
  if (table.title) {
    y = ensureSpace(pdf, y, headerH + 12);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(30, 41, 59);
    pdf.text(table.title, MARGIN, y + 3);
    y += 6;
  }
  // Header
  pdf.setFillColor(241, 245, 249);
  pdf.rect(MARGIN, y, usableW, headerH, 'F');
  pdf.setDrawColor(226, 232, 240);
  pdf.setLineWidth(0.2);
  pdf.rect(MARGIN, y, usableW, headerH, 'S');
  cols.forEach((col, i) => {
    pdf.setFontSize(7);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(71, 85, 105);
    const align = col.align || (i === 0 ? 'left' : 'right');
    const xPos = align === 'right' ? MARGIN + (i + 1) * colW - 2 : MARGIN + i * colW + 2;
    pdf.text(col.header, xPos, y + 4.5, { align: align as any });
  });
  y += headerH;

  // Data rows with page-break support
  for (let rowIdx = 0; rowIdx < rows.length; rowIdx++) {
    y = ensureSpace(pdf, y, rowH);
    if (rowIdx % 2 === 0) {
      pdf.setFillColor(248, 250, 252);
      pdf.rect(MARGIN, y, usableW, rowH, 'F');
    }
    pdf.setDrawColor(241, 245, 249);
    pdf.setLineWidth(0.1);
    pdf.line(MARGIN, y + rowH, MARGIN + usableW, y + rowH);
    const row = rows[rowIdx];
    cols.forEach((col, i) => {
      pdf.setFontSize(7);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(51, 65, 85);
      const val = String(row[col.key] ?? '');
      const align = col.align || (i === 0 ? 'left' : 'right');
      const xPos = align === 'right' ? MARGIN + (i + 1) * colW - 2 : MARGIN + i * colW + 2;
      const maxC = Math.floor(colW / 2);
      const truncated = val.length > maxC ? val.substring(0, maxC) + '…' : val;
      pdf.text(truncated, xPos, y + 3.8, { align: align as any });
    });
    y += rowH;
  }
  y += 2;
  if (table.maxRows && table.rows.length > table.maxRows) {
    pdf.setFontSize(6.5);
    pdf.setFont('helvetica', 'italic');
    pdf.setTextColor(148, 163, 184);
    pdf.text(`Showing ${table.maxRows} of ${table.rows.length} rows. Full data available in Excel export.`, MARGIN, y + 1);
    y += 5;
  }
  return y;
}

// ─── Chart Capture ─────────────────────────────────────────────────
async function captureChart(elementId: string): Promise<HTMLCanvasElement | null> {
  const el = document.getElementById(elementId);
  if (!el) return null;
  try {
    return await html2canvas(el, {
      useCORS: true,
      logging: false,
      allowTaint: true,
      scale: 2,
      backgroundColor: '#ffffff',
    } as any);
  } catch {
    return null;
  }
}

async function drawCharts(pdf: jsPDF, charts: PDFChartCapture[], y: number): Promise<number> {
  const pageW = pdf.internal.pageSize.getWidth();
  const usableW = pageW - 2 * MARGIN;

  for (let i = 0; i < charts.length; i++) {
    const chart = charts[i];
    const canvas = await captureChart(chart.elementId);
    if (!canvas) continue;

    const targetW = chart.width === 'half' ? (usableW - 3) / 2 : usableW;
    const aspectRatio = canvas.height / canvas.width;
    const targetH = Math.min(targetW * aspectRatio, 75);

    y = ensureSpace(pdf, y, targetH + 10);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(71, 85, 105);
    pdf.text(chart.title, MARGIN, y + 3);
    y += 5;
    pdf.setDrawColor(226, 232, 240);
    pdf.setLineWidth(0.3);
    pdf.roundedRect(MARGIN, y, targetW, targetH, 1, 1, 'S');
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', MARGIN + 0.5, y + 0.5, targetW - 1, targetH - 1);
    y += targetH + 4;
  }
  return y;
}

// ─── Main Export Function ──────────────────────────────────────────
export const generatePDFReport = async (config: PDFReportConfig): Promise<void> => {
  const orientation = config.orientation || 'portrait';
  const pdf = new jsPDF({ orientation, unit: 'mm', format: 'a4' });
  let y = drawHeader(pdf, config);
  addWatermark(pdf);

  for (const section of config.sections) {
    switch (section.type) {
      case 'inputs':
        if (section.title) y = drawSectionTitle(pdf, section.title, y);
        if (section.inputs) y = drawInputs(pdf, section.inputs, y);
        break;
      case 'metrics':
        if (section.title) y = drawSectionTitle(pdf, section.title, y);
        if (section.metrics) y = drawMetrics(pdf, section.metrics, y);
        break;
      case 'message':
        if (section.message) y = drawMessage(pdf, section.message, y);
        break;
      case 'table':
        if (section.title) y = drawSectionTitle(pdf, section.title, y);
        if (section.table) y = drawTable(pdf, section.table, y);
        break;
      case 'charts':
        if (section.title) y = drawSectionTitle(pdf, section.title, y);
        if (section.charts) y = await drawCharts(pdf, section.charts, y);
        break;
      case 'spacer':
        y += section.height || 5;
        break;
    }
  }

  pdf.setProperties({
    title: config.title,
    subject: config.subtitle || config.title,
    creator: 'Toolisk - toolisk.com',
    author: 'Toolisk',
  });
  pdf.save(config.filename);
};

// ─── Currency / number formatters ──────────────────────────────────
export function fmtCurrency(value: number, currency: string = 'INR'): string {
  if (currency === 'INR') return '₹' + value.toLocaleString('en-IN', { maximumFractionDigits: 0 });
  return '$' + value.toLocaleString('en-US', { maximumFractionDigits: 0 });
}
export function fmtPercent(value: number, decimals: number = 1): string {
  return value.toFixed(decimals) + '%';
}
export function fmtNumber(value: number): string {
  return value.toLocaleString('en-IN', { maximumFractionDigits: 0 });
}

// ─── Legacy export (kept for backward compat) ─────────────────────
export const exportToPDF = generatePDFReport as any;
