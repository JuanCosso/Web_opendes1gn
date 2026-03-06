"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NuevaCategoriaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function generateSlug(name: string) {
    return name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;

    const res = await fetch("/api/categorias", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        slug: generateSlug(name),
        description: formData.get("description"),
        image: formData.get("image"),
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Error al crear categoría");
      setLoading(false);
      return;
    }

    router.push("/admin/categorias");
    router.refresh();
  }

  return (
    <div className="max-w-lg">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Nueva categoría</h1>
      </div>

      {error && <p className="bg-red-50 text-red-500 text-sm p-3 rounded mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nombre *</label>
          <input name="name" required className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Descripción</label>
          <textarea name="description" rows={3} className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">URL de imagen</label>
          <input name="image" type="url" placeholder="https://..." className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className="bg-black text-white px-6 py-2 rounded text-sm hover:bg-gray-800 disabled:opacity-50 transition-colors">
            {loading ? "Guardando..." : "Crear categoría"}
          </button>
          <button type="button" onClick={() => router.back()} className="border px-6 py-2 rounded text-sm hover:bg-gray-50 transition-colors">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
