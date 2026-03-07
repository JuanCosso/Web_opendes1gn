"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirm = formData.get("confirm") as string;

    if (password !== confirm) {
      setError("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Error al registrarse");
      setLoading(false);
      return;
    }

    router.push("/login");
  }

  const inputClass =
    "w-full bg-transparent border-b border-[var(--border-strong)] py-3.5 text-[14px] text-[var(--text)] placeholder-[var(--text-light)] focus:outline-none focus:border-[var(--accent)] transition-colors duration-300 font-light";

  return (
    <div className="min-h-screen w-full bg-[var(--cream)] flex flex-col md:flex-row">
      <div className="hidden md:flex flex-1 bg-[var(--butter)] items-center justify-center p-12 border-r border-[var(--border)]">
        <div className="w-full max-w-md flex items-center justify-center">
          <span
            className="text-[140px] text-[var(--rose)]/20 italic font-light select-none"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            O
          </span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-[380px]">
          <Link
            href="/"
            className="text-[12px] tracking-[2px] uppercase text-[var(--text-light)] hover:text-[var(--text)] transition-colors duration-300 mb-12 block"
          >
            ← Volver a la tienda
          </Link>

          <span className="block text-[11px] tracking-[3px] uppercase text-[var(--accent)] mb-2">Nueva cuenta</span>
          <h1
            className="text-[clamp(2rem,4vw,2.5rem)] font-light text-[var(--text)] italic mb-10"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Crear cuenta
          </h1>

          {error && (
            <p className="text-[13px] text-[var(--text-light)] bg-[var(--blush)] border border-[var(--border)] px-4 py-3 mb-6 rounded-[var(--radius-sm)]">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {[
              { name: "name", label: "Nombre", type: "text", placeholder: "Tu nombre" },
              { name: "email", label: "Email", type: "email", placeholder: "tu@email.com" },
              { name: "password", label: "Contraseña", type: "password", placeholder: "••••••••", minLength: 6 },
              { name: "confirm", label: "Confirmar contraseña", type: "password", placeholder: "••••••••" },
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-[11px] tracking-[2px] uppercase text-[var(--text-light)] mb-2">{field.label}</label>
                <input
                  name={field.name}
                  type={field.type}
                  required
                  minLength={field.minLength}
                  placeholder={field.placeholder}
                  className={inputClass}
                />
              </div>
            ))}
            <button type="submit" disabled={loading} className="btn-primary w-full py-4 disabled:opacity-50 disabled:hover:transform-none">
              {loading ? "Registrando..." : "Crear cuenta"}
            </button>
          </form>

          <p className="text-[14px] text-[var(--text-light)] mt-10 text-center">
            ¿Ya tenés cuenta?{" "}
            <Link href="/login" className="text-[var(--accent)] hover:text-[var(--text)] transition-colors duration-300">
              Iniciá sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
