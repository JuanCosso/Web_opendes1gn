"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

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
  const [hovered, setHovered] = useState(false);
  const image = product.images?.[0];
  const secondImage = product.images?.[1];
  const hasDiscount =
    product.comparePrice && Number(product.comparePrice) > Number(product.price);

  if (!product.slug) return null;

  return (
    <Link
      href={`/productos/${product.slug}`}
      className="group block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="bg-[var(--white)] overflow-hidden rounded-[var(--radius)] border border-[var(--border)] transition-all duration-500 group-hover:border-[var(--accent)]/40 group-hover:shadow-[0_16px_48px_rgba(45,61,34,0.10)]">

        {/* Imagen */}
        <div className="relative aspect-[3/4] bg-[var(--blush)] overflow-hidden">

          {/* Imagen principal */}
          {image?.url ? (
            <Image
              src={image.url}
              alt={image.alt || product.name}
              fill
              className={`object-cover transition-all duration-700 ${
                hovered && secondImage ? "opacity-0 scale-[1.03]" : "opacity-100 scale-100"
              }`}
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

          {/* Segunda imagen en hover */}
          {secondImage?.url && (
            <Image
              src={secondImage.url}
              alt={secondImage.alt || product.name}
              fill
              className={`object-cover transition-all duration-700 absolute inset-0 ${
                hovered ? "opacity-100 scale-100" : "opacity-0 scale-[1.03]"
              }`}
            />
          )}

          {/* Badge oferta — solo si tiene descuento */}
          {hasDiscount && (
            <span className="absolute top-3 left-3 bg-[var(--accent)] text-[var(--cream)] text-[8px] tracking-[2px] uppercase px-2.5 py-1 rounded-sm">
              Oferta
            </span>
          )}

          {/* Overlay CTA */}
          <div className="absolute inset-x-0 bottom-0 flex justify-center pb-5 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
            <span className="bg-[var(--cream)]/95 backdrop-blur-sm text-[var(--text)] text-[10px] tracking-[3px] uppercase px-5 py-2.5 shadow-md">
              Ver pieza →
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
            className="text-[18px] md:text-[20px] font-normal text-[var(--text)] leading-tight mb-2.5 group-hover:text-[var(--accent)] transition-colors duration-300"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {product.name}
          </h3>
          <div className="flex items-center gap-3">
            <p className="text-[13px] font-light text-[var(--text)]">
              ${Number(product.price).toLocaleString("es-AR")}
            </p>
            {hasDiscount && (
              <p className="text-[11px] line-through text-[var(--text-light)]/60">
                ${Number(product.comparePrice).toLocaleString("es-AR")}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}