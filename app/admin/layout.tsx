"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: "⊞" },
  { label: "Productos", href: "/admin/productos", icon: "◈" },
  { label: "Categorías", href: "/admin/categorias", icon: "◇" },
  { label: "Pedidos", href: "/admin/pedidos", icon: "◎" },
  { label: "Envíos", href: "/admin/envios", icon: "◉" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f9fafb" }}>

      {/* Sidebar */}
      <aside style={{
        width: "192px",
        flexShrink: 0,
        backgroundColor: "white",
        borderRight: "1px solid #f3f4f6",
        display: "flex",
        flexDirection: "column",
      }}>
        <div style={{ padding: "20px", borderBottom: "1px solid #f3f4f6" }}>
          <p style={{ fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#9ca3af" }}>Panel</p>
          <p style={{ fontWeight: 600, fontSize: "14px", marginTop: "2px" }}>Opendes1gn</p>
        </div>

        <nav style={{ padding: "12px", flex: 1, display: "flex", flexDirection: "column", gap: "2px" }}>
          {navItems.map(({ label, href, icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link key={href} href={href} style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "8px 12px",
                borderRadius: "8px",
                fontSize: "14px",
                textDecoration: "none",
                backgroundColor: active ? "#000" : "transparent",
                color: active ? "#fff" : "#6b7280",
                transition: "all 0.15s",
              }}>
                <span style={{ color: active ? "white" : "#d1d5db" }}>{icon}</span>
                {label}
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: "16px", borderTop: "1px solid #f3f4f6" }}>
          <Link href="/" style={{ fontSize: "12px", color: "#9ca3af", textDecoration: "none" }}>
            ← Volver a la tienda
          </Link>
        </div>
      </aside>

      {/* Contenido */}
      <main style={{ flex: 1, padding: "32px", overflowY: "auto" }}>
        {children}
      </main>

    </div>
  );
}