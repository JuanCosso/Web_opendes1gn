"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ImageUploader, type ImageField } from "@/components/admin/ImageUploader";

type Category = { id: string; name: string };
type VariantField = { size: string; color: string; stock: number; price: string; sku: string };

const label = "block text-[11px] tracking-[2px] uppercase text-[var(--text-light)] mb-2";
const input =
  "w-full bg-transparent border-b border-[var(--border)] py-3 text-[14px] text-[var(--text)] placeholder-[var(--text-light)] focus:outline-none focus:border-[var(--accent)] transition-colors duration-300 font-light";
const card = "bg-[var(--white)] border border-[var(--border)] p-6 md:p-8 space-y-6 rounded-[var(--radius)]";

export default function EditarProductoPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [slug, setSlug] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<ImageField[]>([{ url: "", alt: "" }]);
  const [variants, setVariants] = useState<VariantField[]>([
    { size: "", color: "", stock: 0, price: "", sku: "" },
  ]);

  const [form, setForm] = useState({
    name: "", description: "", price: "", comparePrice: "",
    sku: "", stock: "0", categoryId: "", published: false, featured: false,
  });

  useEffect(() => {
    fetch("/api/categorias").then((r) => r.json()).then(setCategories).catch(() => {});

    fetch(`/api/admin/productos/${id}`)
      .then(async (r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then((p) => {
        setSlug(p.slug);
        setForm({
          name: p.name ?? "", description: p.description ?? "",
          price: String(p.price ?? ""), comparePrice: p.comparePrice ? String(p.comparePrice) : "",
          sku: p.sku ?? "", stock: String(p.stock ?? 0),
          categoryId: p.categoryId ?? "", published: p.published ?? false, featured: p.featured ?? false,
        });
        setImages(p.images?.length
          ? p.images.map((i: ImageField) => ({ url: i.url, alt: i.alt || "" }))
          : [{ url: "", alt: "" }]);
        setVariants(p.variants?.length
          ? p.variants.map((v: VariantField) => ({
              size: v.size || "", color: v.color || "",
              stock: v.stock || 0, price: v.price ? String(v.price) : "", sku: v.sku || "",
            }))
          : [{ size: "", color: "", stock: 0, price: "", sku: "" }]);
        setFetching(false);
      })
      .catch((err) => {
        console.error("Error cargando producto:", err);
        setError("No se pudo cargar el producto. Verificá tu conexión e intentá de nuevo.");
        setFetching(false);
      });
  }, [id]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (images.some((i) => i.uploading)) { setError("Esperá a que terminen de subirse las imágenes."); return; }
    setLoading(true); setError("");

    const body = {
      ...form,
      price: parseFloat(form.price),
      comparePrice: form.comparePrice ? parseFloat(form.comparePrice) : null,
      stock: parseInt(form.stock) || 0,
      categoryId: form.categoryId || null,
      images: images.filter((i) => i.url.trim()),
      variants: variants.filter((v) => v.size || v.color),
    };

    const res = await fetch(`/api/productos/${slug}`, {
      method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
    });

    if (!res.ok) { const data = await res.json(); setError(data.error || "Error al guardar"); setLoading(false); return; }
    router.push("/admin/productos"); router.refresh();
  }

  async function handleDelete() {
    if (!confirm("¿Eliminar este producto? Esta acción no se puede deshacer.")) return;
    if (!slug) { setError("No se puede eliminar: no se encontró el identificador del producto."); return; }

    const res = await fetch(`/api/productos/${slug}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) { setError(data.error || "No se pudo eliminar."); return; }
    if (data.softDeleted) { setForm((f) => ({ ...f, published: false, featured: false })); setError("⚠️ " + data.message); return; }
    router.push("/admin/productos"); router.refresh();
  }

  if (fetching) return (
    <div className="flex items-center justify-center py-32">
      <p className="text-[13px] text-[var(--text-light)] tracking-[2px] uppercase">Cargando...</p>
    </div>
  );

  if (error && !form.name) return (
    <div className="max-w-3xl">
      <Link href="/admin/productos" className="text-[12px] tracking-[2px] uppercase text-[var(--text-light)] hover:text-[var(--text)] transition-colors mb-6 block">← Volver</Link>
      <div className="bg-[var(--blush)] border border-[var(--border)] px-5 py-6 rounded-[var(--radius)]">
        <p className="text-[13px] text-[var(--text-light)] mb-4">{error}</p>
        <button onClick={() => window.location.reload()} className="text-[11px] tracking-[2px] uppercase text-[var(--accent)] hover:text-[var(--text)] transition-colors border-b border-[var(--accent)]">Reintentar</button>
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl">
      <div className="mb-10">
        <Link href="/admin/productos" className="text-[12px] tracking-[2px] uppercase text-[var(--text-light)] hover:text-[var(--text)] transition-colors mb-6 block">← Volver</Link>
        <span className="block text-[12px] tracking-[3px] uppercase text-[var(--accent)] mb-2">Editar producto</span>
        <h1 className="text-[clamp(2rem,4vw,2.5rem)] font-light text-[var(--text)] italic" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          {form.name || "Producto"}
        </h1>
      </div>

      {error && (
        <div className="bg-[var(--blush)] border border-[var(--border)] px-5 py-4 mb-8 rounded-[var(--radius-sm)]">
          <p className="text-[13px] text-[var(--text-light)]">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className={card}>
          <h2 className="text-[11px] tracking-[3px] uppercase text-[var(--accent)]">Información básica</h2>
          <div>
            <label className={label}>Nombre *</label>
            <input name="name" required value={form.name} onChange={handleChange} className={input} />
          </div>
          <div>
            <label className={label}>Descripción</label>
            <textarea name="description" rows={4} value={form.description} onChange={handleChange} className={`${input} resize-none`} />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className={label}>Precio *</label>
              <input name="price" type="number" step="0.01" required value={form.price} onChange={handleChange} className={input} />
            </div>
            <div>
              <label className={label}>Precio tachado</label>
              <input name="comparePrice" type="number" step="0.01" value={form.comparePrice} onChange={handleChange} className={input} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className={label}>SKU</label>
              <input name="sku" value={form.sku} onChange={handleChange} className={input} />
            </div>
            <div>
              <label className={label}>Stock</label>
              <input name="stock" type="number" value={form.stock} onChange={handleChange} className={input} />
            </div>
          </div>
          <div>
            <label className={label}>Categoría</label>
            <select name="categoryId" value={form.categoryId} onChange={handleChange} className={`${input} cursor-pointer`}>
              <option value="">Sin categoría</option>
              {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
          </div>
          <div className="flex gap-6 pt-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="published" checked={form.published} onChange={handleChange} className="w-4 h-4 accent-[var(--accent)]" />
              <span className="text-[11px] tracking-[2px] uppercase text-[var(--text-light)]">Publicado</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} className="w-4 h-4 accent-[var(--accent)]" />
              <span className="text-[11px] tracking-[2px] uppercase text-[var(--text-light)]">Destacado</span>
            </label>
          </div>
        </section>

        <section className={card}>
          <h2 className="text-[11px] tracking-[3px] uppercase text-[var(--accent)]">Imágenes</h2>
          <ImageUploader images={images} onChange={setImages} />
        </section>

        <section className={card}>
          <h2 className="text-[11px] tracking-[3px] uppercase text-[var(--accent)]">Variantes</h2>
          <div className="space-y-5">
            {variants.map((v, i) => (
              <div key={i} className="grid grid-cols-[1fr_1fr_80px_auto] gap-4 items-end pb-5 border-b border-[var(--border)] last:border-0 last:pb-0">
                <div>
                  <label className={label}>Talle</label>
                  <input placeholder="S / M / L" value={v.size} onChange={(e) => setVariants((vs) => vs.map((vv, j) => j === i ? { ...vv, size: e.target.value } : vv))} className={input} />
                </div>
                <div>
                  <label className={label}>Color</label>
                  <input placeholder="Beige" value={v.color} onChange={(e) => setVariants((vs) => vs.map((vv, j) => j === i ? { ...vv, color: e.target.value } : vv))} className={input} />
                </div>
                <div>
                  <label className={label}>Stock</label>
                  <input type="number" placeholder="0" value={v.stock} onChange={(e) => setVariants((vs) => vs.map((vv, j) => j === i ? { ...vv, stock: parseInt(e.target.value) || 0 } : vv))} className={input} />
                </div>
                {variants.length > 1 && (
                  <button type="button" onClick={() => setVariants((vs) => vs.filter((_, j) => j !== i))} className="pb-3 text-[var(--text-light)] hover:text-red-400 transition-colors text-xl">×</button>
                )}
              </div>
            ))}
          </div>
          <button type="button" onClick={() => setVariants((v) => [...v, { size: "", color: "", stock: 0, price: "", sku: "" }])} className="text-[10px] tracking-[2px] uppercase text-[var(--text-light)] hover:text-[var(--text)] transition-colors border-b border-[var(--border)] pb-0.5">
            + Agregar variante
          </button>
        </section>

        <div className="flex items-center justify-between pt-2 pb-10">
          <button type="submit" disabled={loading || images.some((i) => i.uploading)} className="btn-primary disabled:opacity-50">
            {loading ? "Guardando..." : "Guardar cambios"}
          </button>
          <button type="button" onClick={handleDelete} className="text-[11px] tracking-[2px] uppercase text-red-400 hover:text-red-600 transition-colors">
            Eliminar producto
          </button>
        </div>
      </form>
    </div>
  );
}