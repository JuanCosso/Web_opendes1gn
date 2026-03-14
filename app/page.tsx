import Link from "next/link";
import { Navbar } from "@/components/shop/Navbar";
import { getWhatsAppUrl } from "@/lib/contact";
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

const MARQUEE_ITEMS = [
  "Edición limitada",
  "Materiales reciclados",
  "Hecho a mano",
  "Diseño consciente",
  "Piezas únicas",
];

export default async function HomePage() {
  const latest = await getLatestProducts();

  return (
    <>
      <Navbar />

      {/*
        Un único wrapper con el patrón floral como fondo de toda la página.
        Navbar y Footer quedan fuera — no reciben el patrón.
        El velo crema unificado (0.84) hace que hero y novedades
        tengan exactamente el mismo tono de fondo.
      */}
      <main
        className="w-full relative"
        style={{
          backgroundImage: "url('/img/floral_pattern4.jfif')",
          backgroundSize: "380px auto",
          backgroundRepeat: "repeat",
          backgroundColor: "var(--cream)",
        }}
      >
        {/* Velo único sobre TODO el main — garantiza tono idéntico en todas las secciones */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "rgba(245,240,232,0.7)", zIndex: 0 }}
          aria-hidden
        />

        {/* ── HERO ─────────────────────────────────────────────── */}
        <section className="w-full relative" style={{ zIndex: 1 }}>
          <div className="container-center flex flex-col items-center text-center pt-24 md:pt-32 pb-28 md:pb-36">

            {/* Etiqueta */}
            <div className="animate-fadeUp flex items-center gap-4 mb-8">
              <span className="w-8 h-px bg-[var(--accent)]/50" aria-hidden />
              <span className="text-[10px] tracking-[5px] uppercase text-[var(--accent)]">
                opendes1gn
              </span>
              <span className="w-8 h-px bg-[var(--accent)]/50" aria-hidden />
            </div>

            {/* Título */}
            <h1
              className="animate-fadeUp text-[clamp(3rem,8vw,7rem)] font-light text-[var(--text)] leading-[1.05] mb-8 max-w-4xl"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                animationDelay: "0.1s",
                animationFillMode: "both",
              }}
            >
              Donde la{" "}
              <em className="italic text-[var(--accent2)]">materia</em>
              <br />
              vuelve a{" "}
              <em className="italic text-[var(--accent2)]">nacer</em>
            </h1>

            {/* Ornamento */}
            <div
              className="animate-fadeUp flex items-center gap-5 mb-8"
              style={{ animationDelay: "0.2s", animationFillMode: "both" }}
              aria-hidden
            >
              <span className="w-12 h-px bg-[var(--accent)]/25" />
              <span
                className="text-[18px] text-[var(--accent)]/25 font-light"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                ✦
              </span>
              <span className="w-12 h-px bg-[var(--accent)]/25" />
            </div>

            {/* Descripción */}
            <p
              className="animate-fadeUp text-[15px] leading-[1.9] text-[var(--text-light)] max-w-[460px] mb-12"
              style={{ animationDelay: "0.25s", animationFillMode: "both" }}
            >
              Tu prenda es única y de edición limitada, diseñada y confeccionada
              desde cero con materiales reciclados, cuidadosamente seleccionados.
            </p>

            {/* CTAs */}
            <div
              className="animate-fadeUp flex flex-wrap justify-center gap-4"
              style={{ animationDelay: "0.35s", animationFillMode: "both" }}
            >
              <Link href="/productos" className="btn-primary">
                Ver colección
              </Link>
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
              >
                Contacto <span aria-hidden>→</span>
              </a>
            </div>

          </div>
        </section>

        {/* ── MARQUEE ──────────────────────────────────────────── */}
        <div
          className="w-full overflow-hidden border-y border-[var(--border)] relative"
          style={{
            zIndex: 1,
            backgroundColor: "rgba(245,240,232,0.70)",
            marginTop: "clamp(2.5rem, 6vw, 5rem)",
            marginBottom: "clamp(2.5rem, 6vw, 5rem)",
          }}
        >
          <div
            className="flex whitespace-nowrap py-[14px]"
            style={{
              animation: "marquee 35s linear infinite",
              width: "max-content",
              willChange: "transform",
            }}
          >
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((t, i) => (
              <span key={i} className="inline-flex items-center">
                <span
                  className="text-[var(--text-light)]"
                  style={{
                    fontSize: "clamp(9px, 1.1vw, 11px)",
                    letterSpacing: "clamp(2px, 0.4vw, 3px)",
                    textTransform: "uppercase",
                  }}
                >
                  {t}
                </span>
                <span
                  className="text-[var(--accent)]/50"
                  style={{
                    margin: "0 clamp(0.6rem, 1.5vw, 1.1rem)",
                    fontSize: "clamp(12px, 1.4vw, 16px)",
                    lineHeight: 1,
                  }}
                  aria-hidden
                >
                  ✦
                </span>
              </span>
            ))}
          </div>
        </div>
        {/* ── NOVEDADES ────────────────────────────────────────── */}
        {/* ── NOVEDADES ────────────────────────────────────────── */}
      <section className="w-full relative" style={{ zIndex: 1 }}>
        <div className="container-center pb-24 md:pb-32">

          {/* Encabezado */}
          <div className="animate-fadeUp flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 md:mb-16 pb-6 border-b border-[var(--border)]"
            style={{ animationFillMode: "both" }}>
            <div>
              <span className="block text-[10px] tracking-[5px] uppercase text-[var(--accent)] mb-3">
                Últimos
              </span>
              <h2
                className="text-[clamp(2.5rem,5vw,4.5rem)] font-light text-[var(--text)] leading-[1.0]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Diseños
              </h2>
            </div>
            <Link
              href="/productos"
              className="group inline-flex items-center gap-2 text-[11px] tracking-[3px] uppercase text-[var(--text-light)] hover:text-[var(--accent)] transition-colors duration-300 pb-1 sm:pb-0 self-start sm:self-auto"
            >
              <span>Ver todos</span>
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5" aria-hidden>→</span>
            </Link>
          </div>

          {/* Grid de productos */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-12">
            {latest.length === 0
              ? [...Array(4)].map((_, i) => (
                  <div key={i} className="aspect-[3/4] bg-[var(--blush)] animate-pulse" />
                ))
              : latest.map((product: ProductWithImages, i: number) => (
                  <div
                    key={product.id}
                    className="animate-fadeUp"
                    style={{ animationDelay: `${i * 0.08}s`, animationFillMode: "both" }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
          </div>
              
          {/* Cierre decorativo */}
          <div className="mt-20 md:mt-24 flex flex-col items-center gap-3">
            <div className="flex items-center gap-5 w-full max-w-[160px]">
              <span className="flex-1 h-px bg-[var(--accent)]/15" />
              <span
                className="text-[var(--accent)] text-sm"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
                aria-hidden
              >
                ✦
              </span>
              <span className="flex-1 h-px bg-[var(--accent)]/15" />
            </div>
            <p className="text-[9px] tracking-[5px] uppercase text-[var(--accent)]">
              opendes1gn
            </p>
          </div>
              
        </div>
      </section>
      </main>

      <Footer />
    </>
  );
}