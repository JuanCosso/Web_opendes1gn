// components/shop/MedidasSection.tsx
"use client";

import Image from "next/image";
import { useState } from "react";

// ── Datos de la tabla — editá aquí los valores ──────────────────────────────
const TABLA_MEDIDAS = [
  { talle: "XS", busto: "80–84", cintura: "60–64", cadera: "86–90", largo: "~90" },
  { talle: "S",  busto: "84–88", cintura: "64–68", cadera: "90–94", largo: "~92" },
  { talle: "M",  busto: "88–92", cintura: "68–72", cadera: "94–98", largo: "~94" },
  { talle: "L",  busto: "92–96", cintura: "72–76", cadera: "98–102",largo: "~96" },
  { talle: "XL", busto: "96–102",cintura: "76–82", cadera: "102–108",largo: "~98" },
];

// ── Imágenes — reemplazá src por las URLs reales de tus imágenes ─────────────
// Imagen 1: 2270×1856 → apaisada (landscape)
// Imagen 2: 1504×2796 → vertical (portrait)
const IMG_1 = {
  src: "/images/medidas-guia-1.jpg",   // reemplazar con URL real
  alt: "Guía de medidas — vista frontal",
  width: 2270,
  height: 1856,
};
const IMG_2 = {
  src: "/images/medidas-guia-2.jpg",   // reemplazar con URL real
  alt: "Guía de medidas — cómo medirse",
  width: 1504,
  height: 2796,
};

export function MedidasSection() {
  const [openRow, setOpenRow] = useState<string | null>(null);

  return (
    <section className="border-t border-[var(--border)] pt-16 mt-16">

      {/* Encabezado */}
      <div className="mb-10">
        <span className="block text-[10px] tracking-[4px] uppercase text-[var(--accent)] mb-2">
          Referencia
        </span>
        <h2
          className="text-[clamp(1.6rem,3vw,2.4rem)] font-light italic text-[var(--text)]"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Guía de medidas
        </h2>
      </div>

      {/* Texto introductorio */}
      <p className="text-[14px] leading-[1.9] text-[var(--text-light)] font-light max-w-2xl mb-12">
        Todas nuestras prendas son únicas y confeccionadas artesanalmente. Te recomendamos medirte
        antes de elegir tu talle para asegurarte el mejor ajuste. Las medidas de la tabla
        corresponden al cuerpo, no a la prenda. Ante cualquier duda, escribinos por WhatsApp.
      </p>

      {/* Bloque imágenes + tabla */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

        {/* Columna izquierda — imágenes */}
        <div className="flex flex-col gap-6">

          {/* Imagen 1 — apaisada 2270×1856 */}
          <div
            className="w-full overflow-hidden rounded-[var(--radius)] border border-[var(--border)] bg-[var(--blush)]"
            style={{ aspectRatio: "2270 / 1856" }}
          >
            <Image
              src={IMG_1.src}
              alt={IMG_1.alt}
              width={IMG_1.width}
              height={IMG_1.height}
              className="w-full h-full object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          {/* Imagen 2 — vertical 1504×2796, acotada en altura para no ocupar todo */}
          <div
            className="w-full overflow-hidden rounded-[var(--radius)] border border-[var(--border)] bg-[var(--blush)]"
            style={{ aspectRatio: "1504 / 2796", maxHeight: "520px" }}
          >
            <Image
              src={IMG_2.src}
              alt={IMG_2.alt}
              width={IMG_2.width}
              height={IMG_2.height}
              className="w-full h-full object-cover object-top"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>

        {/* Columna derecha — tabla */}
        <div className="lg:sticky lg:top-10">
          <p className="text-[10px] tracking-[3px] uppercase text-[var(--text-light)] mb-5">
            Medidas en centímetros
          </p>

          {/* Tabla desktop */}
          <div className="hidden sm:block border border-[var(--border)] rounded-[var(--radius-sm)] overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-5 bg-[var(--blush)] px-4 py-3 text-[9px] tracking-[2.5px] uppercase text-[var(--text-light)]">
              <span>Talle</span>
              <span>Busto</span>
              <span>Cintura</span>
              <span>Cadera</span>
              <span>Largo</span>
            </div>
            {/* Filas */}
            {TABLA_MEDIDAS.map((row, i) => (
              <div
                key={row.talle}
                className={`grid grid-cols-5 px-4 py-3 text-[13px] font-light text-[var(--text)] border-t border-[var(--border)] transition-colors ${
                  i % 2 === 0 ? "bg-[var(--white)]" : "bg-[var(--cream)]"
                } hover:bg-[var(--blush)]/60`}
              >
                <span className="font-normal tracking-[1px]">{row.talle}</span>
                <span>{row.busto}</span>
                <span>{row.cintura}</span>
                <span>{row.cadera}</span>
                <span>{row.largo}</span>
              </div>
            ))}
          </div>

          {/* Tabla móvil — acordeón por talle */}
          <div className="sm:hidden border border-[var(--border)] rounded-[var(--radius-sm)] overflow-hidden divide-y divide-[var(--border)]">
            {TABLA_MEDIDAS.map((row) => (
              <div key={row.talle}>
                <button
                  type="button"
                  onClick={() => setOpenRow(openRow === row.talle ? null : row.talle)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-[var(--white)] hover:bg-[var(--blush)]/60 transition-colors"
                >
                  <span className="text-[13px] tracking-[1px] text-[var(--text)]">Talle {row.talle}</span>
                  <svg
                    width="12" height="12" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2"
                    className={`text-[var(--text-light)] transition-transform ${openRow === row.talle ? "rotate-180" : ""}`}
                  >
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </button>
                {openRow === row.talle && (
                  <div className="px-4 py-3 bg-[var(--cream)] space-y-2">
                    {[
                      ["Busto", row.busto],
                      ["Cintura", row.cintura],
                      ["Cadera", row.cadera],
                      ["Largo", row.largo],
                    ].map(([label, val]) => (
                      <div key={label} className="flex justify-between text-[13px]">
                        <span className="text-[var(--text-light)] text-[10px] tracking-[2px] uppercase">{label}</span>
                        <span className="text-[var(--text)] font-light">{val} cm</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Nota al pie */}
          <p className="mt-5 text-[11px] text-[var(--text-light)] font-light leading-relaxed">
            * Medidas del cuerpo en centímetros. Las prendas pueden tener entre 2 y 4 cm de
            holgura según el estilo. Si estás entre dos talles, recomendamos elegir el mayor.
          </p>
        </div>
      </div>
    </section>
  );
}