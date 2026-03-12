"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  _count: { products: number };
};

export default function CategoriasAdminPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function loadCategories() {
    try {
      const res = await fetch("/api/categorias");
      const data = await res.json();
      setCategories(data);
    } catch {
      setError("No se pudieron cargar las categorías.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadCategories(); }, []);

  async function handleDelete(cat: Category) {
    if (!confirm(`¿Eliminar la categoría "${cat.name}"? Esta acción no se puede deshacer.`)) return;
    setDeletingId(cat.id);
    setError("");

    const res = await fetch(`/api/categorias/${cat.id}`, { method: "DELETE" });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "No se pudo eliminar.");
      setDeletingId(null);
      return;
    }

    setCategories((prev) => prev.filter((c) => c.id !== cat.id));
    setDeletingId(null);
  }

  return (
    <div>
      <div className="flex items-end justify-between mb-10">
        <div>
          <span className="block text-[12px] tracking-[3px] uppercase text-[var(--accent)] mb-2">Gestión</span>
          <h1
            className="text-[clamp(2rem,4vw,2.5rem)] font-light text-[var(--text)] italic"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Categorías
          </h1>
        </div>
        <Link
          href="/admin/categorias/nueva"
          className="btn-primary"
        >
          + Nueva categoría
        </Link>
      </div>

      {error && (
        <div className="bg-[var(--blush)] border border-[var(--border)] px-5 py-4 mb-6 rounded-[var(--radius-sm)]">
          <p className="text-[13px] text-[var(--text-light)]">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-32">
          <p className="text-[13px] text-[var(--text-light)] tracking-[2px] uppercase">Cargando...</p>
        </div>
      ) : categories.length === 0 ? (
        <div className="bg-[var(--white)] border border-[var(--border)] rounded-[var(--radius)] p-16 text-center">
          <p className="text-[var(--text-light)] text-[14px] mb-4">No hay categorías todavía.</p>
          <Link
            href="/admin/categorias/nueva"
            className="text-[11px] tracking-[3px] uppercase text-[var(--accent)] hover:text-[var(--text)] transition-colors"
          >
            Crear la primera →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-[var(--white)] border border-[var(--border)] rounded-[var(--radius)] overflow-hidden hover:border-[var(--accent)]/40 transition-colors group"
            >
              {/* Imagen */}
              <div className="relative h-36 bg-[var(--blush)] overflow-hidden">
                {cat.image ? (
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span
                      className="text-5xl font-light text-[var(--text-light)]/20 italic select-none"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                      {cat.name.charAt(0)}
                    </span>
                  </div>
                )}
                {/* Badge cantidad */}
                <div className="absolute top-3 right-3 bg-[var(--text)]/80 text-[var(--cream)] text-[10px] tracking-[2px] uppercase px-2.5 py-1 rounded-[var(--radius-sm)]">
                  {cat._count.products} {cat._count.products === 1 ? "producto" : "productos"}
                </div>
              </div>

              {/* Info */}
              <div className="p-5">
                <h3
                  className="text-[16px] font-light text-[var(--text)] mb-1"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {cat.name}
                </h3>
                <p className="text-[11px] text-[var(--text-light)] tracking-[1px] mb-1">/{cat.slug}</p>
                {cat.description && (
                  <p className="text-[12px] text-[var(--text-light)] font-light mt-2 line-clamp-2">
                    {cat.description}
                  </p>
                )}

                {/* Acciones */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--border)]">
                  <Link
                    href={`/admin/categorias/${cat.id}/editar`}
                    className="text-[11px] tracking-[2px] uppercase text-[var(--accent)] hover:text-[var(--text)] transition-colors"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => handleDelete(cat)}
                    disabled={deletingId === cat.id}
                    className="text-[11px] tracking-[2px] uppercase text-[var(--text-light)] hover:text-red-400 transition-colors disabled:opacity-40"
                  >
                    {deletingId === cat.id ? "Eliminando..." : "Eliminar"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}