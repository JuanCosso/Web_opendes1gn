"use client";

import { useCartStore } from "@/lib/store/cart";
import Image from "next/image";
import Link from "next/link";

export default function CarritoPage() {
  const { items, removeItem, updateQuantity, total, count } = useCartStore();

  if (items.length === 0) {
    return (
      <main className="w-full min-h-screen bg-[var(--cream)] flex flex-col items-center justify-center">
        <div className="container-center py-24 md:py-32 text-center">
          <p
            className="text-[clamp(1.75rem,3vw,2.25rem)] font-light italic text-[var(--text)] mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Tu carrito está vacío
          </p>
          <p className="text-[15px] text-[var(--text-light)] mb-10 max-w-sm mx-auto">
            Todavía no agregaste ningún producto.
          </p>
          <Link href="/productos" className="btn-primary">
            Explorar productos
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full min-h-screen bg-[var(--cream)]">
      <div className="container-center py-14 md:py-24">
        <h1
          className="text-[clamp(1.75rem,3vw,2.25rem)] font-light text-[var(--text)] italic mb-4"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Tu carrito
        </h1>
        <p className="text-[14px] text-[var(--text-light)] mb-12">
          {count()} {count() === 1 ? "pieza" : "piezas"}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.variantId}`}
                className="flex gap-5 md:gap-6 bg-[var(--white)] border border-[var(--border)] p-5 md:p-6 rounded-[var(--radius)] card-hover"
              >
                <div className="w-20 h-28 md:w-24 md:h-32 bg-[var(--blush)] overflow-hidden flex-shrink-0 rounded-[var(--radius-sm)] relative">
                  {item.image ? (
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-2xl text-[var(--rose)]/50 italic" style={{ fontFamily: "'Cormorant Garamond', serif" }}>O</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <Link
                    href={`/productos/${item.slug}`}
                    className="text-[18px] font-normal text-[var(--text)] hover:text-[var(--accent)] transition-colors duration-300 leading-tight block mb-1"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    {item.name}
                  </Link>
                  <p className="text-[12px] text-[var(--text-light)] mb-2">
                    {[item.size, item.color].filter(Boolean).join(" · ") || "—"}
                  </p>
                  <p className="text-[16px] font-medium text-[var(--accent)] mb-4">
                    ${Number(item.price).toLocaleString("es-AR")}
                  </p>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-[var(--border)] rounded-[var(--radius-sm)] overflow-hidden">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                        className="w-9 h-9 flex items-center justify-center text-[var(--text-light)] hover:bg-[var(--blush)] hover:text-[var(--text)] transition-colors duration-300"
                      >
                        −
                      </button>
                      <span className="w-9 h-9 flex items-center justify-center text-[12px] text-[var(--text)] border-x border-[var(--border)]">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                        className="w-9 h-9 flex items-center justify-center text-[var(--text-light)] hover:bg-[var(--blush)] hover:text-[var(--text)] transition-colors duration-300"
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId, item.variantId)}
                      className="text-[11px] tracking-[2px] uppercase text-[var(--text-light)] hover:text-[var(--text)] transition-colors duration-300"
                    >
                      Quitar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:sticky lg:top-24 h-fit bg-[var(--blush)]/50 border border-[var(--border)] rounded-[var(--radius)] p-6 md:p-8">
            <h2
              className="text-[22px] font-normal text-[var(--text)] mb-6"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
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
            <div className="border-t border-[var(--border)] pt-5 flex justify-between items-center mb-6">
              <span className="text-[12px] tracking-[2px] uppercase text-[var(--text)]">Total</span>
              <span
                className="text-[28px] font-light text-[var(--text)]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                ${total().toLocaleString("es-AR")}
              </span>
            </div>
            <Link href="/checkout" className="btn-primary block w-full text-center py-4">
              Finalizar compra
            </Link>
            <Link
              href="/productos"
              className="block text-center text-[12px] tracking-[2px] uppercase text-[var(--text-light)] hover:text-[var(--text)] mt-5 transition-colors duration-300"
            >
              Seguir comprando
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
