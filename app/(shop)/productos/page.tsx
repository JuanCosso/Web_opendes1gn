import { notFound } from "next/navigation";
import Image from "next/image";
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
    <main className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

        {/* Imágenes */}
        <div className="space-y-3">
          <div className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
            {mainImage ? (
              <Image src={mainImage.url} alt={mainImage.alt || product.name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">Sin imagen</div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(1).map((img: { id: string; url: string; alt: string }) => (
                <div key={img.id} className="relative aspect-square bg-gray-100 rounded overflow-hidden">
                  <Image src={img.url} alt={img.alt || ""} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-4">
          <p className="text-sm text-gray-400">{product.category?.name}</p>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-semibold">
              ${Number(product.price).toLocaleString("es-AR")}
            </span>
            {product.comparePrice && (
              <span className="text-lg text-gray-400 line-through">
                ${Number(product.comparePrice).toLocaleString("es-AR")}
              </span>
            )}
          </div>
          {product.description && (
            <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
          )}

          <AddToCartButton product={product} />
        </div>

      </div>
    </main>
  );
}