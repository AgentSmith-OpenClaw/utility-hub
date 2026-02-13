import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Mobile-safe PDF export.
 *
 * On mobile, Tailwind responsive breakpoints (min-width media queries)
 * respond to the *viewport* width, not the element width. Simply setting
 * the element wider causes a stretched mobile layout. To work around this
 * we temporarily force desktop grid styles via inline overrides before
 * html2canvas captures the element, then restore everything afterwards.
 */

type GridOverride = [matchClass: string, cssValue: string];

const GRID_OVERRIDES: GridOverride[] = [
  ['lg:grid-cols-[420px_1fr]', '420px 1fr'],
  ['xl:grid-cols-[320px_1fr]', '320px 1fr'],
  ['xl:grid-cols-2', 'repeat(2, 1fr)'],
  ['lg:grid-cols-2', 'repeat(2, 1fr)'],
  ['lg:grid-cols-3', 'repeat(3, 1fr)'],
  ['lg:grid-cols-4', 'repeat(4, 1fr)'],
  ['md:grid-cols-2', 'repeat(2, 1fr)'],
  ['md:grid-cols-3', 'repeat(3, 1fr)'],
];

function forceDesktopLayout(root: HTMLElement): Map<HTMLElement, string> {
  const saved = new Map<HTMLElement, string>();

  // Save and override the root element
  saved.set(root, root.getAttribute('style') || '');
  root.style.width = '1200px';
  root.style.maxWidth = '1200px';
  root.style.overflow = 'visible';

  // Walk all children and force desktop grid/flex layouts
  root.querySelectorAll('[class]').forEach((node) => {
    const el = node as HTMLElement;
    const cls = typeof el.className === 'string' ? el.className : '';
    if (!cls) return;

    const overrides: { prop: string; val: string }[] = [];

    for (const [twClass, cssVal] of GRID_OVERRIDES) {
      if (cls.includes(twClass)) {
        overrides.push({ prop: 'grid-template-columns', val: cssVal });
      }
    }

    // Disable sticky positioning (breaks in capture context)
    if (cls.includes('lg:sticky') || cls.includes('xl:sticky')) {
      overrides.push({ prop: 'position', val: 'static' });
    }
    // Force hidden elements visible at lg/xl
    if (cls.includes('lg:block') || cls.includes('xl:block')) {
      overrides.push({ prop: 'display', val: 'block' });
    }
    if (cls.includes('hidden') && (cls.includes('lg:grid') || cls.includes('xl:grid'))) {
      overrides.push({ prop: 'display', val: 'grid' });
    }

    if (overrides.length > 0) {
      saved.set(el, el.getAttribute('style') || '');
      overrides.forEach(({ prop, val }) => el.style.setProperty(prop, val));
    }
  });

  return saved;
}

function restoreStyles(saved: Map<HTMLElement, string>) {
  saved.forEach((orig, el) => {
    if (orig) el.setAttribute('style', orig);
    else el.removeAttribute('style');
  });
}

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

  const PDF_WIDTH = 1200;
  const saved = forceDesktopLayout(element);

  // Give the browser a full frame to reflow
  await new Promise((r) => setTimeout(r, 250));

  try {
    const canvas = await html2canvas(element, {
      useCORS: true,
      logging: false,
      allowTaint: true,
      scale: 2,
      width: PDF_WIDTH,
      windowWidth: PDF_WIDTH,
    } as Parameters<typeof html2canvas>[1]);

    const orientation = options?.orientation || 'portrait';
    const format = options?.format || 'a4';
    const pdf = new jsPDF({ orientation, unit: 'mm', format });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 8;
    const usableWidth = pageWidth - 2 * margin;
    const usableHeight = pageHeight - 2 * margin;

    const pxPerMm = canvas.width / usableWidth;
    const sourcePageHeight = Math.floor(usableHeight * pxPerMm);
    const totalPages = Math.ceil(canvas.height / sourcePageHeight);

    for (let page = 0; page < totalPages; page++) {
      if (page > 0) pdf.addPage();

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

    if (options?.title) {
      pdf.setProperties({ title: options.title, subject: options.title, creator: 'Toolisk' });
    }

    pdf.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  } finally {
    restoreStyles(saved);
  }
};

/**
 * Export multiple DOM elements to a single PDF (each on its own page set).
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
    if (!element) continue;

    const saved = forceDesktopLayout(element);
    await new Promise((r) => setTimeout(r, 250));

    try {
      const canvas = await html2canvas(element, {
        useCORS: true,
        logging: false,
        allowTaint: true,
        scale: 2,
        width: 1200,
        windowWidth: 1200,
      } as Parameters<typeof html2canvas>[1]);

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

        const imgData = pageCanvas.toDataURL('image/jpeg', 0.92);
        const sliceHeightMm = sliceHeight / pxPerMm;
        pdf.addImage(imgData, 'JPEG', margin, margin, usableWidth, sliceHeightMm);
      }
    } catch (error) {
      console.error(`Error generating PDF for "${elementId}":`, error);
    } finally {
      restoreStyles(saved);
    }
  }

  if (options?.title) {
    pdf.setProperties({ title: options.title, subject: options.title, creator: 'Toolisk' });
  }

  pdf.save(filename);
};
