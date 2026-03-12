"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/store/cart";

type Variant = { id: string; size: string; color: string; stock: number };
type Product = {
  id: string; name: string; slug: string; price: number;
  images: { url: string }[];
  variants: Variant[];
};

const COLOR_MAP: Record<string, string> = {
  negro: "#1a1a1a", blanco: "#f5f5f0", beige: "#d4b896", crema: "#f0e8d8",
  arena: "#c8b08a", marron: "#7a5230", marrón: "#7a5230", cafe: "#7a5230",
  café: "#7a5230", verde: "#5a7a50", oliva: "#6b7a40", azul: "#4a6080",
  rojo: "#a03030", rosa: "#d08090", gris: "#909090", terracota: "#c46040",
  mostaza: "#c8a030", lavanda: "#9080b0", bordo: "#7a2030", burdeos: "#7a2030",
  coral: "#d07060", naranja: "#d07030",
};

function getColorValue(name: string): string | null {
  const n = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  for (const [key, val] of Object.entries(COLOR_MAP)) {
    if (n.includes(key.normalize("NFD").replace(/[\u0300-\u036f]/g, ""))) return val;
  }
  return null;
}

// ── Modal guía de talles ──────────────────────────────────────────────────────
function SizeGuideModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(45,61,34,0.45)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="bg-[var(--cream)] border border-[var(--border)] rounded-[var(--radius)] p-8 max-w-md w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-[11px] tracking-[4px] uppercase text-[var(--accent)] mb-1">Guía de talles</h2>
            <p className="text-[22px] font-light italic text-[var(--text)]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              ¿Cómo me mido?
            </p>
          </div>
          <button onClick={onClose} aria-label="Cerrar"
            className="text-[var(--text-light)] hover:text-[var(--text)] transition-colors mt-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Instrucciones */}
        <div className="space-y-4 mb-6">
          {[
            { icon: "📏", label: "Busto / Pecho", desc: "Medí alrededor de la parte más ancha del pecho, con los brazos relajados." },
            { icon: "📏", label: "Cintura",       desc: "Medí la parte más estrecha del torso, generalmente sobre el ombligo." },
            { icon: "📏", label: "Cadera",        desc: "Medí alrededor de la parte más ancha de las caderas." },
            { icon: "📏", label: "Largo total",   desc: "Desde el hombro hasta el punto más bajo de la prenda." },
          ].map((item) => (
            <div key={item.label} className="flex gap-3">
              <span className="text-lg leading-none mt-0.5">{item.icon}</span>
              <div>
                <p className="text-[11px] tracking-[2px] uppercase text-[var(--text)] mb-0.5">{item.label}</p>
                <p className="text-[13px] font-light text-[var(--text-light)] leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabla referencia */}
        <div className="border border-[var(--border)] rounded-[var(--radius-sm)] overflow-hidden mb-6">
          <div className="grid grid-cols-4 bg-[var(--blush)] text-[9px] tracking-[2px] uppercase text-[var(--text-light)] px-3 py-2">
            <span>Talle</span><span>Busto</span><span>Cintura</span><span>Cadera</span>
          </div>
          {[
            ["XS", "80–84", "60–64", "86–90"],
            ["S",  "84–88", "64–68", "90–94"],
            ["M",  "88–92", "68–72", "94–98"],
            ["L",  "92–96", "72–76", "98–102"],
            ["XL", "96–102","76–82", "102–108"],
          ].map(([t, b, c, ca]) => (
            <div key={t} className="grid grid-cols-4 px-3 py-2 text-[12px] text-[var(--text)] border-t border-[var(--border)] font-light hover:bg-[var(--blush)]/50 transition-colors">
              <span className="font-normal">{t}</span>
              <span>{b}</span><span>{c}</span><span>{ca}</span>
            </div>
          ))}
        </div>

        <p className="text-[11px] text-[var(--text-light)] font-light leading-relaxed">
          Todas las medidas son en centímetros y corresponden a medidas del cuerpo, no de la prenda.
          Ante dudas, podés consultarnos por WhatsApp.
        </p>

        <button onClick={onClose}
          className="mt-6 w-full py-3 text-[11px] tracking-[3px] uppercase border border-[var(--border)] text-[var(--text-light)] hover:border-[var(--text)] hover:text-[var(--text)] transition-all duration-200 rounded-[var(--radius-sm)]">
          Entendido
        </button>
      </div>
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────
export function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    product.variants.length > 0 ? product.variants[0] : null
  );
  const [added,         setAdded]         = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  const sizes  = [...new Set(product.variants.map((v) => v.size).filter(Boolean))];
  const colors = [...new Set(product.variants.map((v) => v.color).filter(Boolean))];
  const outOfStock = (selectedVariant?.stock ?? 0) === 0 && product.variants.length > 0;

  function handleAdd() {
    addItem({
      productId: product.id, variantId: selectedVariant?.id,
      name: product.name, price: Number(product.price),
      image: product.images[0]?.url,
      size: selectedVariant?.size, color: selectedVariant?.color,
      quantity: 1, slug: product.slug,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <>
      {showSizeGuide && <SizeGuideModal onClose={() => setShowSizeGuide(false)} />}

      <div className="flex flex-col gap-5">

        {/* ── TALLE + COLOR en columnas paralelas si ambos existen ── */}
        {(sizes.length > 0 || colors.length > 0) && (
          <div className={`grid gap-6 ${sizes.length > 0 && colors.length > 0 ? "grid-cols-2" : "grid-cols-1"}`}>

            {/* Talles */}
            {sizes.length > 0 && (
              <div>
                <p className="text-[10px] tracking-[3px] uppercase text-[var(--text-light)] mb-3">Talle</p>
                <div className="flex flex-wrap gap-1.5">
                  {sizes.map((size) => {
                    const variant  = product.variants.find((v) => v.size === size);
                    const active   = selectedVariant?.size === size;
                    const noStock  = (variant?.stock ?? 0) === 0;
                    return (
                      <button key={size} type="button" disabled={noStock}
                        onClick={() => variant && setSelectedVariant(variant)}
                        className={`px-3.5 py-2 text-[11px] tracking-[1.5px] uppercase transition-all duration-200 rounded-[var(--radius-sm)] ${
                          active    ? "bg-[var(--text)] text-[var(--cream)]"
                          : noStock ? "border border-[var(--border)] text-[var(--text-light)]/35 line-through cursor-not-allowed"
                          :           "border border-[var(--border)] text-[var(--text-light)] hover:border-[var(--text)] hover:text-[var(--text)]"
                        }`}>
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Colores */}
            {colors.length > 0 && (
              <div>
                <p className="text-[10px] tracking-[3px] uppercase text-[var(--text-light)] mb-3">Color</p>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => {
                    const variant  = product.variants.find((v) => v.color === color);
                    const active   = selectedVariant?.color === color;
                    const cssColor = getColorValue(color);
                    const noStock  = (variant?.stock ?? 0) === 0;

                    if (cssColor) {
                      return (
                        <button key={color} type="button" disabled={noStock}
                          onClick={() => variant && setSelectedVariant(variant)}
                          title={color} aria-label={`Color ${color}`}
                          className={`relative w-8 h-8 rounded-full flex-shrink-0 transition-all duration-200 ${
                            noStock ? "opacity-30 cursor-not-allowed" : "cursor-pointer hover:scale-110"
                          } ${active ? "ring-2 ring-offset-2 ring-[var(--accent)]" : "ring-1 ring-[var(--border)]"}`}
                          style={{ backgroundColor: cssColor }}>
                          {noStock && (
                            <span className="absolute inset-0 flex items-center justify-center">
                              <span className="w-full h-px bg-[var(--text-light)]/60 rotate-45 block" />
                            </span>
                          )}
                        </button>
                      );
                    }
                    return (
                      <button key={color} type="button" disabled={noStock}
                        onClick={() => variant && setSelectedVariant(variant)}
                        className={`px-3 py-1.5 text-[10px] tracking-[1.5px] uppercase transition-all duration-200 rounded-[var(--radius-sm)] ${
                          active    ? "bg-[var(--text)] text-[var(--cream)]"
                          : noStock ? "border border-[var(--border)] text-[var(--text-light)]/35 cursor-not-allowed"
                          :           "border border-[var(--border)] text-[var(--text-light)] hover:border-[var(--text)] hover:text-[var(--text)]"
                        }`}>
                        {color}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── GUÍA DE TALLES — reemplaza el bloque de stock ── */}
        {sizes.length > 0 && (
          <p className="text-[12px] text-[var(--text-light)] font-light">
            ¿No sabés cómo medir tu talle?{" "}
            <button
              type="button"
              onClick={() => setShowSizeGuide(true)}
              className="underline underline-offset-2 text-[var(--accent)] hover:text-[var(--text)] transition-colors"
            >
              Revisá acá
            </button>
          </p>
        )}

        {/* ── BOTÓN AGREGAR ── */}
        <button type="button" onClick={handleAdd} disabled={outOfStock}
          className={`w-full py-4 text-[12px] tracking-[3px] uppercase transition-all duration-300 ${
            added      ? "bg-[var(--accent2)] text-[var(--white)] cursor-default"
            : outOfStock ? "bg-[var(--blush)] text-[var(--text-light)]/60 cursor-not-allowed"
            :              "btn-primary"
          }`}>
          {added ? "✓ Agregado al carrito" : outOfStock ? "Sin stock" : "Agregar al carrito"}
        </button>
      </div>
    </>
  );
}