import { notFound } from "next/navigation";
import Link from "next/link";
import { AddToCartButton } from "@/components/shop/AddToCartButton";
import { ProductGallery } from "@/components/shop/ProductGallery";
import { ShareButtons } from "@/components/shop/ShareButtons";

async function getProduct(slug: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/productos/${slug}`,
    { cache: "no-store" }
  );
  if (!res.ok) return null;
  return res.json();
}

export default async function ProductoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const productUrl = `${process.env.NEXT_PUBLIC_APP_URL}/productos/${slug}`;

  return (
    <main className="w-full min-h-screen bg-[var(--cream)]">
      <div className="container-center py-12 md:py-20">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[11px] tracking-[3px] uppercase text-[var(--text-light)] mb-12">
          <Link href="/" className="hover:text-[var(--text)] transition-colors duration-300">
            Inicio
          </Link>
          <span>·</span>
          <Link href="/productos" className="hover:text-[var(--text)] transition-colors duration-300">
            Productos
          </Link>
          {product.category && (
            <>
              <span>·</span>
              <Link
                href={`/productos?categoria=${product.category.slug}`}
                className="hover:text-[var(--text)] transition-colors duration-300"
              >
                {product.category.name}
              </Link>
            </>
          )}
          <span>·</span>
          <span className="text-[var(--text)] truncate max-w-[140px] md:max-w-xs">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">

          {/* ── GALERÍA ── */}
          <ProductGallery images={product.images} productName={product.name} />

          {/* ── INFO ── */}
          <div className="md:sticky md:top-10 space-y-0">

            {/* Categoría */}
            {product.category && (
              <Link
                href={`/productos?categoria=${product.category.slug}`}
                className="text-[10px] tracking-[4px] uppercase text-[var(--accent)] hover:text-[var(--text)] transition-colors block mb-4"
              >
                {product.category.name}
              </Link>
            )}

            {/* Nombre */}
            <h1
              className="text-[clamp(2rem,4vw,3rem)] font-light text-[var(--text)] leading-[1.1] mb-6"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {product.name}
            </h1>

            {/* Precio */}
            <div className="flex items-baseline gap-4 mb-8">
              <span
                className="text-[clamp(1.5rem,3vw,2rem)] font-light text-[var(--text)]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                ${Number(product.price).toLocaleString("es-AR")}
              </span>
              {product.comparePrice && Number(product.comparePrice) > Number(product.price) && (
                <span className="text-[14px] line-through text-[var(--text-light)]/50">
                  ${Number(product.comparePrice).toLocaleString("es-AR")}
                </span>
              )}
            </div>

            {/* Separador */}
            <div className="w-12 h-px bg-[var(--accent)]/30 mb-8" />

            {/* Descripción */}
            {product.description && (
              <p className="text-[14px] leading-[1.9] text-[var(--text-light)] font-light mb-10 max-w-md">
                {product.description}
              </p>
            )}

            {/* Add to cart */}
            <AddToCartButton product={product} />

            {/* Compartir */}
            <div className="mt-10 pt-8 border-t border-[var(--border)]">
              <ShareButtons url={productUrl} title={product.name} />
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}