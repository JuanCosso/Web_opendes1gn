"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCartStore } from "@/lib/store/cart";
import { useSearchParams } from "next/navigation";

export default function ExitoPage() {
  const clearCart = useCartStore((s) => s.clearCart);
  const searchParams = useSearchParams();
  const status = searchParams.get("collection_status");
  const isPending = status === "pending" || status === "in_process";

  useEffect(() => {
    // Vaciar el carrito una sola vez al llegar a esta página
    clearCart();
  }, [clearCart]);

  return (
    <main className="w-full min-h-screen bg-[var(--cream)]">
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="flex flex-col items-center text-center px-6 max-w-md">

          <div className={`w-16 h-16 rounded-full border flex items-center justify-center mb-8 ${
            isPending ? "bg-[var(--butter)] border-[var(--border)]" : "bg-[var(--blush)] border-[var(--border)]"
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

          <h1
            className="text-[clamp(2rem,4vw,2.75rem)] font-light italic text-[var(--text)] mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {isPending ? "Pago en proceso" : "¡Gracias por tu compra!"}
          </h1>

          <p className="text-[14px] text-[var(--text-light)] font-light mb-10 leading-relaxed">
            {isPending
              ? "Tu pago está siendo procesado. Te avisaremos cuando se confirme."
              : "Tu pedido fue confirmado. Te contactaremos para coordinar el envío."}
          </p>

          <Link href="/productos" className="btn-primary">
            Seguir comprando
          </Link>
        </div>
      </div>
    </main>
  );
}