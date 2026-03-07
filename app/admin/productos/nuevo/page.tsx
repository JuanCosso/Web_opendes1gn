"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Category = { id: string; name: string };
type ImageField = { url: string; alt: string };
type VariantField = { size: string; color: string; stock: number; price: string; sku: string };

const label = "block text-[11px] tracking-[2px] uppercase text-[var(--text-light)] mb-2";
const input = "w-full bg-transparent border-b border-[var(--border)] py-3 text-[14px] text-[var(--text)] placeholder-[var(--text-light)] focus:outline-none focus:border-[var(--accent)] transition-colors duration-300 font-light";
const card = "bg-[var(--white)] border border-[var(--border)] p-6 md:p-8 space-y-6 rounded-[var(--radius)]";

export default function NuevoProductoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<ImageField[]>([{ url: "", alt: "" }]);
  const [variants, setVariants] = useState<VariantField[]>([{ size: "", color: "", stock: 0, price: "", sku: "" }]);

  useEffect(() => {
    fetch("/api/categorias").then(r => r.json()).then(setCategories).catch(() => {});
  }, []);

  function generateSlug(name: string) {
    return name.toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const fd = new FormData(e.currentTarget);
    const name = fd.get("name") as string;

    const body = {
      name,
      slug: generateSlug(name),
      description: fd.get("description") || null,
      price: parseFloat(fd.get("price") as string),
      comparePrice: fd.get("comparePrice") ? parseFloat(fd.get("comparePrice") as string) : null,
      sku: fd.get("sku") || null,
      stock: parseInt(fd.get("stock") as string) || 0,
      categoryId: fd.get("categoryId") || null,
      published: fd.get("published") === "on",
      featured: fd.get("featured") === "on",
      images: images.filter(i => i.url.trim()),
      variants: variants.filter(v => v.size || v.color),
    };

    const res = await fetch("/api/productos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Error al crear el producto");
      setLoading(false);
      return;
    }

    router.push("/admin/productos");
    router.refresh();
  }

  return (
    <div className="max-w-3xl">

      <div className="mb-10">
        <Link href="/admin/productos"
          className="text-[12px] tracking-[2px] uppercase text-[var(--text-light)] hover:text-[var(--text)] transition-colors duration-300 mb-6 block">
          ← Volver
        </Link>
        <span className="block text-[12px] tracking-[3px] uppercase text-[var(--accent)] mb-2">Nuevo producto</span>
        <h1 className="text-[clamp(2rem,4vw,2.5rem)] font-light text-[var(--text)] italic" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Crear producto
        </h1>
      </div>

      {error && (
        <div className="bg-[var(--blush)] border border-[var(--border)] px-5 py-4 mb-8 rounded-[var(--radius-sm)]">
          <p className="text-[13px] text-[var(--text-light)]">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">

        <section className={card}>
          <h2 className="text-[12px] tracking-[3px] uppercase text-[var(--accent)]">Información básica</h2>

          <div>
            <label className={label}>Nombre *</label>
            <input name="name" required placeholder="Ej: Vestido lino natural" className={input} />
          </div>

          <div>
            <label className={label}>Descripción</label>
            <textarea
              name="description"
              rows={4}
              placeholder="Describí el producto con detalle..."
              className={`${input} resize-none`}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className={label}>Precio *</label>
              <input name="price" type="number" step="0.01" required placeholder="0.00" className={input} />
            </div>
            <div>
              <label className={label}>Precio tachado</label>
              <input name="comparePrice" type="number" step="0.01" placeholder="0.00" className={input} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className={label}>SKU</label>
              <input name="sku" placeholder="Ej: VES-001" className={input} />
            </div>
            <div>
              <label className={label}>Stock general</label>
              <input name="stock" type="number" defaultValue={0} className={input} />
            </div>
          </div>

          <div>
            <label className={label}>Categoría</label>
            <select name="categoryId" className={`${input} cursor-pointer`}>
              <option value="">Sin categoría</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-6 pt-2">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input name="published" type="checkbox"
                className="w-4 h-4 border border-[var(--border)] rounded-[var(--radius-sm)] accent-[var(--cta)]" />
              <span className="text-[10px] tracking-[0.18em] uppercase text-[var(--text-light)] group-hover:text-[var(--text)] transition-colors">
                Publicado
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input name="featured" type="checkbox"
                className="w-4 h-4 border border-[var(--border)] rounded-[var(--radius-sm)] accent-[var(--cta)]" />
              <span className="text-[10px] tracking-[0.18em] uppercase text-[var(--text-light)] group-hover:text-[var(--text)] transition-colors">
                Destacado
              </span>
            </label>
          </div>
        </section>

        <section className={card}>
          <h2 className="text-[12px] tracking-[3px] uppercase text-[var(--accent)]">Imágenes</h2>

          <div className="space-y-4">
            {images.map((img, i) => (
              <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-4 items-end">
                <div>
                  <label className={label}>URL {i === 0 && "*"}</label>
                  <input
                    placeholder="https://..."
                    value={img.url}
                    onChange={e => setImages(imgs => imgs.map((im, j) => j === i ? { ...im, url: e.target.value } : im))}
                    className={input}
                  />
                </div>
                <div>
                  <label className={label}>Alt text</label>
                  <input
                    placeholder="Descripción de la imagen"
                    value={img.alt}
                    onChange={e => setImages(imgs => imgs.map((im, j) => j === i ? { ...im, alt: e.target.value } : im))}
                    className={input}
                  />
                </div>
                {images.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setImages(imgs => imgs.filter((_, j) => j !== i))}
                    className="pb-2.5 text-[var(--text-soft)] hover:text-[var(--text-muted)] transition-colors text-lg leading-none"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setImages(i => [...i, { url: "", alt: "" }])}
            className="text-[10px] tracking-[0.18em] uppercase text-[var(--text-soft)] hover:text-[var(--text-muted)] transition-colors border-b border-[var(--border)] pb-0.5"
          >
            + Agregar imagen
          </button>
        </section>

        <section className={card}>
          <h2 className="text-[12px] tracking-[3px] uppercase text-[var(--accent)]">Variantes</h2>
          <p className="text-[12px] text-[var(--text-soft)] font-light -mt-2">Talle, color y stock por variante</p>

          <div className="space-y-5">
            {variants.map((v, i) => (
              <div key={i} className="grid grid-cols-[1fr_1fr_80px_auto] gap-4 items-end pb-5 border-b border-[var(--border)] last:border-0 last:pb-0">
                <div>
                  <label className={label}>Talle</label>
                  <input
                    placeholder="Ej: S / M / L"
                    value={v.size}
                    onChange={e => setVariants(vs => vs.map((vv, j) => j === i ? { ...vv, size: e.target.value } : vv))}
                    className={input}
                  />
                </div>
                <div>
                  <label className={label}>Color</label>
                  <input
                    placeholder="Ej: Beige"
                    value={v.color}
                    onChange={e => setVariants(vs => vs.map((vv, j) => j === i ? { ...vv, color: e.target.value } : vv))}
                    className={input}
                  />
                </div>
                <div>
                  <label className={label}>Stock</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={v.stock}
                    onChange={e => setVariants(vs => vs.map((vv, j) => j === i ? { ...vv, stock: parseInt(e.target.value) || 0 } : vv))}
                    className={input}
                  />
                </div>
                {variants.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setVariants(vs => vs.filter((_, j) => j !== i))}
                    className="pb-2.5 text-[var(--text-soft)] hover:text-[var(--text-muted)] transition-colors text-lg leading-none"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setVariants(v => [...v, { size: "", color: "", stock: 0, price: "", sku: "" }])}
            className="text-[10px] tracking-[0.18em] uppercase text-[var(--text-soft)] hover:text-[var(--text-muted)] transition-colors border-b border-[var(--border)] pb-0.5"
          >
            + Agregar variante
          </button>
        </section>

        <div className="flex gap-3 pt-2 pb-6">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3.5 bg-[var(--cta)] text-[var(--bg)] text-[11px] tracking-[0.18em] uppercase hover:bg-[var(--cta-hover)] transition-colors disabled:opacity-50 rounded-[var(--radius-sm)]"
          >
            {loading ? "Guardando..." : "Crear producto"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-8 py-3.5 border border-[var(--border)] text-[var(--text-muted)] text-[11px] tracking-[0.18em] uppercase hover:bg-[var(--accent-bg)] transition-colors rounded-[var(--radius-sm)]"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
