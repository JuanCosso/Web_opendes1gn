"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/store/cart";
import Image from "next/image";
import Link from "next/link";

type ConfirmTarget = { productId: string; variantId?: string } | null;

export default function CarritoPage() {
  const { items, removeItem, total, count } = useCartStore();
  const [confirmTarget, setConfirmTarget] = useState<ConfirmTarget>(null);

  if (items.length === 0) {
    return (
      <main className="w-full min-h-screen bg-[var(--cream)]">
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="flex flex-col items-center text-center px-6">
            <div className="w-16 h-16 rounded-full border border-[var(--border)] flex items-center justify-center mb-8">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"
                className="text-[var(--text-light)]">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
            </div>
            <p className="text-[clamp(1.75rem,3vw,2.25rem)] font-light italic text-[var(--text)] mb-3"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Tu carrito está vacío
            </p>
            <p className="text-[14px] text-[var(--text-light)] font-light mb-10">
              Todavía no agregaste ningún producto.
            </p>
            <Link href="/productos" className="btn-primary">
              Explorar productos
            </Link>
          </div>
        </div>
      </main>
    );
  }

  function confirmRemove() {
    if (!confirmTarget) return;
    removeItem(confirmTarget.productId, confirmTarget.variantId);
    setConfirmTarget(null);
  }

  return (
    <main className="w-full min-h-screen bg-[var(--cream)]">

      {/* Modal confirmación eliminar */}
      {confirmTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(45,61,34,0.4)", backdropFilter: "blur(4px)" }}
          onClick={() => setConfirmTarget(null)}>
          <div className="bg-[var(--cream)] border border-[var(--border)] rounded-[var(--radius)] p-8 max-w-sm w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}>
            <p className="text-[20px] font-light italic text-[var(--text)] mb-2"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              ¿Quitar del carrito?
            </p>
            <p className="text-[13px] text-[var(--text-light)] font-light mb-8">
              Esta pieza se eliminará de tu selección.
            </p>
            <div className="flex gap-3">
              <button onClick={confirmRemove} className="btn-primary flex-1">Quitar</button>
              <button onClick={() => setConfirmTarget(null)}
                className="flex-1 py-4 text-[12px] tracking-[2px] uppercase border border-[var(--border)] text-[var(--text-light)] hover:border-[var(--text)] hover:text-[var(--text)] transition-all duration-200">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container-center py-14 md:py-20">
        <div className="mb-10">
          <span className="block text-[12px] tracking-[3px] uppercase text-[var(--accent)] mb-2">
            {count()} {count() === 1 ? "pieza" : "piezas"}
          </span>
          <h1 className="text-[clamp(2rem,4vw,3rem)] font-light italic text-[var(--text)]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Tu carrito
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 lg:gap-16 items-start">

          {/* Lista de items */}
          <div className="space-y-4">
            {items.map((item) => (
              <div key={`${item.productId}-${item.variantId}`}
                className="flex gap-5 md:gap-6 bg-[var(--white)] border border-[var(--border)] p-5 md:p-6 rounded-[var(--radius)]">

                {/* Imagen */}
                <div className="w-20 h-28 md:w-24 md:h-32 bg-[var(--blush)] overflow-hidden flex-shrink-0 rounded-[var(--radius-sm)] relative">
                  {item.image
                    ? <Image src={item.image} alt={item.name} fill className="object-cover" />
                    : <div className="w-full h-full" />}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                  <div>
                    <Link href={`/productos/${item.slug}`}
                      className="text-[14px] text-[var(--text)] hover:text-[var(--accent)] transition-colors line-clamp-2 leading-snug mb-1">
                      {item.name}
                    </Link>
                    {(item.size || item.color) && (
                      <p className="text-[11px] tracking-[1.5px] uppercase text-[var(--text-light)] mt-1">
                        {[item.size, item.color].filter(Boolean).join(" · ")}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => setConfirmTarget({ productId: item.productId, variantId: item.variantId })}
                    className="self-start text-[10px] tracking-[2px] uppercase text-[var(--text-light)] hover:text-red-400 transition-colors mt-3">
                    Quitar
                  </button>
                </div>

                {/* Precio */}
                <div className="flex-shrink-0 flex items-center">
                  <span className="text-[15px] font-light text-[var(--text)]"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    ${item.price.toLocaleString("es-AR")}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Resumen */}
          <div className="lg:sticky lg:top-10">
            <div className="bg-[var(--white)] border border-[var(--border)] rounded-[var(--radius)] p-6 md:p-8">
              <h2 className="text-[22px] font-light italic text-[var(--text)] mb-6"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Resumen
              </h2>
              <div className="space-y-3 text-[13px] text-[var(--text-light)] mb-6">
                {items.map((item) => (
                  <div key={`${item.productId}-${item.variantId}`} className="flex justify-between">
                    <span className="truncate pr-4">{item.name}</span>
                    <span className="text-[var(--text)] flex-shrink-0">${item.price.toLocaleString("es-AR")}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-2">
                  <span className="uppercase tracking-[2px]">Envío</span>
                  <span className="italic">A coordinar</span>
                </div>
              </div>
              <div className="border-t border-[var(--border)] pt-5 flex justify-between items-baseline mb-7">
                <span className="text-[12px] tracking-[2px] uppercase text-[var(--text)]">Total</span>
                <span className="text-[28px] font-light text-[var(--text)]"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  ${total().toLocaleString("es-AR")}
                </span>
              </div>
              <Link href="/checkout" className="btn-primary block w-full text-center py-4">
                Finalizar compra
              </Link>
              <Link href="/productos"
                className="block text-center text-[11px] tracking-[2px] uppercase text-[var(--text-light)] hover:text-[var(--text)] mt-5 transition-colors">
                Seguir comprando
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}