import Image from "next/image";
import Link from "next/link";

type ProductImage = { url: string; alt: string | null };
type Category = { id: string; name: string; slug: string } | null;

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number | string;
  comparePrice?: number | string | null;
  images: ProductImage[];
  category?: Category;
};

export function ProductCard({ product }: { product: Product }) {
  const image = product.images?.[0];
  const hasDiscount = product.comparePrice && Number(product.comparePrice) > Number(product.price);

  if (!product.slug) return null;

  return (
    <Link href={`/productos/${product.slug}`} className="group block">
      <div className="bg-[var(--white)] overflow-hidden rounded-[var(--radius)] card-hover border border-[var(--border)] shadow-sm">

        {/* Imagen */}
        <div className="relative aspect-[3/4] bg-[var(--blush)] overflow-hidden">
          {image?.url ? (
            <Image
              src={image.url}
              alt={image.alt || product.name}
              fill
              className="object-cover group-hover:scale-[1.04] transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span
                className="text-6xl text-[var(--rose)]/50 italic font-light"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                O
              </span>
            </div>
          )}

          {/* Badge edición limitada */}
          <span className="absolute top-3 left-3 bg-[var(--cream)]/90 backdrop-blur-sm text-[var(--accent)] text-[8px] tracking-[2px] uppercase font-medium px-2.5 py-1 rounded-sm">
            {hasDiscount ? "Oferta" : "Edición limitada"}
          </span>

          {/* Overlay hover con CTA */}
          <div className="absolute inset-0 bg-[var(--text)]/0 group-hover:bg-[var(--text)]/30 transition-colors duration-500 flex items-end justify-center pb-5 opacity-0 group-hover:opacity-100">
            <span className="bg-[var(--cream)] text-[var(--text)] text-[10px] tracking-[3px] uppercase px-5 py-2.5 translate-y-2 group-hover:translate-y-0 transition-transform duration-400">
              Ver pieza
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="p-4 md:p-5 border-t border-[var(--border)]">
          {product.category?.name && (
            <p className="text-[9px] tracking-[2.5px] uppercase text-[var(--accent)] mb-1.5">
              {product.category.name}
            </p>
          )}
          <h3
            className="text-[19px] font-normal text-[var(--text)] leading-tight mb-2"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {product.name}
          </h3>
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-light text-[var(--text-light)]">
              ${Number(product.price).toLocaleString("es-AR")}
              {hasDiscount && (
                <span className="ml-2 line-through text-[11px] opacity-60">
                  ${Number(product.comparePrice).toLocaleString("es-AR")}
                </span>
              )}
            </p>
            <span className="text-[10px] tracking-[1.5px] uppercase text-[var(--accent2)] group-hover:text-[var(--accent)] transition-colors duration-300">
              →
            </span>
          </div>
        </div>

      </div>
    </Link>
  );
}