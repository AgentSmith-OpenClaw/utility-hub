import React, { useRef, useState, useEffect, useCallback } from 'react';

export interface PageThumb {
  index: number;
  thumbnail: string; // data URL from canvas render
}

type GridMode = 'display' | 'multi' | 'reorder';

interface PdfPageGridProps {
  pages: PageThumb[];
  mode: GridMode;
  selected?: Set<number>;
  onSelect?: (index: number, selected: boolean) => void;
  order?: number[];
  onReorder?: (fromIndex: number, toIndex: number) => void;
  onRotate?: (index: number) => void;
  rotation?: Record<number, 0 | 90 | 180 | 270>;
}

const TILE_WIDTH = 120;
const TILE_HEIGHT = 165;
const VIEWPORT_BUFFER = 20;

function useVisibleRange(
  containerRef: React.RefObject<HTMLDivElement | null>,
  total: number,
  colCount: number,
): [number, number] {
  const [range, setRange] = useState<[number, number]>([0, total]);

  useEffect(() => {
    if (total < 50) {
      setRange([0, total]);
      return;
    }
    const container = containerRef.current;
    if (!container) return;

    const rowHeight = TILE_HEIGHT + 12 + 20; // tile + gap + label

    const update = () => {
      const { scrollTop, clientHeight } = document.documentElement;
      const rect = container.getBoundingClientRect();
      const containerTop = rect.top + scrollTop;

      const viewStart = scrollTop - containerTop;
      const viewEnd = viewStart + clientHeight;

      const firstRow = Math.max(0, Math.floor(viewStart / rowHeight) - VIEWPORT_BUFFER);
      const lastRow = Math.ceil(viewEnd / rowHeight) + VIEWPORT_BUFFER;

      const start = Math.max(0, firstRow * colCount);
      const end = Math.min(total, lastRow * colCount);
      setRange([start, end]);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [containerRef, total, colCount]);

  return range;
}

export default function PdfPageGrid({
  pages,
  mode,
  selected,
  onSelect,
  order,
  onReorder,
  onRotate,
  rotation,
}: PdfPageGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragIndexRef = useRef<number | null>(null);
  const [dropTarget, setDropTarget] = useState<number | null>(null);

  // Approximate column count for virtualization
  const colCount = 6; // max columns in xl layout
  const [visibleStart, visibleEnd] = useVisibleRange(containerRef, pages.length, colCount);

  const displayPages = mode === 'reorder' && order
    ? order.map((srcIdx) => pages.find((p) => p.index === srcIdx) ?? pages[srcIdx])
    : pages;

  const handleDragStart = useCallback(
    (e: React.DragEvent<HTMLDivElement>, tileIndex: number) => {
      dragIndexRef.current = tileIndex;
      e.dataTransfer.effectAllowed = 'move';
    },
    [],
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>, tileIndex: number) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      setDropTarget(tileIndex);
    },
    [],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>, tileIndex: number) => {
      e.preventDefault();
      if (dragIndexRef.current !== null && dragIndexRef.current !== tileIndex) {
        onReorder?.(dragIndexRef.current, tileIndex);
      }
      dragIndexRef.current = null;
      setDropTarget(null);
    },
    [onReorder],
  );

  const handleDragEnd = useCallback(() => {
    dragIndexRef.current = null;
    setDropTarget(null);
  }, []);

  return (
    <div
      ref={containerRef}
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
      role={mode === 'reorder' ? 'list' : mode === 'multi' ? 'group' : undefined}
      aria-label={mode === 'multi' ? 'PDF pages — click to select or deselect' : undefined}
    >
      {displayPages.map((page, tileIndex) => {
        // Virtualization: skip rendering tiles far from viewport when >= 50 pages
        const shouldRender = pages.length < 50 || (tileIndex >= visibleStart && tileIndex < visibleEnd);

        const rot = rotation?.[page.index] ?? 0;
        const isSelected = mode === 'multi' && selected?.has(page.index);
        const isDragTarget = mode === 'reorder' && dropTarget === tileIndex;

        if (!shouldRender) {
          return (
            <div
              key={page.index}
              style={{ width: TILE_WIDTH, height: TILE_HEIGHT + 24 }}
              aria-hidden="true"
            />
          );
        }

        return (
          <div
            key={page.index}
            className={`relative flex flex-col items-center gap-1 ${
              mode === 'reorder' ? 'cursor-grab active:cursor-grabbing' : ''
            }`}
            draggable={mode === 'reorder'}
            onDragStart={mode === 'reorder' ? (e) => handleDragStart(e, tileIndex) : undefined}
            onDragOver={mode === 'reorder' ? (e) => handleDragOver(e, tileIndex) : undefined}
            onDrop={mode === 'reorder' ? (e) => handleDrop(e, tileIndex) : undefined}
            onDragEnd={mode === 'reorder' ? handleDragEnd : undefined}
            onClick={
              mode === 'multi'
                ? () => onSelect?.(page.index, !isSelected)
                : undefined
            }
            role={mode === 'reorder' ? 'listitem' : mode === 'multi' ? 'checkbox' : undefined}
            aria-label={
              mode === 'reorder'
                ? `Page ${tileIndex + 1} of ${pages.length}, draggable`
                : mode === 'multi'
                  ? `Page ${tileIndex + 1}`
                  : undefined
            }
            aria-checked={mode === 'multi' ? isSelected : undefined}
            tabIndex={mode === 'reorder' || mode === 'multi' ? 0 : undefined}
            onKeyDown={
              mode === 'reorder'
                ? (e) => {
                    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                      e.preventDefault();
                      const toIndex = Math.max(0, tileIndex - 1);
                      if (toIndex !== tileIndex) onReorder?.(tileIndex, toIndex);
                    } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                      e.preventDefault();
                      const toIndex = Math.min(pages.length - 1, tileIndex + 1);
                      if (toIndex !== tileIndex) onReorder?.(tileIndex, toIndex);
                    }
                  }
                : mode === 'multi'
                  ? (e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onSelect?.(page.index, !isSelected);
                      }
                    }
                  : undefined
            }
          >
            {/* Drop insertion line */}
            {isDragTarget && (
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-rose-500 z-10 rounded-full" />
            )}

            {/* Thumbnail wrapper */}
            <div
              className={`group/tile relative overflow-hidden rounded-lg border-2 transition-all ${
                mode === 'multi'
                  ? isSelected
                    ? 'border-rose-500 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 cursor-pointer'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
              style={{ width: TILE_WIDTH, height: TILE_HEIGHT }}
            >
              <img
                src={page.thumbnail}
                alt={`Page ${page.index + 1}`}
                className="object-cover w-full h-full"
                style={{
                  transform: rot ? `rotate(${rot}deg)` : undefined,
                  transition: 'transform 0.2s ease',
                }}
                draggable={false}
              />

              {/* Multi-select checkbox indicator */}
              {mode === 'multi' && (
                <div className="absolute top-1.5 right-1.5">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shadow-sm transition-all ${
                      isSelected
                        ? 'bg-rose-500 border-rose-500 opacity-100'
                        : 'bg-white/70 border-slate-400 opacity-30 group-hover/tile:opacity-100'
                    }`}
                  >
                    {isSelected && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
              )}

              {/* Rotate button */}
              {onRotate && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRotate(page.index);
                  }}
                  className="absolute bottom-1 right-1 w-6 h-6 flex items-center justify-center bg-white/90 hover:bg-white rounded border border-slate-200 text-slate-600 hover:text-rose-600 transition-colors shadow-sm"
                  aria-label={`Rotate page ${page.index + 1}`}
                  title="Rotate page"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              )}
            </div>

            {/* Page number label */}
            <span className="text-[11px] text-slate-500 font-medium leading-none">
              {page.index + 1}
            </span>
          </div>
        );
      })}
    </div>
  );
}
