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
      <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden rounded-lg mb-3">
        {image?.url ? (
          <Image
            src={image.url}
            alt={image.alt || product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
            Sin imagen
          </div>
        )}
        {hasDiscount && (
          <span className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded">
            OFERTA
          </span>
        )}
      </div>

      <div>
        <p className="text-xs text-gray-400 mb-1">{product.category?.name}</p>
        <h3 className="text-sm font-medium text-gray-900 group-hover:underline">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm font-semibold">
            ${Number(product.price).toLocaleString("es-AR")}
          </span>
          {hasDiscount && (
            <span className="text-xs text-gray-400 line-through">
              ${Number(product.comparePrice).toLocaleString("es-AR")}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}