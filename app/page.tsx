import Link from "next/link";
import { Navbar } from "@/components/shop/Navbar";
import { Footer } from "@/components/shop/Footer";
import { ProductCard } from "@/components/shop/ProductCard";
import type { ProductWithImages } from "@/types";

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
      <main>

        {/* ── MARQUEE ─────────────────────────────────── */}
        <div className="bg-black py-3 overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap">
            {["Diseño exclusivo", "✦", "Envíos a todo el país", "✦", "Nuevas colecciones", "✦", "Moda con identidad", "✦", "Diseño exclusivo", "✦", "Envíos a todo el país", "✦", "Nuevas colecciones", "✦", "Moda con identidad", "✦"].map((item, i) => (
              <span key={i} className={`px-8 text-xs tracking-widest uppercase ${item === "✦" ? "text-gray-400" : "text-white/60"}`}>
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* ── PRODUCTOS DESTACADOS ────────────────────── */}
        <section className="max-w-7xl mx-auto px-4 py-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Selección</p>
              <h2 className="text-2xl font-bold">Destacados</h2>
            </div>
            <Link href="/productos?featured=true" className="text-sm underline text-gray-500 hover:text-black">
              Ver todos
            </Link>
          </div>

          {featured.length === 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {featured.map((product: ProductWithImages) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>

        {/* ── CATEGORÍAS ──────────────────────────────── */}
        {categories.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 py-10">
            <div className="mb-8">
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Explorá</p>
              <h2 className="text-2xl font-bold">Categorías</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((cat: { id: string; name: string; slug: string; image: string | null }) => (
                <Link
                  key={cat.id}
                  href={`/productos?categoria=${cat.slug}`}
                  className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group"
                >
                  {cat.image && (
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  )}
                  <div className="absolute inset-0 bg-black/30 flex items-end p-4">
                    <span className="text-white font-semibold text-sm">{cat.name}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── BANNER PROMOCIÓN ────────────────────────── */}
        <section className="max-w-7xl mx-auto px-4 py-6">
          <div className="bg-black text-white rounded-2xl px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">Tiempo limitado</p>
              <h2 className="text-3xl font-bold mb-2">Hasta 40% OFF</h2>
              <p className="text-gray-400 text-sm">En selección de temporada. No te lo pierdas.</p>
            </div>
            <Link
              href="/productos?categoria=ofertas"
              className="bg-white text-black px-8 py-3 rounded text-sm font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap"
            >
              Ver ofertas →
            </Link>
          </div>
        </section>

        {/* ── NOVEDADES ───────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-4 py-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Recién llegado</p>
              <h2 className="text-2xl font-bold">Novedades</h2>
            </div>
            <Link href="/productos" className="text-sm underline text-gray-500 hover:text-black">
              Ver todos
            </Link>
          </div>

          {latest.length === 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {latest.map((product: ProductWithImages) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>

      </main>
      <Footer />
    </>
  );
}