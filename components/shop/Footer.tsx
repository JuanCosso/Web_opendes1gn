import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full mt-auto bg-[var(--text)] text-[var(--cream)] border-t border-[var(--border)]">
      <div className="container-center py-[60px] md:py-[80px]">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-12 md:gap-16 mb-14 md:mb-16">
          <div className="sm:col-span-2 max-w-md">
            <p
              className="mb-5 font-light tracking-[6px] uppercase text-[var(--cream)]"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "28px" }}
            >
              opendes1gn
            </p>
            <p className="text-[14px] leading-[1.8] text-[var(--cream)]/50">
              {/* Aquí va tu frase — reemplazá este texto cuando estés listo */}
              Tu frase aquí.
            </p>
          </div>

          <div>
            <p className="text-[11px] tracking-[3px] uppercase text-[var(--accent)] mb-6">Redes Sociales</p>
            <ul className="flex flex-col gap-3 mb-8">
              {[
                { label: "Instagram", href: "https://instagram.com" },
                { label: "TikTok", href: "https://tiktok.com" },
              ].map(({ label, href }) => (
                <li key={href}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[14px] text-[var(--cream)]/50 hover:text-[var(--cream)] transition-colors duration-300"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>

            <p className="text-[11px] tracking-[3px] uppercase text-[var(--accent)] mb-4">Contacto</p>
            <ul className="flex flex-col gap-3">
              {[
                { label: "Escribinos", href: "/contacto" },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-[14px] text-[var(--cream)]/50 hover:text-[var(--cream)] transition-colors duration-300"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-[var(--cream)]/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[12px] text-[var(--cream)]/30 tracking-[1px]">
            © {new Date().getFullYear()} opendes1gn — Todos los derechos reservados
          </p>
        </div>
      </div>
    </footer>
  );
}