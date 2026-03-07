import Link from "next/link";
import { Navbar } from "@/components/shop/Navbar";
import { Footer } from "@/components/shop/Footer";
import { ProductCard } from "@/components/shop/ProductCard";
import type { ProductWithImages } from "@/lib";

async function getFeaturedProducts() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/productos?featured=true&limit=4`,
    { cache: "no-store" }
  );
  if (!res.ok) return [];
  const data = await res.json();
  return data.products;
}

async function getLatestProducts() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/productos?limit=8`,
    { cache: "no-store" }
  );
  if (!res.ok) return [];
  const data = await res.json();
  return data.products;
}

async function getCategories() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/categorias`,
    { cache: "no-store" }
  );
  if (!res.ok) return [];
  return res.json();
}

export default async function HomePage() {
  const [featured, latest, categories] = await Promise.all([
    getFeaturedProducts(),
    getLatestProducts(),
    getCategories(),
  ]);

  return (
    <>
      <Navbar />
      <main className="w-full">
        {/* Marquee — referencia: fondo oscuro, texto claro */}
        <div className="w-full bg-[var(--text)] py-4 overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap">
            {["Diseño exclusivo", "✦", "Envíos a todo el país", "✦", "Nuevas colecciones", "✦", "Moda con identidad", "✦", "Diseño exclusivo", "✦", "Envíos a todo el país", "✦", "Nuevas colecciones", "✦", "Moda con identidad", "✦"].map((item, i) => (
              <span
                key={i}
                className={`px-10 text-[11px] tracking-[4px] uppercase text-[var(--cream)] ${item === "✦" ? "opacity-100 text-[var(--accent)]" : "opacity-70"}`}
              >
                {item}
              </span>
            ))}
          </div>
        </div>

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
                style={{ background: "linear-gradient(135deg, var(--blush) 0%, var(--butter) 50%, var(--rose) 100%)" }}
              >
                <span className="text-[120px] text-[var(--cream)]/40 italic font-light select-none" style={{ fontFamily: "'Cormorant Garamond', serif" }}>O</span>
              </div>
            </div>
          </div>
        </section>

        {/* Destacados — fondo crema */}
        <section className="w-full bg-[var(--cream)] py-16 md:py-24">
          <div className="container-center">
            <div className="fade-up flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14">
              <div>
                <span className="block text-[12px] tracking-[3px] uppercase text-[var(--accent)] mb-3">Selección</span>
                <h2
                  className="text-[clamp(2.25rem,4vw,3.5rem)] font-light text-[var(--text)] leading-[1.1]"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Destacados
                </h2>
              </div>
              <Link
                href="/productos?featured=true"
                className="text-[13px] text-[var(--text-light)] hover:text-[var(--text)] transition-colors duration-300 w-fit"
              >
                Ver todos →
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {featured.length === 0
                ? [...Array(4)].map((_, i) => (
                    <div key={i} className="aspect-[3/4] bg-[var(--blush)] rounded-[var(--radius)] animate-pulse" />
                  ))
                : featured.map((product: ProductWithImages) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
            </div>
          </div>
        </section>

        {/* Categorías — fondo blush/marron claro */}
        {categories.length > 0 && (
          <section className="w-full bg-[var(--blush)] py-16 md:py-24">
            <div className="container-center">
              <span className="fade-up block text-[12px] tracking-[3px] uppercase text-[var(--accent)] mb-3">Explorá</span>
              <h2
                className="text-[clamp(2.25rem,4vw,3.5rem)] font-light text-[var(--text)] leading-[1.1] mb-12"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Categorías
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {categories.map((cat: { id: string; name: string; slug: string; image: string | null }) => (
                  <Link
                    key={cat.id}
                    href={`/productos?categoria=${cat.slug}`}
                    className="group relative aspect-square bg-[var(--butter)] overflow-hidden rounded-[var(--radius)] card-hover border border-[var(--border)]"
                  >
                    {cat.image && (
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--text)]/60 to-transparent flex items-end p-5">
                      <span
                        className="text-[var(--cream)] text-lg md:text-xl font-light italic"
                        style={{ fontFamily: "'Cormorant Garamond', serif" }}
                      >
                        {cat.name}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Banner ofertas — fondo oscuro como referencia */}
        <section className="w-full bg-[var(--text)] py-14 md:py-20">
          <div className="container-center flex flex-col sm:flex-row items-center justify-between gap-8">
            <div>
              <span className="block text-[11px] tracking-[4px] uppercase text-[var(--accent)] mb-2">Tiempo limitado</span>
              <h2
                className="text-[clamp(2.25rem,4vw,3.5rem)] font-light italic text-[var(--cream)] mb-2"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Hasta 40% OFF
              </h2>
              <p className="text-[15px] text-[var(--cream)]/70">En selección de temporada.</p>
            </div>
            <Link
              href="/productos?categoria=ofertas"
              className="shrink-0 btn-primary !bg-[var(--accent)] hover:!bg-[var(--accent2)]"
            >
              Ver ofertas
            </Link>
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
