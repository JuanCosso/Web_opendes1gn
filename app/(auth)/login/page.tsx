"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    if (result?.error) {
      setError("Email o contraseña incorrectos");
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  const inputClass =
    "w-full bg-transparent border-b border-[var(--border-strong)] py-3.5 text-[14px] text-[var(--text)] placeholder-[var(--text-light)] focus:outline-none focus:border-[var(--accent)] transition-colors duration-300 font-light";

  return (
    <div className="min-h-screen w-full bg-[var(--cream)] flex flex-col md:flex-row">
      <div className="hidden md:flex flex-1 bg-[var(--blush)] items-center justify-center p-12 border-r border-[var(--border)]">
        <div className="w-full max-w-md flex items-center justify-center">
          <span
            className="text-[140px] text-[var(--rose)]/30 italic font-light select-none"
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

          <span className="block text-[11px] tracking-[3px] uppercase text-[var(--accent)] mb-2">Bienvenida</span>
          <h1
            className="text-[clamp(2rem,4vw,2.5rem)] font-light text-[var(--text)] italic mb-10"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Iniciar sesión
          </h1>

          {error && (
            <p className="text-[13px] text-[var(--text-light)] bg-[var(--blush)] border border-[var(--border)] px-4 py-3 mb-6 rounded-[var(--radius-sm)]">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block text-[11px] tracking-[2px] uppercase text-[var(--text-light)] mb-2">Email</label>
              <input name="email" type="email" required placeholder="tu@email.com" className={inputClass} />
            </div>
            <div>
              <label className="block text-[11px] tracking-[2px] uppercase text-[var(--text-light)] mb-2">Contraseña</label>
              <input name="password" type="password" required placeholder="••••••••" className={inputClass} />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-4 disabled:opacity-50 disabled:hover:transform-none">
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
          </form>

          <p className="text-[14px] text-[var(--text-light)] mt-10 text-center">
            ¿No tenés cuenta?{" "}
            <Link href="/register" className="text-[var(--accent)] hover:text-[var(--text)] transition-colors duration-300">
              Registrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
