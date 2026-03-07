import Link from "next/link";
import { ProductCard } from "@/components/shop/ProductCard";
import type { ProductWithImages } from "@/lib";

async function getProducts(categoria?: string) {
  const params = new URLSearchParams({ limit: "24" });
  if (categoria) params.set("categoria", categoria);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/productos?${params}`,
    { cache: "no-store" }
  );
  if (!res.ok) return { products: [], total: 0 };
  return res.json();
}

async function getCategories() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/categorias`,
    { cache: "no-store" }
  );
  if (!res.ok) return [];
  return res.json();
}

export default async function ProductosPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  const { categoria } = await searchParams;
  const [{ products, total }, categories] = await Promise.all([
    getProducts(categoria),
    getCategories(),
  ]);

  return (
    <main className="w-full min-h-screen bg-[var(--cream)]">
      <div className="container-center py-14 md:py-24">
        <div className="mb-10">
          <span className="block text-[12px] tracking-[3px] uppercase text-[var(--accent)] mb-2">
            {total} {total === 1 ? "pieza" : "piezas"}
          </span>
          <h1
            className="text-[clamp(2rem,4vw,3.5rem)] font-light text-[var(--text)] italic"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {categoria
              ? categories.find((c: { slug: string; name: string }) => c.slug === categoria)?.name ?? "Productos"
              : "Todo"}
          </h1>
        </div>

        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-12 pb-8 border-b border-[var(--border)]">
            <Link
              href="/productos"
              className={`px-4 py-2.5 text-[11px] tracking-[3px] uppercase transition-all duration-300 rounded-[var(--radius-sm)] ${
                !categoria
                  ? "bg-[var(--text)] text-[var(--cream)] hover:bg-[var(--accent)] hover:-translate-y-0.5"
                  : "text-[var(--text-light)] border border-[var(--border)] hover:text-[var(--text)] hover:border-[var(--accent)] hover:-translate-y-0.5"
              }`}
            >
              Todo
            </Link>
            {categories.map((cat: { id: string; name: string; slug: string }) => (
              <Link
                key={cat.id}
                href={`/productos?categoria=${cat.slug}`}
                className={`px-4 py-2.5 text-[11px] tracking-[3px] uppercase transition-all duration-300 rounded-[var(--radius-sm)] ${
                  categoria === cat.slug
                    ? "bg-[var(--text)] text-[var(--cream)] hover:bg-[var(--accent)] hover:-translate-y-0.5"
                    : "text-[var(--text-light)] border border-[var(--border)] hover:text-[var(--text)] hover:border-[var(--accent)] hover:-translate-y-0.5"
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}

        {products.length === 0 ? (
          <div className="py-24 md:py-32 text-center">
            <p
              className="text-[22px] font-light italic text-[var(--text-light)] mb-6"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              No hay productos en esta categoría
            </p>
            <Link
              href="/productos"
              className="text-[12px] tracking-[3px] uppercase text-[var(--accent)] hover:text-[var(--text)] transition-colors duration-300"
            >
              Ver todos →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {products.map((product: ProductWithImages) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
