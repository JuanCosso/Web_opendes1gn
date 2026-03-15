import { Suspense } from "react";
import { ProductosClient } from "@/components/shop/ProductosClient";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ProductosPage() {
  const [rawProducts, categories] = await Promise.all([
    prisma.product.findMany({
      where: { published: true },
      include: {
        images: { orderBy: { position: "asc" } },
        category: true,
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  const products = rawProducts.map((p) => ({
    ...p,
    price: Number(p.price),
    comparePrice: p.comparePrice ? Number(p.comparePrice) : null,
  }));

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