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
          style={{ background: "rgba(245,240,232,0.84)", zIndex: 0 }}
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
              desde cero con materiales reciclados o cuidadosamente seleccionados.
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
          style={{ zIndex: 1, backgroundColor: "rgba(245,240,232,0.70)" }}
        >
          <div
            className="flex whitespace-nowrap py-[14px]"
            style={{
              animation: "marquee 28s linear infinite",
              width: "max-content",
            }}
          >
            {/* Dos copias idénticas = loop perfecto sin salto visible */}
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((t, i) => (
              <span key={i} className="inline-flex items-center gap-8 px-8">
                <span className="text-[11px] tracking-[4px] uppercase text-[var(--text-light)]">{t}</span>
                <span className="text-[var(--accent)]/35 text-xs" aria-hidden>✦</span>
              </span>
            ))}
          </div>
        </div>

        {/* ── NOVEDADES ────────────────────────────────────────── */}
        <section className="w-full relative" style={{ zIndex: 1 }}>
          <div className="container-center py-20 md:py-28">

            {/* Encabezado */}
            <div
              className="animate-fadeUp flex flex-col items-center text-center mb-14 gap-5"
              style={{ animationFillMode: "both" }}
            >
              <h2
                className="text-[clamp(2.5rem,5vw,4rem)] font-light text-[var(--text)] leading-[1.0]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Novedades
              </h2>
              <Link
                href="/productos"
                className="group inline-flex items-center gap-3 text-[11px] tracking-[4px] uppercase text-[var(--text-light)] hover:text-[var(--accent)] transition-colors duration-300"
              >
                <span>Ver todos</span>
                <span
                  className="inline-block transition-transform duration-300 group-hover:translate-x-1.5"
                  aria-hidden
                >
                  →
                </span>
              </Link>
            </div>

            {/* Grid de productos */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {latest.length === 0
                ? [...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="aspect-[3/4] bg-[var(--blush)] rounded-[var(--radius)] animate-pulse"
                    />
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
            <div
              className="animate-fadeUp mt-16 md:mt-20 flex flex-col items-center gap-3"
              style={{ animationDelay: "0.4s", animationFillMode: "both" }}
            >
              <div className="flex items-center gap-5 w-full max-w-[200px]">
                <span className="flex-1 h-px bg-[var(--accent)]/15" />
                <span
                  className="text-[var(--accent)]/20 text-base font-light"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  aria-hidden
                >
                  ✦
                </span>
                <span className="flex-1 h-px bg-[var(--accent)]/15" />
              </div>
              <p className="text-[10px] tracking-[5px] uppercase text-[var(--accent)]/25">
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