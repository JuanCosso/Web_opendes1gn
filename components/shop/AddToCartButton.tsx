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

  const chipClass = (active: boolean) =>
    `px-4 py-2.5 text-[11px] tracking-[2px] uppercase rounded-[var(--radius-sm)] transition-all duration-300 hover:-translate-y-0.5 ${
      active
        ? "bg-[var(--text)] text-[var(--cream)] hover:bg-[var(--accent)]"
        : "bg-transparent border border-[var(--border)] text-[var(--text-light)] hover:border-[var(--accent)] hover:text-[var(--text)]"
    }`;

  return (
    <div className="flex flex-col gap-6">
      {sizes.length > 0 && (
        <div>
          <p className="text-[11px] tracking-[3px] uppercase text-[var(--text-light)] mb-3">Talle</p>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => {
              const variant = product.variants.find((v) => v.size === size);
              const active = selectedVariant?.size === size;
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => variant && setSelectedVariant(variant)}
                  className={chipClass(active)}
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
          <p className="text-[11px] tracking-[3px] uppercase text-[var(--text-light)] mb-3">Color</p>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => {
              const variant = product.variants.find((v) => v.color === color);
              const active = selectedVariant?.color === color;
              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => variant && setSelectedVariant(variant)}
                  className={chipClass(active)}
                >
                  {color}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={handleAdd}
        className={`w-full py-4 text-[12px] tracking-[3px] uppercase transition-all duration-300 ${
          added
            ? "bg-[var(--accent)] text-[var(--white)] cursor-default"
            : "btn-primary"
        }`}
      >
        {added ? "✓ Agregado al carrito" : "Agregar al carrito"}
      </button>
    </div>
  );
}
