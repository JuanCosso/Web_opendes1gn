import Link from "next/link";
import { Navbar } from "@/components/shop/Navbar";
import { Footer } from "@/components/shop/Footer";
import { ProductCard } from "@/components/shop/ProductCard";
import type { ProductWithImages } from "@/lib";

async function getLatestProducts() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/productos?limit=8`,
    { cache: "no-store" }
  );
  if (!res.ok) return [];
  const data = await res.json();
  return data.products;
}

export default async function HomePage() {
  const latest = await getLatestProducts();

  return (
    <>
      <Navbar />
      <main className="w-full">
        {/* Hero — fondos crema/blush, tipografía referencia */}
        <section className="w-full bg-[var(--cream)] pt-20 md:pt-28 pb-16 md:pb-24">
          <div className="container-center grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div className="animate-fadeUp">
              <p className="flex items-center gap-3 text-[11px] tracking-[4px] uppercase text-[var(--accent)] mb-6">
                <span className="w-10 h-px bg-[var(--accent)]" aria-hidden />
                Nueva colección
              </p>
              <h1
                className="text-[clamp(2.5rem,6vw,5rem)] md:text-[clamp(3rem,7vw,6rem)] font-light text-[var(--text)] leading-[1.0] mb-8"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Moda que <em className="italic text-[var(--accent2)]">te define</em>
              </h1>
              <p className="text-[15px] leading-[1.8] text-[var(--text-light)] max-w-[380px] mb-10">
                Piezas seleccionadas con cuidado. Cada detalle pensado para vos.
              </p>
              <div className="flex flex-wrap gap-5">
                <Link href="/productos" className="btn-primary">
                  Ver colección
                </Link>
                <Link href="/productos?featured=true" className="btn-ghost">
                  Destacados <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
            <div className="hidden md:block animate-fadeUp opacity-0 [animation-delay:0.15s] [animation-fill-mode:forwards]">
              <div
                className="aspect-[4/5] rounded-[var(--radius)] overflow-hidden flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, var(--blush) 0%, var(--butter) 50%, var(--sand) 100%)" }}
              >
                <span className="text-[120px] text-[var(--cream)]/40 italic font-light select-none" style={{ fontFamily: "'Cormorant Garamond', serif" }}>O</span>
              </div>
            </div>
          </div>
        </section>

        {/* Novedades — fondo butter/marron muy claro */}
        <section className="w-full bg-[var(--butter)] py-16 md:py-24">
          <div className="container-center">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14">
              <div>
                <span className="block text-[12px] tracking-[3px] uppercase text-[var(--accent)] mb-3">Recién llegado</span>
                <h2
                  className="text-[clamp(2.25rem,4vw,3.5rem)] font-light text-[var(--text)] leading-[1.1]"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Novedades
                </h2>
              </div>
              <Link
                href="/productos"
                className="text-[13px] text-[var(--text-light)] hover:text-[var(--text)] transition-colors duration-300 w-fit"
              >
                Ver todos →
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {latest.length === 0
                ? [...Array(4)].map((_, i) => (
                    <div key={i} className="aspect-[3/4] bg-[var(--blush)] rounded-[var(--radius)] animate-pulse" />
                  ))
                : latest.map((product: ProductWithImages) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}