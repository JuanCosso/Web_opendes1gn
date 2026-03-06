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
    { label: "Productos", value: totalProducts, href: "/admin/productos", bg: "bg-gray-50", text: "text-gray-900" },
    { label: "Pedidos", value: totalOrders, href: "/admin/pedidos", bg: "bg-gray-50", text: "text-gray-900" },
    { label: "Pendientes", value: pendingOrders, href: "/admin/pedidos", bg: "bg-yellow-50", text: "text-yellow-700" },
    { label: "Usuarios", value: totalUsers, href: "#", bg: "bg-gray-50", text: "text-gray-900" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-gray-400 mt-1">Resumen general de la tienda</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}
            className={`${stat.bg} rounded-xl p-5 border border-gray-100 hover:border-gray-200 transition-colors`}>
            <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">{stat.label}</p>
            <p className={`text-4xl font-bold ${stat.text}`}>{stat.value}</p>
          </Link>
        ))}
      </div>

      {/* Acciones rápidas */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="font-semibold text-sm mb-4">Acciones rápidas</h2>
        <div className="flex gap-3">
          <Link href="/admin/productos/nuevo"
            className="bg-black text-white text-sm px-5 py-2.5 rounded-lg hover:bg-gray-800 transition-colors">
            + Nuevo producto
          </Link>
          <Link href="/admin/categorias/nueva"
            className="border border-gray-200 text-sm px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-colors">
            + Nueva categoría
          </Link>
          <Link href="/admin/pedidos"
            className="border border-gray-200 text-sm px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-colors">
            Ver pedidos
          </Link>
        </div>
      </div>
    </div>
  );
}