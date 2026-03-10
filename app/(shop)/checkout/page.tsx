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

      if (!res.ok) {
        setError(data.error || "Error al procesar");
        setLoading(false);
        return;
      }

      window.location.href = data.url; // redirige a Stripe
    } catch {
      setError("Error de conexión");
      setLoading(false);
    }
  }

  const input = "w-full bg-transparent border border-[var(--border)] px-4 py-3 text-[13px] text-[var(--text)] placeholder:text-[var(--text-light)] focus:outline-none focus:border-[var(--accent)] transition-colors rounded-[var(--radius-sm)]";
  const label = "block text-[10px] tracking-[2px] uppercase text-[var(--text-light)] mb-2";

  return (
    <main className="w-full min-h-screen bg-[var(--cream)]">
      <div className="container-center py-14 md:py-24">

        <div className="mb-10">
          <Link href="/carrito" className="text-[11px] tracking-[3px] uppercase text-[var(--text-light)] hover:text-[var(--text)] transition-colors mb-6 block">
            ← Volver al carrito
          </Link>
          <h1 className="text-[clamp(1.75rem,3vw,2.5rem)] font-light italic text-[var(--text)]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Finalizar compra
          </h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">

            {/* ── FORMULARIO ── */}
            <div className="lg:col-span-2 space-y-8">

              {/* Datos personales */}
              <section className="bg-[var(--white)] border border-[var(--border)] rounded-[var(--radius)] p-6 md:p-8 space-y-5">
                <h2 className="text-[11px] tracking-[3px] uppercase text-[var(--accent)]">Tus datos</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className={label}>Nombre y apellido *</label>
                    <input name="guestName" required value={form.guestName} onChange={handleChange} placeholder="María García" className={input} />
                  </div>
                  <div>
                    <label className={label}>Email *</label>
                    <input name="guestEmail" type="email" required value={form.guestEmail} onChange={handleChange} placeholder="maria@email.com" className={input} />
                  </div>
                </div>
                <div>
                  <label className={label}>Teléfono</label>
                  <input name="guestPhone" value={form.guestPhone} onChange={handleChange} placeholder="+54 9 11 1234-5678" className={input} />
                </div>
              </section>

              {/* Dirección */}
              <section className="bg-[var(--white)] border border-[var(--border)] rounded-[var(--radius)] p-6 md:p-8 space-y-5">
                <h2 className="text-[11px] tracking-[3px] uppercase text-[var(--accent)]">Dirección de envío</h2>
                <div>
                  <label className={label}>Calle y número *</label>
                  <input name="guestStreet" required value={form.guestStreet} onChange={handleChange} placeholder="Av. Corrientes 1234" className={input} />
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className={label}>Ciudad *</label>
                    <input name="guestCity" required value={form.guestCity} onChange={handleChange} placeholder="Buenos Aires" className={input} />
                  </div>
                  <div>
                    <label className={label}>Provincia *</label>
                    <input name="guestState" required value={form.guestState} onChange={handleChange} placeholder="CABA" className={input} />
                  </div>
                </div>
                <div>
                  <label className={label}>Código postal *</label>
                  <input name="guestZip" required value={form.guestZip} onChange={handleChange} placeholder="1043" className={input} />
                </div>
              </section>

              {/* Notas */}
              <section className="bg-[var(--white)] border border-[var(--border)] rounded-[var(--radius)] p-6 md:p-8 space-y-5">
                <h2 className="text-[11px] tracking-[3px] uppercase text-[var(--accent)]">Notas adicionales</h2>
                <textarea name="notes" value={form.notes} onChange={handleChange}
                  rows={3} placeholder="Instrucciones especiales, horarios, etc."
                  className={`${input} resize-none`} />
              </section>

            </div>

            {/* ── RESUMEN ── */}
            <div className="lg:sticky lg:top-24 h-fit space-y-4">
              <div className="bg-[var(--blush)]/50 border border-[var(--border)] rounded-[var(--radius)] p-6 md:p-8">
                <h2 className="text-[11px] tracking-[3px] uppercase text-[var(--accent)] mb-6">Resumen</h2>

                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={`${item.productId}-${item.variantId}`} className="flex gap-3 items-center">
                      <div className="w-12 h-16 bg-[var(--blush)] rounded-[var(--radius-sm)] overflow-hidden flex-shrink-0 relative">
                        {item.image
                          ? <Image src={item.image} alt={item.name} fill className="object-cover" />
                          : <div className="w-full h-full" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] text-[var(--text)] truncate">{item.name}</p>
                        {(item.size || item.color) && (
                          <p className="text-[11px] text-[var(--text-light)]">
                            {[item.size, item.color].filter(Boolean).join(" · ")}
                          </p>
                        )}
                        <p className="text-[11px] text-[var(--text-light)]">x{item.quantity}</p>
                      </div>
                      <span className="text-[12px] text-[var(--text)] flex-shrink-0">
                        ${(item.price * item.quantity).toLocaleString("es-AR")}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-[var(--border)] pt-5 space-y-2 mb-6">
                  <div className="flex justify-between text-[12px] text-[var(--text-light)]">
                    <span className="uppercase tracking-[2px]">Subtotal</span>
                    <span>${total().toLocaleString("es-AR")}</span>
                  </div>
                  <div className="flex justify-between text-[12px] text-[var(--text-light)]">
                    <span className="uppercase tracking-[2px]">Envío</span>
                    <span className="italic">A coordinar</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-8">
                  <span className="text-[12px] tracking-[2px] uppercase text-[var(--text)]">Total</span>
                  <span className="text-[26px] font-light text-[var(--text)]"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    ${total().toLocaleString("es-AR")}
                  </span>
                </div>

                {error && (
                  <p className="text-[12px] text-red-500 mb-4">{error}</p>
                )}

                <button type="submit" disabled={loading}
                  className="btn-primary w-full py-4 disabled:opacity-50 disabled:cursor-not-allowed">
                  {loading ? "Redirigiendo..." : "Pagar →"}
                </button>

                <p className="text-[10px] text-[var(--text-light)] text-center mt-4 tracking-[1px]">
                  Pago seguro procesado por Stripe
                </p>
              </div>
            </div>

          </div>
        </form>
      </div>
    </main>
  );
}