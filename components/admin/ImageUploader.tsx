"use client";

import { useRef, useState } from "react";
import Image from "next/image";

export type ImageField = { url: string; alt: string; uploading?: boolean };

const label = "block text-[11px] tracking-[2px] uppercase text-[var(--text-light)] mb-2";
const input =
  "w-full bg-transparent border-b border-[var(--border)] py-3 text-[14px] text-[var(--text)] placeholder-[var(--text-light)] focus:outline-none focus:border-[var(--accent)] transition-colors duration-300 font-light";

interface Props {
  images: ImageField[];
  onChange: (images: ImageField[]) => void;
}

export function ImageUploader({ images, onChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  async function uploadFile(file: File, index: number) {
    // Marcar como uploading
    onChange(images.map((im, j) => (j === index ? { ...im, uploading: true } : im)));

    try {
      // 1. Pedir firma al servidor
      const sigRes = await fetch("/api/admin/upload-signature");
      if (!sigRes.ok) throw new Error("No se pudo obtener firma de upload");
      const { timestamp, signature, folder, cloud_name, api_key } = await sigRes.json();

      // 2. Subir directamente a Cloudinary desde el cliente
      const formData = new FormData();
      formData.append("file", file);
      formData.append("timestamp", String(timestamp));
      formData.append("signature", signature);
      formData.append("folder", folder);
      formData.append("api_key", api_key);

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
        { method: "POST", body: formData }
      );

      if (!uploadRes.ok) {
        const err = await uploadRes.json();
        throw new Error(err.error?.message || "Error en Cloudinary");
      }

      const data = await uploadRes.json();
      onChange(
        images.map((im, j) =>
          j === index ? { url: data.secure_url, alt: im.alt, uploading: false } : im
        )
      );
    } catch (err: unknown) {
      onChange(images.map((im, j) => (j === index ? { ...im, uploading: false } : im)));
      alert(err instanceof Error ? err.message : "Error al subir imagen");
    }
  }

  function triggerUpload(index: number) {
    setActiveIndex(index);
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file && activeIndex !== null) uploadFile(file, activeIndex);
    e.target.value = "";
  }

  function updateUrl(index: number, url: string) {
    onChange(images.map((im, j) => (j === index ? { ...im, url } : im)));
  }

  function updateAlt(index: number, alt: string) {
    onChange(images.map((im, j) => (j === index ? { ...im, alt } : im)));
  }

  function removeImage(index: number) {
    onChange(images.filter((_, j) => j !== index));
  }

  function addImage() {
    onChange([...images, { url: "", alt: "" }]);
  }

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFileChange}
      />

      {images.map((img, i) => (
        <div key={i} className="flex gap-4 items-start">
          {/* Preview */}
          <div className="flex-shrink-0 w-20 h-20 bg-[var(--blush)] border border-[var(--border)] rounded-[var(--radius-sm)] overflow-hidden relative">
            {img.uploading ? (
              <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                <div className="w-4 h-4 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
                <span className="text-[9px] text-[var(--text-light)] tracking-[1px]">Subiendo</span>
              </div>
            ) : img.url ? (
              <Image
                src={img.url}
                alt={img.alt || "preview"}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-[var(--text-light)] text-2xl opacity-30">□</span>
              </div>
            )}
          </div>

          {/* Controles */}
          <div className="flex-1 space-y-2">
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <label className={label}>
                  {i === 0 ? "Imagen principal *" : `Imagen ${i + 1}`}
                </label>
                <input
                  placeholder="https://res.cloudinary.com/... o subí un archivo →"
                  value={img.url}
                  onChange={(e) => updateUrl(i, e.target.value)}
                  className={input}
                  disabled={img.uploading}
                />
              </div>
              <button
                type="button"
                onClick={() => triggerUpload(i)}
                disabled={img.uploading}
                className="flex-shrink-0 mb-0.5 px-4 py-2.5 border border-[var(--border)] text-[10px] tracking-[2px] uppercase text-[var(--text-light)] hover:text-[var(--text)] hover:border-[var(--accent)] transition-colors rounded-[var(--radius-sm)] disabled:opacity-40 whitespace-nowrap"
              >
                {img.uploading ? "..." : "↑ Subir"}
              </button>
            </div>
            <input
              placeholder="Alt text (descripción para accesibilidad)"
              value={img.alt}
              onChange={(e) => updateAlt(i, e.target.value)}
              className={input}
              disabled={img.uploading}
            />
          </div>

          {images.length > 1 && (
            <button
              type="button"
              onClick={() => removeImage(i)}
              disabled={img.uploading}
              className="flex-shrink-0 mt-6 text-[var(--text-light)] hover:text-red-400 transition-colors text-xl leading-none disabled:opacity-30"
            >
              ×
            </button>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={addImage}
        className="text-[10px] tracking-[2px] uppercase text-[var(--text-light)] hover:text-[var(--text)] transition-colors border-b border-[var(--border)] pb-0.5"
      >
        + Agregar imagen
      </button>
    </div>
  );
}