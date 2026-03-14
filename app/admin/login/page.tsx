"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: fd.get("username"),
        password: fd.get("password"),
      }),
    });

    if (res.ok) {
      router.push("/admin/dashboard");
      router.refresh();
    } else {
      setError("Usuario o contraseña incorrectos.");
      setLoading(false);
    }
  }

  const input = "w-full bg-transparent border-b border-[var(--border)] py-3.5 text-[14px] text-[var(--text)] placeholder-[var(--text-light)] focus:outline-none focus:border-[var(--accent)] transition-colors duration-300 font-light";

  return (
    <div className="min-h-screen w-full bg-[var(--cream)] flex items-center justify-center p-6">
      <div className="w-full max-w-[360px]">

        <div className="mb-10 text-center">
          <span className="block text-[11px] tracking-[4px] uppercase text-[var(--accent)] mb-2">
            Panel
          </span>
          <h1
            className="text-[clamp(2rem,4vw,2.4rem)] font-light text-[var(--text)] italic"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Administración
          </h1>
        </div>

        {error && (
          <p className="text-[12px] text-[var(--text-light)] bg-[var(--blush)] border border-[var(--border)] px-4 py-3 mb-6 rounded-[var(--radius-sm)] text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-[11px] tracking-[2px] uppercase text-[var(--text-light)] mb-2">
              Usuario
            </label>
            <input
              name="username"
              type="text"
              required
              autoComplete="off"
              className={input}
            />
          </div>
          <div>
            <label className="block text-[11px] tracking-[2px] uppercase text-[var(--text-light)] mb-2">
              Contraseña
            </label>
            <input
              name="password"
              type="password"
              required
              autoComplete="off"
              className={input}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-4 disabled:opacity-50"
          >
            {loading ? "Verificando..." : "Ingresar"}
          </button>
        </form>

      </div>
    </div>
  );
}