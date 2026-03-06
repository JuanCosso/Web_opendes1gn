import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function ProductosAdminPage() {
  const products = await prisma.product.findMany({
    include: { images: { take: 1 }, category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Productos</h1>
          <p className="text-sm text-gray-400 mt-1">{products.length} productos</p>
        </div>
        <Link href="/admin/productos/nuevo" className="bg-black text-white text-sm px-4 py-2 rounded hover:bg-gray-800 transition-colors">
          + Nuevo producto
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {products.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-sm">No hay productos todavía.</p>
            <Link href="/admin/productos/nuevo" className="text-black underline text-sm mt-2 inline-block">
              Crear el primero
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-3 text-xs uppercase tracking-widest text-gray-400">Producto</th>
                <th className="text-left px-6 py-3 text-xs uppercase tracking-widest text-gray-400">Categoría</th>
                <th className="text-left px-6 py-3 text-xs uppercase tracking-widest text-gray-400">Precio</th>
                <th className="text-left px-6 py-3 text-xs uppercase tracking-widest text-gray-400">Stock</th>
                <th className="text-left px-6 py-3 text-xs uppercase tracking-widest text-gray-400">Estado</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                        {product.images[0] && (
                          <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <span className="font-medium">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{product.category?.name || "—"}</td>
                  <td className="px-6 py-4">${Number(product.price).toLocaleString("es-AR")}</td>
                  <td className="px-6 py-4">{product.stock}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${product.published ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                      {product.published ? "Publicado" : "Borrador"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/admin/productos/${product.id}/editar`} className="text-xs text-gray-400 hover:text-black underline">
                      Editar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
