"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Category = { id: string; name: string };

export default function NuevoProductoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState([{ url: "", alt: "" }]);
  const [variants, setVariants] = useState([{ size: "", color: "", stock: 0, price: "", sku: "" }]);

  useEffect(() => {
    fetch("/api/categorias").then(r => r.json()).then(setCategories);
  }, []);

  function generateSlug(name: string) {
    return name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;

    const body = {
      name,
      slug: generateSlug(name),
      description: formData.get("description"),
      price: parseFloat(formData.get("price") as string),
      comparePrice: formData.get("comparePrice") ? parseFloat(formData.get("comparePrice") as string) : null,
      sku: formData.get("sku") || null,
      stock: parseInt(formData.get("stock") as string) || 0,
      categoryId: formData.get("categoryId") || null,
      published: formData.get("published") === "on",
      featured: formData.get("featured") === "on",
      images: images.filter(i => i.url),
      variants: variants.filter(v => v.size || v.color),
    };

    const res = await fetch("/api/productos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Error al crear producto");
      setLoading(false);
      return;
    }

    router.push("/admin/productos");
    router.refresh();
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Nuevo producto</h1>
      </div>

      {error && <p className="bg-red-50 text-red-500 text-sm p-3 rounded mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Info básica */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
          <h2 className="font-semibold text-sm">Información básica</h2>
          <div>
            <label className="block text-sm font-medium mb-1">Nombre *</label>
            <input name="name" required className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Descripción</label>
            <textarea name="description" rows={4} className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Precio *</label>
              <input name="price" type="number" step="0.01" required className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Precio antes (tachado)</label>
              <input name="comparePrice" type="number" step="0.01" className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">SKU</label>
              <input name="sku" className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Stock general</label>
              <input name="stock" type="number" defaultValue={0} className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Categoría</label>
            <select name="categoryId" className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black">
              <option value="">Sin categoría</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input name="published" type="checkbox" className="rounded" />
              Publicado
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input name="featured" type="checkbox" className="rounded" />
              Destacado
            </label>
          </div>
        </div>

        {/* Imágenes */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
          <h2 className="font-semibold text-sm">Imágenes</h2>
          {images.map((img, i) => (
            <div key={i} className="grid grid-cols-2 gap-3">
              <input
                placeholder="URL de la imagen"
                value={img.url}
                onChange={e => setImages(imgs => imgs.map((im, j) => j === i ? { ...im, url: e.target.value } : im))}
                className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
              <input
                placeholder="Texto alternativo"
                value={img.alt}
                onChange={e => setImages(imgs => imgs.map((im, j) => j === i ? { ...im, alt: e.target.value } : im))}
                className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          ))}
          <button type="button" onClick={() => setImages(i => [...i, { url: "", alt: "" }])} className="text-sm text-gray-400 hover:text-black underline">
            + Agregar imagen
          </button>
        </div>

        {/* Variantes */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
          <h2 className="font-semibold text-sm">Variantes (talle / color)</h2>
          {variants.map((v, i) => (
            <div key={i} className="grid grid-cols-3 gap-3">
              <input
                placeholder="Talle (ej: M)"
                value={v.size}
                onChange={e => setVariants(vs => vs.map((vv, j) => j === i ? { ...vv, size: e.target.value } : vv))}
                className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
              <input
                placeholder="Color"
                value={v.color}
                onChange={e => setVariants(vs => vs.map((vv, j) => j === i ? { ...vv, color: e.target.value } : vv))}
                className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
              <input
                placeholder="Stock"
                type="number"
                value={v.stock}
                onChange={e => setVariants(vs => vs.map((vv, j) => j === i ? { ...vv, stock: parseInt(e.target.value) } : vv))}
                className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          ))}
          <button type="button" onClick={() => setVariants(v => [...v, { size: "", color: "", stock: 0, price: "", sku: "" }])} className="text-sm text-gray-400 hover:text-black underline">
            + Agregar variante
          </button>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="bg-black text-white px-6 py-2 rounded text-sm hover:bg-gray-800 disabled:opacity-50 transition-colors">
            {loading ? "Guardando..." : "Crear producto"}
          </button>
          <button type="button" onClick={() => router.back()} className="border px-6 py-2 rounded text-sm hover:bg-gray-50 transition-colors">
            Cancelar
          </button>
        </div>

      </form>
    </div>
  );
}
