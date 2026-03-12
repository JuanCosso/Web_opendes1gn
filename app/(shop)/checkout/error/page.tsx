import Link from "next/link";

export default function ErrorPagoPage() {
  return (
    <main className="w-full min-h-screen bg-[var(--cream)]">
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="flex flex-col items-center text-center px-6 max-w-md">

          <div className="w-16 h-16 rounded-full bg-[var(--blush)] border border-[var(--border)] flex items-center justify-center mb-8">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
              className="text-[var(--accent)]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"/>
            </svg>
          </div>

          <h1
            className="text-[clamp(2rem,4vw,2.75rem)] font-light italic text-[var(--text)] mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            El pago no se completó
          </h1>

          <p className="text-[14px] text-[var(--text-light)] font-light mb-10 leading-relaxed">
            Hubo un problema al procesar tu pago. Tu carrito sigue guardado, podés intentarlo de nuevo o elegir otro medio de pago.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Link href="/checkout" className="btn-primary">
              Reintentar pago
            </Link>
            <Link href="/carrito"
              className="btn-secondary text-center">
              Volver al carrito
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
}