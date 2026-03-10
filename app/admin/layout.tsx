"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard" },
  { label: "Productos", href: "/admin/productos" },
  { label: "Categorías", href: "/admin/categorias" },
  { label: "Pedidos", href: "/admin/pedidos" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen w-full bg-[var(--cream)]">
      <aside className="w-56 flex-shrink-0 bg-[var(--blush)] border-r border-[var(--border)] flex flex-col">
        <div className="px-6 py-6 border-b border-[var(--border)]">
          <p className="text-[11px] tracking-[3px] uppercase text-[var(--accent)]">Panel</p>
        </div>

        <nav className="p-4 flex-1 flex flex-col gap-1">
          {navItems.map(({ label, href }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`px-4 py-3 text-[12px] tracking-[2px] uppercase rounded-[var(--radius-sm)] transition-all duration-300 ${
                  active
                    ? "bg-[var(--text)] text-[var(--cream)] hover:bg-[var(--accent)]"
                    : "text-[var(--text-light)] hover:text-[var(--text)] hover:bg-[var(--cream)]/60"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="px-6 py-5 border-t border-[var(--border)]">
          <Link
            href="/"
            className="text-[12px] tracking-[2px] uppercase text-[var(--text-light)] hover:text-[var(--text)] transition-colors duration-300"
          >
            ← Tienda
          </Link>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto w-full">
        <div className="container-center py-10 md:py-14">
          {children}
        </div>
      </main>
    </div>
  );
}
