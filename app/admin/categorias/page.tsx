import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function CategoriasAdminPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Categorías</h1>
          <p className="text-sm text-gray-400 mt-1">{categories.length} categorías</p>
        </div>
        <Link href="/admin/categorias/nueva" className="bg-black text-white text-sm px-4 py-2 rounded hover:bg-gray-800 transition-colors">
          + Nueva categoría
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {categories.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-sm">No hay categorías todavía.</p>
            <Link href="/admin/categorias/nueva" className="text-black underline text-sm mt-2 inline-block">
              Crear la primera
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-3 text-xs uppercase tracking-widest text-gray-400">Nombre</th>
                <th className="text-left px-6 py-3 text-xs uppercase tracking-widest text-gray-400">Slug</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{cat.name}</td>
                  <td className="px-6 py-4 text-gray-400">{cat.slug}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
