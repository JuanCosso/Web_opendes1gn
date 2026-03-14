import type { Metadata } from "next";
import { MedidasContent } from "@/components/shop/MedidasContent";

export const metadata: Metadata = {
  title: "Cómo tomar medidas — opendes1gn",
  description: "Guía de medidas para encargar tu prenda personalizada hecha a medida.",
};

export default function MedidasPage() {
  return (
    <main className="w-full min-h-screen bg-[var(--cream)]">
      <div className="container-center py-14 md:py-24">

        <div className="mb-10">
          <span className="block text-[12px] tracking-[3px] uppercase text-[var(--accent)] mb-2">
            Referencia
          </span>
          <h1
            className="text-[clamp(2rem,4vw,3.5rem)] font-light text-[var(--text)] italic"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Cómo tomar medidas
          </h1>
        </div>

        <MedidasContent />
      </div>
    </main>
  );
}