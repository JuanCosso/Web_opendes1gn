import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function CategoriasAdminPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-[10px] tracking-[0.28em] uppercase text-[var(--text-light)] mb-2">Gestión</p>
          <h1 className="text-3xl sm:text-4xl font-light text-[var(--text)] italic" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Categorías
          </h1>
        </div>
        <Link
          href="/admin/categorias/nueva"
          className="px-5 py-2.5 bg-[var(--cta)] text-[var(--bg)] text-[11px] tracking-[0.15em] uppercase hover:bg-[var(--cta-hover)] transition-colors rounded-[var(--radius-sm)]"
        >
          + Nueva categoría
        </Link>
      </div>

      <div className="bg-[var(--white)] border border-[var(--border)] rounded-[var(--radius)] overflow-hidden">
        {categories.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-[var(--text-light)] text-[13px] mb-4">No hay categorías todavía.</p>
            <Link href="/admin/categorias/nueva" className="text-[11px] tracking-[3px] uppercase text-[var(--accent)] hover:text-[var(--text)] transition-colors duration-300">
              Crear la primera
            </Link>
          </div>
        ) : (
          <table className="w-full text-[12px]">
            <thead className="border-b border-[var(--border)]">
              <tr>
                <th className="text-left px-5 py-4 tracking-[0.14em] uppercase text-[var(--text-light)] font-normal">Nombre</th>
                <th className="text-left px-5 py-4 tracking-[0.14em] uppercase text-[var(--text-light)] font-normal">Slug</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--blush)]/30 transition-colors">
                  <td className="px-5 py-4 font-light text-[var(--text)]">{cat.name}</td>
                  <td className="px-5 py-4 text-[var(--text-light)]">{cat.slug}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
