"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ImageUploader, type ImageField } from "@/components/admin/ImageUploader";

const label = "block text-[11px] tracking-[2px] uppercase text-[var(--text-light)] mb-2";
const input =
  "w-full bg-transparent border-b border-[var(--border)] py-3 text-[14px] text-[var(--text)] placeholder-[var(--text-light)] focus:outline-none focus:border-[var(--accent)] transition-colors duration-300 font-light";

export default function NuevaCategoriaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [images, setImages] = useState<ImageField[]>([{ url: "", alt: "" }]);

  function generateSlug(name: string) {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (images.some((i) => i.uploading)) {
      setError("Esperá a que termine de subirse la imagen.");
      return;
    }
    setLoading(true);
    setError("");

    const fd = new FormData(e.currentTarget);
    const name = fd.get("name") as string;

    const res = await fetch("/api/categorias", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        slug: generateSlug(name),
        description: fd.get("description") || null,
        image: images[0]?.url.trim() || null,
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
      <div className="mb-10">
        <Link
          href="/admin/categorias"
          className="text-[12px] tracking-[2px] uppercase text-[var(--text-light)] hover:text-[var(--text)] transition-colors duration-300 mb-6 block"
        >
          ← Volver
        </Link>
        <span className="block text-[12px] tracking-[3px] uppercase text-[var(--accent)] mb-2">Admin</span>
        <h1
          className="text-[clamp(2rem,4vw,2.5rem)] font-light text-[var(--text)] italic"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Nueva categoría
        </h1>
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
          <input name="name" required placeholder="Ej: Vestidos" className={input} />
        </div>
        <div>
          <label className={label}>Descripción</label>
          <textarea
            name="description"
            rows={3}
            placeholder="Descripción breve de la categoría..."
            className={`${input} resize-none`}
          />
        </div>
        <div>
          <label className={label}>Imagen de portada</label>
          <ImageUploader images={images} onChange={setImages} />
        </div>
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading || images.some((i) => i.uploading)}
            className="btn-primary disabled:opacity-50"
          >
            {loading ? "Guardando..." : "Crear categoría"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 border border-[var(--border)] text-[var(--text-light)] text-[11px] tracking-[0.18em] uppercase hover:bg-[var(--blush)] transition-colors rounded-[var(--radius-sm)]"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}