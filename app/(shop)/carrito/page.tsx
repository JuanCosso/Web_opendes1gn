"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/store/cart";
import Image from "next/image";
import Link from "next/link";

type ConfirmTarget = { productId: string; variantId?: string } | null;

export default function CarritoPage() {
  const { items, removeItem, updateQuantity, total, count } = useCartStore();
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

  function handleDecrease(productId: string, variantId: string | undefined, qty: number) {
    if (qty <= 1) {
      setConfirmTarget({ productId, variantId });
    } else {
      updateQuantity(productId, variantId, qty - 1);
    }
  }

  function confirmRemove() {
    if (!confirmTarget) return;
    removeItem(confirmTarget.productId, confirmTarget.variantId);
    setConfirmTarget(null);
  }

  return (
    <main className="w-full min-h-screen bg-[var(--cream)]">

      {/* Modal confirmación */}
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
            <p className="text-[13px] text-[var(--text-light)] font-light mb-7">
              Este producto se eliminará de tu carrito.
            </p>
            <div className="flex gap-3">
              <button onClick={confirmRemove}
                className="flex-1 py-3 bg-[var(--text)] text-[var(--cream)] text-[11px] tracking-[2px] uppercase hover:bg-[var(--accent)] transition-colors">
                Quitar
              </button>
              <button onClick={() => setConfirmTarget(null)}
                className="flex-1 py-3 border border-[var(--border)] text-[var(--text-light)] text-[11px] tracking-[2px] uppercase hover:border-[var(--text)] hover:text-[var(--text)] transition-all">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container-center py-14 md:py-24">
        <h1 className="text-[clamp(1.75rem,3vw,2.25rem)] font-light text-[var(--text)] italic mb-2"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Tu carrito
        </h1>
        <p className="text-[13px] text-[var(--text-light)] mb-12">
          {count()} {count() === 1 ? "pieza" : "piezas"}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">

          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={`${item.productId}-${item.variantId ?? ""}`}
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

                  {/* Controles cantidad */}
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center border border-[var(--border)] rounded-[var(--radius-sm)] overflow-hidden">
                      <button
                        onClick={() => handleDecrease(item.productId, item.variantId, item.quantity)}
                        className="w-8 h-8 flex items-center justify-center text-[var(--text-light)] hover:bg-[var(--blush)] hover:text-[var(--text)] transition-colors text-lg leading-none">
                        −
                      </button>
                      <span className="w-8 text-center text-[13px] text-[var(--text)] border-x border-[var(--border)]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-[var(--text-light)] hover:bg-[var(--blush)] hover:text-[var(--text)] transition-colors text-lg leading-none">
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => setConfirmTarget({ productId: item.productId, variantId: item.variantId })}
                      className="text-[10px] tracking-[2px] uppercase text-[var(--text-light)] hover:text-red-400 transition-colors ml-1">
                      Quitar
                    </button>
                  </div>
                </div>

                {/* Precio */}
                <div className="flex-shrink-0 text-right flex flex-col justify-between py-0.5">
                  <span className="text-[15px] font-light text-[var(--text)]"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    ${(item.price * item.quantity).toLocaleString("es-AR")}
                  </span>
                  {item.quantity > 1 && (
                    <span className="text-[11px] text-[var(--text-light)]">
                      c/u ${item.price.toLocaleString("es-AR")}
                    </span>
                  )}
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
                <div className="flex justify-between">
                  <span className="uppercase tracking-[2px]">Subtotal</span>
                  <span className="text-[var(--text)]">${total().toLocaleString("es-AR")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="uppercase tracking-[2px]">Envío</span>
                  <span className="italic">Se calcula al pagar</span>
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