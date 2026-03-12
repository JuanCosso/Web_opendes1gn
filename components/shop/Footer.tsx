import Link from "next/link";
import { getWhatsAppUrl } from "@/lib/contact";

export function Footer() {
  const whatsappUrl = getWhatsAppUrl();

  return (
    <footer className="w-full mt-auto bg-[var(--text)] text-[var(--cream)]">

      {/* Franja superior decorativa */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-[var(--accent)]/40 to-transparent" />

      <div className="container-center pt-16 md:pt-20 pb-10 md:pb-14">

        {/* Grid principal */}
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-12 md:gap-16 mb-16">

          {/* Marca */}
          <div>
            <p
              className="mb-4 font-light tracking-[6px] uppercase text-[var(--cream)]"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "30px" }}
            >
              opendes1gn
            </p>
            <div className="w-8 h-px bg-[var(--accent)]/50 mb-5" />
            <p className="text-[13px] leading-[1.9] text-[var(--cream)]/45 max-w-[300px] font-light">
              Prendas únicas de edición limitada. Diseñadas y confeccionadas desde cero con materiales reciclados o cuidadosamente seleccionados.
            </p>
          </div>

          {/* Navegación */}
          <div>
            <p className="text-[10px] tracking-[4px] uppercase text-[var(--accent)]/80 mb-6">
              Explorar
            </p>
            <ul className="flex flex-col gap-3">
              {[
                { label: "Inicio", href: "/" },
                { label: "Colección", href: "/productos" },
                { label: "Contacto", href: whatsappUrl, external: true },
              ].map(({ label, href, external }) => (
                <li key={href}>
                  {external ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[13px] text-[var(--cream)]/45 hover:text-[var(--cream)] transition-colors duration-300 tracking-[0.5px]"
                    >
                      {label}
                    </a>
                  ) : (
                    <Link
                      href={href}
                      className="text-[13px] text-[var(--cream)]/45 hover:text-[var(--cream)] transition-colors duration-300 tracking-[0.5px]"
                    >
                      {label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto + redes */}
          <div>
            <p className="text-[10px] tracking-[4px] uppercase text-[var(--accent)]/80 mb-6">
              Seguinos
            </p>
            <ul className="flex flex-col gap-3 mb-8">
              {/* Instagram */}
              <li>
                <a
                  href="https://instagram.com/opendes1gn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 text-[var(--cream)]/45 hover:text-[var(--cream)] transition-colors duration-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="opacity-60 group-hover:opacity-100 transition-opacity"
                    aria-hidden
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
                  </svg>
                  <span className="text-[13px] tracking-[0.5px]">Instagram</span>
                </a>
              </li>
              {/* TikTok */}
              <li>
                <a
                  href="https://tiktok.com/@opendes1gn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 text-[var(--cream)]/45 hover:text-[var(--cream)] transition-colors duration-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="opacity-60 group-hover:opacity-100 transition-opacity"
                    aria-hidden
                  >
                    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                  </svg>
                  <span className="text-[13px] tracking-[0.5px]">TikTok</span>
                </a>
              </li>
            </ul>

            <p className="text-[10px] tracking-[4px] uppercase text-[var(--accent)]/80 mb-4">
              Contacto
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 text-[var(--cream)]/45 hover:text-[var(--cream)] transition-colors duration-300 mb-3"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="opacity-60 group-hover:opacity-100 transition-opacity"
                aria-hidden
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <span className="text-[13px] tracking-[0.5px]">WhatsApp</span>
            </a>
            <a
              href="mailto:opendesgn@gmail.com"
              className="group flex items-center gap-3 text-[var(--cream)]/45 hover:text-[var(--cream)] transition-colors duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="opacity-60 group-hover:opacity-100 transition-opacity"
                aria-hidden
              >
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <span className="text-[13px] tracking-[0.5px]">opendesgn@gmail.com</span>
            </a>
          </div>
        </div>

        {/* Línea separadora */}
        <div className="w-full h-px bg-[var(--cream)]/8 mb-8" />

        {/* Copyright */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-[11px] text-[var(--cream)]/25 tracking-[1px]">
            © {new Date().getFullYear()} opendes1gn — Todos los derechos reservados
          </p>
          <p className="text-[11px] text-[var(--cream)]/20 tracking-[1px] italic"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Desarrollado por Juan Cosso
          </p>
        </div>
      </div>
    </footer>
  );
}