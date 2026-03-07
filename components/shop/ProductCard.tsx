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
      <div className="bg-[var(--white)] overflow-hidden rounded-[var(--radius)] card-hover border border-[var(--border)]">
        <div className="relative aspect-[3/4] bg-[var(--blush)] overflow-hidden">
          {image?.url ? (
            <Image
              src={image.url}
              alt={image.alt || product.name}
              fill
              className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
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
          {hasDiscount && (
            <span className="absolute top-4 left-4 bg-[var(--cream)] text-[var(--accent)] text-[9px] tracking-[2px] uppercase font-medium px-2.5 py-1">
              Oferta
            </span>
          )}
        </div>

        <div className="p-5 md:p-6">
          <p className="text-[10px] tracking-[2px] uppercase text-[var(--accent)] mb-1">
            {product.category?.name}
          </p>
          <h3
            className="text-[22px] font-normal text-[var(--text)] mb-2 leading-tight"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {product.name}
          </h3>
          <p className="text-[12px] text-[var(--text-light)] leading-relaxed mb-4">
            ${Number(product.price).toLocaleString("es-AR")} {hasDiscount && (
              <span className="line-through opacity-80">${Number(product.comparePrice).toLocaleString("es-AR")}</span>
            )}
          </p>
          <span className="text-[12px] text-[var(--text-light)] uppercase tracking-[1px] group-hover:text-[var(--accent)] transition-colors duration-300">
            Ver pieza →
          </span>
        </div>
      </div>
    </Link>
  );
}
