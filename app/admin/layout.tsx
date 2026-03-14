"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const navItems = [
  { label: "Dashboard",  href: "/admin/dashboard"  },
  { label: "Productos",  href: "/admin/productos"   },
  { label: "Categorías", href: "/admin/categorias"  },
  { label: "Pedidos",    href: "/admin/pedidos"     },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Cerrar el drawer al navegar
  useEffect(() => { setOpen(false); }, [pathname]);

  // Bloquear scroll del body cuando el drawer está abierto en móvil
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const NavLinks = () => (
    <>
      {navItems.map(({ label, href }) => {
        const active = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`block px-4 py-3 text-[12px] tracking-[2px] uppercase rounded-[var(--radius-sm)] transition-all duration-200 ${
              active
                ? "bg-[var(--text)] text-[var(--cream)]"
                : "text-[var(--text-light)] hover:text-[var(--text)] hover:bg-[var(--cream)]/60"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </>
  );

  return (
    <div className="flex min-h-screen w-full bg-[var(--cream)]">

      {/* ── SIDEBAR DESKTOP (≥ lg) ─────────────────────────── */}
      <aside className="hidden lg:flex w-56 flex-shrink-0 bg-[var(--blush)] border-r border-[var(--border)] sticky top-0 h-screen flex-col">
        <div className="px-6 py-6 border-b border-[var(--border)]">
          <p className="text-[11px] tracking-[3px] uppercase text-[var(--accent)]">Panel admin</p>
        </div>
        <nav className="p-4 flex-1 flex flex-col gap-1 overflow-y-auto">
          <NavLinks />
        </nav>
        <div className="px-6 py-5 border-t border-[var(--border)] flex-shrink-0">
          <Link href="/" className="text-[12px] tracking-[2px] uppercase text-[var(--text-light)] hover:text-[var(--text)] transition-colors duration-300">
            ← Tienda
          </Link>
        </div>
      </aside>

      {/* ── OVERLAY (móvil, cuando drawer abierto) ─────────── */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── DRAWER (móvil) ─────────────────────────────────── */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[var(--blush)] border-r border-[var(--border)] z-50 flex flex-col transition-transform duration-300 ease-in-out lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--border)]">
          <p className="text-[11px] tracking-[3px] uppercase text-[var(--accent)]">Panel admin</p>
          <button
            onClick={() => setOpen(false)}
            aria-label="Cerrar menú"
            className="w-8 h-8 flex items-center justify-center text-[var(--text-light)] hover:text-[var(--text)] transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <nav className="p-4 flex-1 flex flex-col gap-1 overflow-y-auto">
          <NavLinks />
        </nav>
        <div className="px-6 py-5 border-t border-[var(--border)]">
          <Link href="/" className="text-[12px] tracking-[2px] uppercase text-[var(--text-light)] hover:text-[var(--text)] transition-colors duration-300">
            ← Tienda
          </Link>
        </div>
      </aside>

      {/* ── CONTENIDO ──────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Barra superior solo en móvil/tablet */}
        <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-[var(--blush)] border-b border-[var(--border)]">
          <button
            onClick={() => setOpen(true)}
            aria-label="Abrir menú"
            className="w-9 h-9 flex items-center justify-center text-[var(--text)] hover:text-[var(--accent)] transition-colors"
          >
            {/* Hamburguesa */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 12h18M3 6h18M3 18h18"/>
            </svg>
          </button>

          <p className="text-[11px] tracking-[3px] uppercase text-[var(--accent)]">Admin</p>

          <Link href="/" className="text-[11px] tracking-[2px] uppercase text-[var(--text-light)] hover:text-[var(--text)] transition-colors">
            Tienda
          </Link>
        </header>

        {/* Contenido de cada página */}
        <main className="flex-1">
          <div className="px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-14 max-w-5xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}