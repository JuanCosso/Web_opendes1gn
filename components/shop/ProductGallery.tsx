"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";

type ProductImage = { id?: string; url: string; alt?: string | null };

interface Props {
  images: ProductImage[];
  productName: string;
}

export function ProductGallery({ images, productName }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement>(null);

  const activeImage = images[activeIndex];

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  }, []);

  if (!images.length) {
    return (
      <div className="relative aspect-[3/4] bg-[var(--blush)] rounded-[var(--radius)] border border-[var(--border)] flex items-center justify-center">
        <span
          className="text-8xl text-[var(--rose)]/40 italic font-light select-none"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          O
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-3">

      {/* Imagen principal con zoom */}
      <div
        ref={containerRef}
        className={`relative aspect-[3/4] bg-[var(--blush)] overflow-hidden rounded-[var(--radius)] border border-[var(--border)] select-none ${
          images.length > 0 ? "cursor-crosshair" : ""
        }`}
        onMouseEnter={() => setZoom(true)}
        onMouseLeave={() => setZoom(false)}
        onMouseMove={handleMouseMove}
      >
        {activeImage && (
          <>
            {/* Imagen base */}
            <Image
              src={activeImage.url}
              alt={activeImage.alt || productName}
              fill
              className={`object-cover transition-opacity duration-300 ${zoom ? "opacity-0" : "opacity-100"}`}
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />

            {/* Versión zoom — se mueve con el mouse */}
            <div
              className={`absolute inset-0 transition-opacity duration-200 ${zoom ? "opacity-100" : "opacity-0"}`}
              style={{
                backgroundImage: `url(${activeImage.url})`,
                backgroundSize: "250%",
                backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                backgroundRepeat: "no-repeat",
              }}
            />
          </>
        )}

        {/* Indicador de zoom */}
        <div
          className={`absolute bottom-4 right-4 bg-[var(--cream)]/80 backdrop-blur-sm text-[var(--text-light)] text-[9px] tracking-[2px] uppercase px-2.5 py-1.5 rounded-sm flex items-center gap-1.5 transition-opacity duration-300 pointer-events-none ${
            zoom ? "opacity-0" : "opacity-100"
          }`}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35M11 8v6M8 11h6"/>
          </svg>
          Zoom
        </div>

        {/* Navegación flechas (si hay múltiples) */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.preventDefault(); setActiveIndex((i) => (i - 1 + images.length) % images.length); }}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-[var(--cream)]/80 backdrop-blur-sm border border-[var(--border)] rounded-full flex items-center justify-center text-[var(--text)] hover:bg-[var(--cream)] transition-all duration-200 opacity-0 group-hover:opacity-100 hover:opacity-100 z-10"
              aria-label="Imagen anterior"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </button>
            <button
              onClick={(e) => { e.preventDefault(); setActiveIndex((i) => (i + 1) % images.length); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-[var(--cream)]/80 backdrop-blur-sm border border-[var(--border)] rounded-full flex items-center justify-center text-[var(--text)] hover:bg-[var(--cream)] transition-all duration-200 opacity-0 group-hover:opacity-100 hover:opacity-100 z-10"
              aria-label="Imagen siguiente"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
          </>
        )}

        {/* Contador de imagen */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[var(--cream)]/80 backdrop-blur-sm text-[var(--text-light)] text-[9px] tracking-[2px] uppercase px-3 py-1.5 rounded-sm pointer-events-none">
            {activeIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((img, i) => (
            <button
              key={img.id || i}
              onClick={() => setActiveIndex(i)}
              className={`relative aspect-square overflow-hidden rounded-[var(--radius-sm)] border transition-all duration-200 ${
                activeIndex === i
                  ? "border-[var(--accent)] ring-1 ring-[var(--accent)]/40 opacity-100"
                  : "border-[var(--border)] opacity-60 hover:opacity-90 hover:border-[var(--accent)]/50"
              }`}
              aria-label={`Ver imagen ${i + 1}`}
            >
              <Image
                src={img.url}
                alt={img.alt || `${productName} ${i + 1}`}
                fill
                className="object-cover"
                sizes="80px"
                unoptimized
              />
              {/* Overlay activo */}
              {activeIndex === i && (
                <div className="absolute inset-0 bg-[var(--accent)]/10" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}