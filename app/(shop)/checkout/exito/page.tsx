"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCartStore } from "@/lib/store/cart";
import { useSearchParams } from "next/navigation";
import { WHATSAPP_NUMBER } from "@/lib/contact";

export default function ExitoPage() {
  const clearCart = useCartStore((s) => s.clearCart);
  const searchParams = useSearchParams();
  const status      = searchParams.get("collection_status");
  const externalRef = searchParams.get("external_reference"); // = orderId
  const isPending   = status === "pending" || status === "in_process";

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  // Mensaje pre-armado para WhatsApp con el número de pedido si está disponible
  const waMessage = externalRef
    ? `Hola! Acabo de realizar el pedido #${externalRef.slice(-8).toUpperCase()} y quería coordinar el envío.`
    : `Hola! Acabo de realizar un pedido y quería coordinar el envío.`;

  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMessage)}`;

  return (
    <main className="w-full min-h-screen bg-[var(--cream)]">
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="flex flex-col items-center text-center px-6 max-w-md">

          {/* Ícono */}
          <div className={`w-16 h-16 rounded-full border flex items-center justify-center mb-8 ${
            isPending
              ? "bg-[var(--butter)] border-[var(--border)]"
              : "bg-[var(--blush)] border-[var(--border)]"
          }`}>
            {isPending ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                className="text-[var(--accent)]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                className="text-[var(--accent)]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
              </svg>
            )}
          </div>

          {/* Título */}
          <h1
            className="text-[clamp(2rem,4vw,2.75rem)] font-light italic text-[var(--text)] mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {isPending ? "Pago en proceso" : "¡Gracias por tu compra!"}
          </h1>

          {/* Descripción */}
          <p className="text-[14px] text-[var(--text-light)] font-light mb-3 leading-relaxed">
            {isPending
              ? "Tu pago está siendo procesado. Te avisaremos cuando se confirme."
              : "Tu pedido fue confirmado. El siguiente paso es coordinar el envío por WhatsApp."}
          </p>

          {/* Número de pedido */}
          {externalRef && !isPending && (
            <p className="text-[11px] tracking-[2px] uppercase text-[var(--text-light)]/60 mb-10">
              Pedido #{externalRef.slice(-8).toUpperCase()}
            </p>
          )}

          {/* CTA WhatsApp — solo si el pago está confirmado */}
          {!isPending && (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary flex items-center gap-3 mb-4 w-full justify-center"
            >
              {/* Ícono WhatsApp */}
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 flex-shrink-0">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Coordinar envío por WhatsApp
            </a>
          )}

          <Link
            href="/productos"
            className={isPending ? "btn-primary" : "btn-ghost text-[12px] tracking-[2px] uppercase"}
          >
            Seguir comprando
          </Link>

        </div>
      </div>
    </main>
  );
}