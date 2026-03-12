"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/store/cart";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function CheckoutPage() {
  const { items, total } = useCartStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    guestName: "", guestEmail: "", guestPhone: "",
    guestStreet: "", guestCity: "", guestState: "", guestZip: "",
    notes: "",
  });

  if (items.length === 0) {
    router.replace("/carrito");
    return null;
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, ...form }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Error al procesar"); setLoading(false); return; }
      window.location.href = data.url;
    } catch {
      setError("Error de conexión. Intentá de nuevo.");
      setLoading(false);
    }
  }

  // Estilos de inputs: línea inferior, sin borde completo (más elegante)
  const field = "w-full bg-transparent border-b border-[var(--border)] py-3 text-[14px] text-[var(--text)] placeholder-transparent focus:outline-none focus:border-[var(--accent)] transition-colors duration-300 font-light peer";
  const lbl   = "block text-[10px] tracking-[2.5px] uppercase text-[var(--text-light)] mb-1.5";

  return (
    <main className="w-full min-h-screen bg-[var(--cream)]">
      <div className="container-center py-14 md:py-20">

        {/* Header */}
        <div className="mb-10">
          <Link href="/carrito"
            className="inline-flex items-center gap-2 text-[10px] tracking-[3px] uppercase text-[var(--text-light)] hover:text-[var(--text)] transition-colors mb-7">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
            Volver al carrito
          </Link>
          <h1 className="text-[clamp(1.75rem,3vw,2.5rem)] font-light italic text-[var(--text)]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Finalizar compra
          </h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 lg:gap-16 items-start">

            {/* ── FORMULARIO ── */}
            <div className="space-y-8">

              {/* Datos personales */}
              <section className="bg-[var(--white)] border border-[var(--border)] rounded-[var(--radius)] p-6 md:p-8">
                <h2 className="text-[10px] tracking-[4px] uppercase text-[var(--accent)] mb-7">Tus datos</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                  <div>
                    <label className={lbl} htmlFor="guestName">Nombre y apellido *</label>
                    <input id="guestName" name="guestName" required
                      value={form.guestName} onChange={handleChange}
                      className={field} />
                  </div>
                  <div>
                    <label className={lbl} htmlFor="guestEmail">Email *</label>
                    <input id="guestEmail" name="guestEmail" type="email" required
                      value={form.guestEmail} onChange={handleChange}
                      className={field} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={lbl} htmlFor="guestPhone">Teléfono</label>
                    <input id="guestPhone" name="guestPhone"
                      value={form.guestPhone} onChange={handleChange}
                      className={field} />
                  </div>
                </div>
              </section>

              {/* Dirección */}
              <section className="bg-[var(--white)] border border-[var(--border)] rounded-[var(--radius)] p-6 md:p-8">
                <h2 className="text-[10px] tracking-[4px] uppercase text-[var(--accent)] mb-7">Dirección de envío</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                  <div className="sm:col-span-2">
                    <label className={lbl} htmlFor="guestStreet">Calle y número *</label>
                    <input id="guestStreet" name="guestStreet" required
                      value={form.guestStreet} onChange={handleChange}
                      className={field} />
                  </div>
                  <div>
                    <label className={lbl} htmlFor="guestCity">Ciudad *</label>
                    <input id="guestCity" name="guestCity" required
                      value={form.guestCity} onChange={handleChange}
                      className={field} />
                  </div>
                  <div>
                    <label className={lbl} htmlFor="guestState">Provincia *</label>
                    <input id="guestState" name="guestState" required
                      value={form.guestState} onChange={handleChange}
                      className={field} />
                  </div>
                  <div>
                    <label className={lbl} htmlFor="guestZip">Código postal *</label>
                    <input id="guestZip" name="guestZip" required
                      value={form.guestZip} onChange={handleChange}
                      className={field} />
                  </div>
                </div>
              </section>

              {/* Notas */}
              <section className="bg-[var(--white)] border border-[var(--border)] rounded-[var(--radius)] p-6 md:p-8">
                <h2 className="text-[10px] tracking-[4px] uppercase text-[var(--accent)] mb-7">Notas adicionales</h2>
                <div>
                  <label className={lbl} htmlFor="notes">Instrucciones especiales, horarios, etc.</label>
                  <textarea id="notes" name="notes" rows={3}
                    value={form.notes} onChange={handleChange}
                    className={`${field} resize-none`} />
                </div>
              </section>
            </div>

            {/* ── RESUMEN ── */}
            <div className="lg:sticky lg:top-10">
              <div className="bg-[var(--white)] border border-[var(--border)] rounded-[var(--radius)] p-6 md:p-8">
                <h2 className="text-[10px] tracking-[4px] uppercase text-[var(--accent)] mb-6">Tu pedido</h2>

                {/* Items */}
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={`${item.productId}-${item.variantId}`}
                      className="flex items-center gap-3">
                      <div className="w-12 h-14 bg-[var(--blush)] rounded-[var(--radius-sm)] overflow-hidden relative flex-shrink-0">
                        {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] text-[var(--text)] truncate leading-snug">{item.name}</p>
                        {(item.size || item.color) && (
                          <p className="text-[10px] tracking-[1.5px] uppercase text-[var(--text-light)] mt-0.5">
                            {[item.size, item.color].filter(Boolean).join(" · ")}
                          </p>
                        )}
                        <p className="text-[11px] text-[var(--text-light)] mt-0.5">× {item.quantity}</p>
                      </div>
                      <span className="text-[13px] text-[var(--text)] flex-shrink-0">
                        ${(item.price * item.quantity).toLocaleString("es-AR")}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Totales */}
                <div className="border-t border-[var(--border)] pt-5 space-y-2 mb-5">
                  <div className="flex justify-between text-[12px] text-[var(--text-light)]">
                    <span className="uppercase tracking-[2px]">Subtotal</span>
                    <span>${total().toLocaleString("es-AR")}</span>
                  </div>
                  <div className="flex justify-between text-[12px] text-[var(--text-light)]">
                    <span className="uppercase tracking-[2px]">Envío</span>
                    <span className="italic">A coordinar</span>
                  </div>
                </div>

                <div className="flex justify-between items-baseline border-t border-[var(--border)] pt-5 mb-7">
                  <span className="text-[12px] tracking-[2px] uppercase text-[var(--text)]">Total</span>
                  <span className="text-[26px] font-light text-[var(--text)]"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    ${total().toLocaleString("es-AR")}
                  </span>
                </div>

                {error && (
                  <p className="text-[12px] text-red-500 mb-4 text-center">{error}</p>
                )}

                <button type="submit" disabled={loading}
                  className="btn-primary w-full py-4 disabled:opacity-50 disabled:cursor-not-allowed">
                  {loading ? "Redirigiendo…" : "Confirmar y pagar →"}
                </button>

                <p className="text-[10px] text-[var(--text-light)]/60 text-center mt-4 tracking-[1px]">
                  Pago seguro procesado por MercadoPago
                </p>
              </div>
            </div>

          </div>
        </form>
      </div>
    </main>
  );
}