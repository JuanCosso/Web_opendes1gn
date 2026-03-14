"use client";

import Image from "next/image";

const TALLES = ["40", "42", "44", "46", "48"];

const FILAS: { label: string; valores: string[] }[] = [
  { label: "Contorno de busto",   valores: ["88",  "92",  "96",  "100", "104"] },
  { label: "Contorno de cintura", valores: ["64",  "68",  "72",  "76",  "80"]  },
  { label: "Contorno de cadera",  valores: ["92",  "96",  "100", "104", "108"] },
  { label: "Largo de espalda",    valores: ["41,5","42",  "42,5","43",  "43,5"]},
  { label: "Ancho de espalda",    valores: ["34",  "35",  "36",  "37",  "38"]  },
  { label: "Contorno de muñeca",  valores: ["15",  "15,5","16",  "16,5","17"]  },
  { label: "Largo de manga",      valores: ["60",  "60",  "60",  "60",  "60"]  },
  { label: "Altura de cadera",    valores: ["20",  "20",  "20",  "20,5","20,5"]},
  { label: "Largo de pantalón",   valores: ["104", "104", "104", "104", "104"] },
];

export function MedidasContent() {
  return (
    <div className="space-y-16">

      {/* ── Imágenes — centradas, pequeñas, asimétricas por la base ── */}
      <div className="flex items-end justify-center gap-4 sm:gap-6">

        {/* Imagen 1 — apaisada */}
        <div className="w-[40%] sm:w-[34%] max-w-[300px] overflow-hidden rounded-[var(--radius)] flex-shrink-0">
          <Image
            src="https://res.cloudinary.com/dmndohqor/image/upload/v1773528877/gemini5_olmorx.png"
            alt="Guía de medidas — referencia visual"
            width={2270}
            height={1856}
            className="w-full h-auto object-cover"
            sizes="(max-width: 640px) 36vw, 28vw"
            priority
          />
        </div>

        {/* Imagen 2 — vertical */}
        <div className="w-[26%] sm:w-[20%] max-w-[180px] overflow-hidden rounded-[var(--radius)] flex-shrink-0">
          <Image
            src="https://res.cloudinary.com/dmndohqor/image/upload/v1773528877/gemini6_vsqbz5.png"
            alt="Guía de medidas — cómo medirse"
            width={1504}
            height={2796}
            className="w-full h-auto object-cover"
            sizes="(max-width: 640px) 20vw, 16vw"
          />
        </div>

      </div>

      {/* ── Tabla ── */}
      <div>
        <p className="text-[10px] tracking-[3px] uppercase text-[var(--text-light)] mb-5">
          Medidas en centímetros
        </p>

        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <table className="min-w-full text-left border-collapse border border-[var(--border)] rounded-[var(--radius-sm)] overflow-hidden">
            <thead>
              <tr className="bg-[var(--blush)]">
                <th className="px-4 py-3 text-[9px] tracking-[2px] uppercase text-[var(--text-light)] font-normal border-b border-r border-[var(--border)] whitespace-nowrap min-w-[160px]">
                  Medida
                </th>
                {TALLES.map((t) => (
                  <th key={t} className="px-4 py-3 text-[9px] tracking-[2px] uppercase text-[var(--text-light)] font-normal border-b border-[var(--border)] text-center min-w-[52px]">
                    {t}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FILAS.map((fila, i) => (
                <tr
                  key={fila.label}
                  className={`border-b border-[var(--border)] last:border-0 transition-colors hover:bg-[var(--blush)]/40 ${
                    i % 2 === 0 ? "bg-[var(--white)]" : "bg-[var(--cream)]"
                  }`}
                >
                  <td className="px-4 py-3 text-[12px] text-[var(--text-light)] font-light border-r border-[var(--border)] whitespace-nowrap">
                    {fila.label}
                  </td>
                  {fila.valores.map((v, j) => (
                    <td key={j} className="px-4 py-3 text-[13px] text-[var(--text)] font-light text-center">
                      {v}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-5 text-[11px] text-[var(--text-light)] font-light leading-relaxed">
          * Medidas en centímetros, corresponden al cuerpo no a la prenda.
          Ante dudas escribinos por WhatsApp.
        </p>
      </div>

    </div>
  );
}