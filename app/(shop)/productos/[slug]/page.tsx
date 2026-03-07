import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/shop/AddToCartButton";

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

  const mainImage = product.images[0];

  return (
    <main className="w-full min-h-screen bg-[var(--cream)]">
      <div className="container-center py-12 md:py-20">
        <nav className="flex items-center gap-2 text-[11px] tracking-[3px] uppercase text-[var(--text-light)] mb-12">
          <Link href="/" className="hover:text-[var(--text)] transition-colors duration-300">
            Inicio
          </Link>
          <span>·</span>
          <Link href="/productos" className="hover:text-[var(--text)] transition-colors duration-300">
            Productos
          </Link>
          <span>·</span>
          <span className="text-[var(--text)] truncate max-w-[140px] md:max-w-none">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start">
          <div className="space-y-3">
            <div className="relative aspect-[3/4] bg-[var(--blush)] overflow-hidden rounded-[var(--radius)] border border-[var(--border)]">
              {mainImage ? (
                <Image
                  src={mainImage.url}
                  alt={mainImage.alt || product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span
                    className="text-7xl md:text-8xl text-[var(--rose)]/40 italic font-light select-none"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    O
                  </span>
                </div>
              )}
            </div>

            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(1).map((img: { id: string; url: string; alt: string }) => (
                  <div
                    key={img.id}
                    className="relative aspect-square bg-[var(--butter)] overflow-hidden rounded-[var(--radius-sm)] cursor-pointer group border border-[var(--border)] hover:border-[var(--accent)] transition-colors duration-300"
                  >
                    <Image
                      src={img.url}
                      alt={img.alt || ""}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-6 md:sticky md:top-24">
            <div>
              <span className="block text-[11px] tracking-[3px] uppercase text-[var(--accent)] mb-2">
                {product.category?.name}
              </span>
              <h1
                className="text-[clamp(2rem,4vw,3rem)] font-light text-[var(--text)] leading-[1.1] mb-4"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {product.name}
              </h1>
              <p
                className="text-[32px] md:text-[40px] font-light text-[var(--accent)]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                ${Number(product.price).toLocaleString("es-AR")}
                {product.comparePrice && (
                  <span className="text-[18px] text-[var(--text-light)] line-through font-normal ml-2">
                    ${Number(product.comparePrice).toLocaleString("es-AR")}
                  </span>
                )}
              </p>
            </div>

            {product.description && (
              <p className="text-[15px] leading-[1.8] text-[var(--text-light)] border-t border-[var(--border)] pt-6">
                {product.description}
              </p>
            )}

            <AddToCartButton product={product} />

            <div className="border-t border-[var(--border)] pt-6 space-y-2 text-[12px] text-[var(--text-light)] tracking-[1px]">
              <p>✦ Envíos a todo el país</p>
              <p>✦ Cambios y devoluciones</p>
              <p>✦ Pago seguro</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
