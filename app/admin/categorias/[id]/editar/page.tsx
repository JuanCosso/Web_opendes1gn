"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ImageUploader, type ImageField } from "@/components/admin/ImageUploader";

const label = "block text-[11px] tracking-[2px] uppercase text-[var(--text-light)] mb-2";
const input =
  "w-full bg-transparent border-b border-[var(--border)] py-3 text-[14px] text-[var(--text)] placeholder-[var(--text-light)] focus:outline-none focus:border-[var(--accent)] transition-colors duration-300 font-light";

export default function EditarCategoriaPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [images, setImages] = useState<ImageField[]>([{ url: "", alt: "" }]);
  const [form, setForm] = useState({ name: "", description: "" });
  const [productCount, setProductCount] = useState(0);

  useEffect(() => {
    fetch(`/api/categorias/${id}`)
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((cat) => {
        setForm({ name: cat.name ?? "", description: cat.description ?? "" });
        setImages([{ url: cat.image ?? "", alt: cat.name ?? "" }]);
        setProductCount(cat._count?.products ?? 0);
        setFetching(false);
      })
      .catch(() => {
        setError("No se pudo cargar la categoría.");
        setFetching(false);
      });
  }, [id]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (images.some((i) => i.uploading)) {
      setError("Esperá a que termine de subirse la imagen.");
      return;
    }
    setLoading(true);
    setError("");

    const res = await fetch(`/api/categorias/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        description: form.description || null,
        image: images[0]?.url.trim() || null,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Error al guardar");
      setLoading(false);
      return;
    }

    router.push("/admin/categorias");
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm(`¿Eliminar esta categoría? Esta acción no se puede deshacer.`)) return;

    const res = await fetch(`/api/categorias/${id}`, { method: "DELETE" });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "No se pudo eliminar.");
      return;
    }

    router.push("/admin/categorias");
    router.refresh();
  }

  if (fetching)
    return (
      <div className="flex items-center justify-center py-32">
        <p className="text-[13px] text-[var(--text-light)] tracking-[2px] uppercase">Cargando...</p>
      </div>
    );

  if (error && !form.name)
    return (
      <div className="max-w-lg">
        <Link href="/admin/categorias" className="text-[12px] tracking-[2px] uppercase text-[var(--text-light)] hover:text-[var(--text)] transition-colors mb-6 block">
          ← Volver
        </Link>
        <div className="bg-[var(--blush)] border border-[var(--border)] px-5 py-6 rounded-[var(--radius)]">
          <p className="text-[13px] text-[var(--text-light)] mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="text-[11px] tracking-[2px] uppercase text-[var(--accent)] border-b border-[var(--accent)]">
            Reintentar
          </button>
        </div>
      </div>
    );

  return (
    <div className="max-w-lg">
      <div className="mb-10">
        <Link href="/admin/categorias" className="text-[12px] tracking-[2px] uppercase text-[var(--text-light)] hover:text-[var(--text)] transition-colors mb-6 block">
          ← Volver
        </Link>
        <span className="block text-[12px] tracking-[3px] uppercase text-[var(--accent)] mb-2">Editar categoría</span>
        <h1
          className="text-[clamp(2rem,4vw,2.5rem)] font-light text-[var(--text)] italic"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          {form.name || "Categoría"}
        </h1>
        {productCount > 0 && (
          <p className="text-[11px] text-[var(--text-light)] tracking-[1px] mt-2">
            {productCount} producto{productCount !== 1 ? "s" : ""} en esta categoría
          </p>
        )}
      </div>

      {error && (
        <div className="bg-[var(--blush)] border border-[var(--border)] px-5 py-4 mb-8 rounded-[var(--radius-sm)]">
          <p className="text-[13px] text-[var(--text-light)]">{error}</p>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-[var(--white)] border border-[var(--border)] p-6 md:p-8 space-y-6 rounded-[var(--radius)]"
      >
        <div>
          <label className={label}>Nombre *</label>
          <input
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            className={input}
          />
        </div>
        <div>
          <label className={label}>Descripción</label>
          <textarea
            name="description"
            rows={3}
            value={form.description}
            onChange={handleChange}
            placeholder="Descripción breve de la categoría..."
            className={`${input} resize-none`}
          />
        </div>
        <div>
          <label className={label}>Imagen de portada</label>
          <ImageUploader images={images} onChange={setImages} />
        </div>

        <div className="flex items-center justify-between pt-2">
          <button
            type="submit"
            disabled={loading || images.some((i) => i.uploading)}
            className="btn-primary disabled:opacity-50"
          >
            {loading ? "Guardando..." : "Guardar cambios"}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="text-[11px] tracking-[2px] uppercase text-red-400 hover:text-red-600 transition-colors"
          >
            Eliminar categoría
          </button>
        </div>
      </form>
    </div>
  );
}