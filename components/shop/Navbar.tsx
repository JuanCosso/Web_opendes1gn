"use client";

import Link from "next/link";
import { useCartStore } from "@/lib/store/cart";
import { useState } from "react";

export function Navbar() {
  const count = useCartStore((state) => state.count());
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 left-0 right-0 z-50 w-full bg-[var(--cream)]/90 backdrop-blur-[12px] border-b border-[var(--border)]">
      <div className="container-center flex justify-between items-center min-h-[56px] sm:min-h-[64px] md:h-[72px] py-3 md:py-0">
      <Link
        href="/"
        className="flex items-center gap-2.5 min-h-[44px]"
        aria-label="Inicio — opendes1gn"
      >
        <img
          src="/img/logo.png"
          alt=""
          aria-hidden
          style={{
            height: "36px",
            width: "auto",
            objectFit: "contain",
            /* Convierte el blanco del logo al color --text-light (#5a4a2a) */
            filter: "brightness(0) saturate(100%) invert(29%) sepia(18%) saturate(800%) hue-rotate(5deg) brightness(85%) contrast(90%)",
          }}
        />
        <span
          className="text-[var(--text-light)] hover:text-[var(--text)] transition-colors duration-300"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "12px",
            letterSpacing: "4px",
            textTransform: "uppercase",
            fontWeight: 400,
          }}
        >
          OPENDES1GN
        </span>
      </Link>

        <div className="flex items-center gap-3 sm:gap-5 md:gap-6">
          <Link
            href="/productos"
            className="hidden md:inline-flex items-center min-h-[44px] text-[12px] tracking-[2px] uppercase text-[var(--text-light)] hover:text-[var(--text)] transition-colors duration-300"
          >
            Productos
          </Link>
          <Link
            href="/login"
            className="hidden md:flex items-center min-h-[44px] text-[12px] tracking-[2px] uppercase text-[var(--text-light)] hover:text-[var(--text)] transition-colors duration-300"
          >
            Ingresar
          </Link>

          <Link
            href="/carrito"
            className="flex items-center gap-1.5 sm:gap-2 min-h-[44px] px-2 sm:px-0 text-[12px] tracking-[2px] uppercase text-[var(--text-light)] hover:text-[var(--accent)] transition-colors duration-300"
            aria-label={`Carrito${count > 0 ? `, ${count} productos` : ""}`}
          >
            <span aria-hidden className="text-base sm:text-inherit">🛍</span>
            <span className="hidden sm:inline">Carrito</span>
            {count > 0 && (
              <span
                className="bg-[var(--accent)] text-[var(--white)] rounded-full min-w-[18px] h-[18px] px-1 text-[10px] font-medium flex items-center justify-center flex-shrink-0"
              >
                {count}
              </span>
            )}
          </Link>

          <button
            type="button"
            className="md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center -m-2 text-[var(--text-light)] hover:text-[var(--text)] transition-colors duration-300"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuOpen}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <div
        className={`md:hidden border-t border-[var(--border)] bg-[var(--cream)] overflow-hidden transition-all duration-300 ease-[var(--ease)] ${
          menuOpen ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0"
        }`}
        aria-hidden={!menuOpen}
      >
        <nav className="px-4 sm:px-6 py-4 flex flex-col gap-0">
          <Link
            href="/productos"
            onClick={() => setMenuOpen(false)}
            className="min-h-[48px] flex items-center py-3 text-[12px] tracking-[2px] uppercase text-[var(--text-light)] hover:text-[var(--text)] transition-colors duration-300"
          >
            Productos
          </Link>
          <Link
            href="/login"
            onClick={() => setMenuOpen(false)}
            className="min-h-[48px] flex items-center py-3 text-[12px] tracking-[2px] uppercase text-[var(--text-light)] hover:text-[var(--text)] transition-colors duration-300"
          >
            Ingresar
          </Link>
        </nav>
      </div>
    </header>
  );
}
