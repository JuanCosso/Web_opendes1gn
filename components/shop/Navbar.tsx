"use client";

import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/lib/store/cart";

export function Navbar() {
  const count = useCartStore((state) => state.count());

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

        <Link href="/">
          <Image src="/logo.png" alt="Logo" width={120} height={40} className="object-contain" />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/productos" className="text-sm text-gray-600 hover:text-black transition-colors">Todo</Link>
          <Link href="/productos?categoria=novedades" className="text-sm text-gray-600 hover:text-black transition-colors">Novedades</Link>
          <Link href="/productos?categoria=ofertas" className="text-sm text-gray-600 hover:text-black transition-colors">Ofertas</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/login" className="hidden md:block text-sm text-gray-600 hover:text-black transition-colors">
            Ingresar
          </Link>
          <Link href="/carrito" className="relative flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
        </div>

      </div>
    </header>
  );
}