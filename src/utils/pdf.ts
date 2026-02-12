import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Export a DOM element to PDF with proper multi-page pagination.
 * Slices the rendered canvas into page-sized chunks so text and charts
 * remain readable without zooming.
 */
export const exportToPDF = async (
  elementId: string,
  filename: string = 'export.pdf',
  options?: {
    title?: string;
    orientation?: 'portrait' | 'landscape';
    format?: 'a4' | 'letter';
    quality?: number;
  }
): Promise<void> => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with ID "${elementId}" not found`);
    return;
  }

  try {
    // Temporarily narrow the element for readable PDF output.
    // Without this, wide viewports produce pages where content is too small to read.
    const captureWidth = 1100;
    const origStyle = element.getAttribute('style') || '';
    element.style.width = captureWidth + 'px';
    element.style.maxWidth = captureWidth + 'px';
    element.style.overflow = 'hidden';

    const canvas = await html2canvas(element, {
      useCORS: true,
      logging: false,
      allowTaint: true,
    });

    // Restore original styling immediately
    if (origStyle) element.setAttribute('style', origStyle);
    else element.removeAttribute('style');

    const orientation = options?.orientation || 'portrait';
    const format = options?.format || 'a4';
    const pdf = new jsPDF({ orientation, unit: 'mm', format });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 8;
    const usableWidth = pageWidth - 2 * margin;
    const usableHeight = pageHeight - 2 * margin;

    // Scale factor: source pixels per mm of PDF
    const pxPerMm = canvas.width / usableWidth;
    // How many source pixels fit on one PDF page
    const sourcePageHeight = Math.floor(usableHeight * pxPerMm);

    const totalPages = Math.ceil(canvas.height / sourcePageHeight);

    for (let page = 0; page < totalPages; page++) {
      if (page > 0) pdf.addPage();

      const sourceY = page * sourcePageHeight;
      const sliceHeight = Math.min(sourcePageHeight, canvas.height - sourceY);

      // Create a temporary canvas for this page slice
      const pageCanvas = document.createElement('canvas');
      pageCanvas.width = canvas.width;
      pageCanvas.height = sliceHeight;
      const ctx = pageCanvas.getContext('2d');
      if (!ctx) continue;

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
      ctx.drawImage(
        canvas,
        0, sourceY,
        canvas.width, sliceHeight,
        0, 0,
        canvas.width, sliceHeight
      );

      const imgData = pageCanvas.toDataURL('image/jpeg', options?.quality || 0.92);
      const sliceHeightMm = sliceHeight / pxPerMm;
      pdf.addImage(imgData, 'JPEG', margin, margin, usableWidth, sliceHeightMm);
    }

    if (options?.title) {
      pdf.setProperties({
        title: options.title,
        subject: options.title,
        creator: 'Toolisk',
      });
    }

    pdf.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

/**
 * Export multiple DOM elements to a single PDF (each element on its own page set).
 */
export const exportMultipleToPDF = async (
  elementIds: string[],
  filename: string = 'export.pdf',
  options?: {
    title?: string;
    orientation?: 'portrait' | 'landscape';
    format?: 'a4' | 'letter';
    quality?: number;
  }
): Promise<void> => {
  const orientation = options?.orientation || 'portrait';
  const format = options?.format || 'a4';
  const pdf = new jsPDF({ orientation, unit: 'mm', format });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 8;
  const usableWidth = pageWidth - 2 * margin;
  const usableHeight = pageHeight - 2 * margin;

  let isFirstPage = true;

  for (const elementId of elementIds) {
    const element = document.getElementById(elementId);
    if (!element) {
      console.warn(`Element with ID "${elementId}" not found, skipping...`);
      continue;
    }

    try {
      const canvas = await html2canvas(element, {
        useCORS: true,
        logging: false,
        allowTaint: true,
      });

      const pxPerMm = canvas.width / usableWidth;
      const sourcePageHeight = Math.floor(usableHeight * pxPerMm);
      const totalPages = Math.ceil(canvas.height / sourcePageHeight);

      for (let page = 0; page < totalPages; page++) {
        if (!isFirstPage) pdf.addPage();
        isFirstPage = false;

        const sourceY = page * sourcePageHeight;
        const sliceHeight = Math.min(sourcePageHeight, canvas.height - sourceY);

        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvas.width;
        pageCanvas.height = sliceHeight;
        const ctx = pageCanvas.getContext('2d');
        if (!ctx) continue;

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
        ctx.drawImage(canvas, 0, sourceY, canvas.width, sliceHeight, 0, 0, canvas.width, sliceHeight);

        const imgData = pageCanvas.toDataURL('image/jpeg', options?.quality || 0.92);
        const sliceHeightMm = sliceHeight / pxPerMm;
        pdf.addImage(imgData, 'JPEG', margin, margin, usableWidth, sliceHeightMm);
      }
    } catch (error) {
      console.error(`Error generating PDF for element "${elementId}":`, error);
    }
  }

  if (options?.title) {
    pdf.setProperties({
      title: options.title,
      subject: options.title,
      creator: 'Toolisk',
    });
  }

  pdf.save(filename);
};
