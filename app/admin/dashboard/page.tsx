import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function DashboardPage() {
  const [totalProducts, totalOrders, totalUsers, pendingOrders] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
  ]);

  const stats = [
    { label: "Productos", value: totalProducts, href: "/admin/productos" },
    { label: "Pedidos", value: totalOrders, href: "/admin/pedidos" },
    { label: "Pendientes", value: pendingOrders, href: "/admin/pedidos", accent: true },
    { label: "Usuarios", value: totalUsers, href: "#" },
  ];

  return (
    <div>
      <div className="mb-12">
        <span className="block text-[12px] tracking-[3px] uppercase text-[var(--accent)] mb-2">Panel de control</span>
        <h1 className="text-[clamp(2rem,4vw,2.5rem)] font-light text-[var(--text)] italic" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Dashboard
        </h1>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className={`p-6 border border-[var(--border)] rounded-[var(--radius)] transition-all duration-300 hover:-translate-y-1 card-hover ${
              stat.accent ? "bg-[var(--blush)]" : "bg-[var(--white)]"
            }`}
          >
            <p className="text-[11px] tracking-[2px] uppercase text-[var(--text-light)] mb-3">{stat.label}</p>
            <p className="text-4xl md:text-5xl font-light text-[var(--text)]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {stat.value}
            </p>
          </Link>
        ))}
      </div>

      <div className="bg-[var(--white)] border border-[var(--border)] p-6 md:p-8 rounded-[var(--radius)]">
        <h2 className="text-[12px] tracking-[3px] uppercase text-[var(--accent)] mb-6">Acciones rápidas</h2>
        <div className="flex gap-3 flex-wrap">
          <Link href="/admin/productos/nuevo" className="btn-primary">+ Nuevo producto</Link>
          <Link href="/admin/categorias/nueva" className="btn-secondary">+ Nueva categoría</Link>
          <Link href="/admin/pedidos" className="btn-secondary">Ver pedidos</Link>
        </div>
      </div>
    </div>
  );
}
