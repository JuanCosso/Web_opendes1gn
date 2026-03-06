"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/store/cart";

type Variant = { id: string; size: string; color: string; stock: number };
type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: { url: string }[];
  variants: Variant[];
};

export function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    product.variants.length > 0 ? product.variants[0] : null
  );
  const [added, setAdded] = useState(false);

  const sizes = [...new Set(product.variants.map((v) => v.size).filter(Boolean))];
  const colors = [...new Set(product.variants.map((v) => v.color).filter(Boolean))];

  function handleAdd() {
    addItem({
      productId: product.id,
      variantId: selectedVariant?.id,
      name: product.name,
      price: Number(product.price),
      image: product.images[0]?.url,
      size: selectedVariant?.size,
      color: selectedVariant?.color,
      quantity: 1,
      slug: product.slug,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="flex flex-col gap-4 mt-2">

      {sizes.length > 0 && (
        <div>
          <p className="text-sm font-medium mb-2">Talle</p>
          <div className="flex gap-2 flex-wrap">
            {sizes.map((size) => {
              const variant = product.variants.find((v) => v.size === size);
              const active = selectedVariant?.size === size;
              return (
                <button
                  key={size}
                  onClick={() => variant && setSelectedVariant(variant)}
                  className={`border px-3 py-1.5 text-sm rounded transition-colors
                    ${active ? "bg-black text-white border-black" : "border-gray-200 hover:border-black"}`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {colors.length > 0 && (
        <div>
          <p className="text-sm font-medium mb-2">Color</p>
          <div className="flex gap-2 flex-wrap">
            {colors.map((color) => {
              const variant = product.variants.find((v) => v.color === color);
              const active = selectedVariant?.color === color;
              return (
                <button
                  key={color}
                  onClick={() => variant && setSelectedVariant(variant)}
                  className={`border px-3 py-1.5 text-sm rounded transition-colors
                    ${active ? "bg-black text-white border-black" : "border-gray-200 hover:border-black"}`}
                >
                  {color}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <button
        onClick={handleAdd}
        className={`w-full py-3 rounded text-sm font-medium transition-colors
          ${added ? "bg-green-600 text-white" : "bg-black text-white hover:bg-gray-800"}`}
      >
        {added ? "✓ Agregado al carrito" : "Agregar al carrito"}
      </button>

    </div>
  );
}