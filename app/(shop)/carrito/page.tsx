"use client";

import { useCartStore } from "@/lib/store/cart";
import Image from "next/image";
import Link from "next/link";

export default function CarritoPage() {
  const { items, removeItem, updateQuantity, total, count } = useCartStore();

  if (items.length === 0) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-400 text-lg mb-4">Tu carrito está vacío</p>
        <Link href="/productos" className="bg-black text-white px-6 py-2 rounded text-sm hover:bg-gray-800 transition-colors">
          Ver productos
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-8">Tu carrito ({count()} productos)</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Items */}
        <div className="md:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={`${item.productId}-${item.variantId}`} className="flex gap-4 bg-white border border-gray-100 rounded-xl p-4">
              <div className="w-20 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                {item.image ? (
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-100" />
                )}
              </div>

              <div className="flex-1">
                <Link href={`/productos/${item.slug}`} className="font-medium text-sm hover:underline">
                  {item.name}
                </Link>
                <p className="text-xs text-gray-400 mt-0.5">
                  {[item.size, item.color].filter(Boolean).join(" · ")}
                </p>
                <p className="font-semibold text-sm mt-1">
                  ${Number(item.price).toLocaleString("es-AR")}
                </p>

                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center border rounded overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                      className="px-2 py-1 text-sm hover:bg-gray-50 transition-colors"
                    >−</button>
                    <span className="px-3 py-1 text-sm border-x">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                      className="px-2 py-1 text-sm hover:bg-gray-50 transition-colors"
                    >+</button>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId, item.variantId)}
                    className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Resumen */}
        <div className="bg-white border border-gray-100 rounded-xl p-6 h-fit sticky top-20">
          <h2 className="font-semibold mb-4">Resumen</h2>
          <div className="space-y-2 text-sm text-gray-600 mb-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${total().toLocaleString("es-AR")}</span>
            </div>
            <div className="flex justify-between">
              <span>Envío</span>
              <span className="text-gray-400">Se calcula al pagar</span>
            </div>
          </div>
          <div className="border-t pt-4 flex justify-between font-bold text-sm mb-6">
            <span>Total</span>
            <span>${total().toLocaleString("es-AR")}</span>
          </div>
          <Link
            href="/checkout"
            className="w-full bg-black text-white py-3 rounded text-sm font-medium hover:bg-gray-800 transition-colors text-center block"
          >
            Finalizar compra →
          </Link>
          <Link href="/productos" className="block text-center text-xs text-gray-400 hover:text-black mt-3 transition-colors">
            Seguir comprando
          </Link>
        </div>

      </div>
    </main>
  );
}