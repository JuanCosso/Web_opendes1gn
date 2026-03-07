import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function ProductosAdminPage() {
  const products = await prisma.product.findMany({
    include: { images: true, category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
        <div>
          <span className="block text-[12px] tracking-[3px] uppercase text-[var(--accent)] mb-2">Gestión</span>
          <h1 className="text-[clamp(2rem,4vw,2.5rem)] font-light text-[var(--text)] italic" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Productos
          </h1>
        </div>
        <Link href="/admin/productos/nuevo" className="btn-primary">+ Nuevo</Link>
      </div>

      <div className="bg-[var(--white)] border border-[var(--border)] rounded-[var(--radius)] overflow-hidden">
        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl font-light italic text-[var(--text-light)] mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Todavía no hay productos
            </p>
            <Link href="/admin/productos/nuevo" className="text-[12px] tracking-[3px] uppercase text-[var(--accent)] hover:text-[var(--text)] transition-colors duration-300">
              Crear el primero
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[12px] min-w-[600px]">
              <thead className="border-b border-[var(--border)]">
                <tr>
                  {["Producto", "Categoría", "Precio", "Stock", "Estado", ""].map((h) => (
                    <th key={h} className="text-left px-5 py-4 tracking-[2px] uppercase text-[var(--text-light)] font-normal">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--blush)]/30 transition-colors duration-300">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[var(--blush)] overflow-hidden flex-shrink-0 rounded-[var(--radius-sm)]">
                          {product.images[0] && (
                            <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" />
                          )}
                        </div>
                        <span className="text-[var(--text)] font-light">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-[var(--text-light)]">{product.category?.name || "—"}</td>
                    <td className="px-5 py-4 text-[var(--text)]">${Number(product.price).toLocaleString("es-AR")}</td>
                    <td className="px-5 py-4 text-[var(--text)]">{product.stock}</td>
                    <td className="px-5 py-4">
                      <span className={`text-[9px] tracking-[2px] uppercase px-2.5 py-1 rounded-[var(--radius-sm)] ${
                        product.published
                          ? "bg-[var(--blush)] text-[var(--text-light)]"
                          : "bg-[var(--white)] text-[var(--text-light)] border border-[var(--border)]"
                      }`}>
                        {product.published ? "Publicado" : "Borrador"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <Link href={`/admin/productos/${product.id}/editar`} className="text-[11px] tracking-[2px] uppercase text-[var(--accent)] hover:text-[var(--text)] transition-colors duration-300">
                        Editar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
