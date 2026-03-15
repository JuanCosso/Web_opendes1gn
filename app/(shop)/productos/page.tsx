import { Suspense } from "react";
import { ProductosClient } from "@/components/shop/ProductosClient";

export const dynamic = "force-dynamic";

async function getProducts() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/productos?limit=100`,
    { cache: "no-store" }
  );
  if (!res.ok) return [];
  const data = await res.json();
  return data.products ?? [];
}

async function getCategories() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/categorias`,
    { cache: "no-store" }
  );
  if (!res.ok) return [];
  return res.json();
}

export default async function ProductosPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  return (
    <main className="w-full min-h-screen bg-[var(--cream)]">
      <div className="container-center py-14 md:py-24">
        <div className="mb-10">
          <span className="block text-[12px] tracking-[3px] uppercase text-[var(--accent)] mb-2">
            Colección
          </span>
          <h1
            className="text-[clamp(2rem,4vw,3.5rem)] font-light text-[var(--text)] italic"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Todo
          </h1>
        </div>
        <Suspense>
          <ProductosClient products={products} categories={categories} />
        </Suspense>
      </div>
    </main>
  );
}