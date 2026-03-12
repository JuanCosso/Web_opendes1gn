import Link from "next/link";

export default function PendientePage() {
  return (
    <main className="w-full min-h-screen bg-[var(--cream)]">
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="flex flex-col items-center text-center px-6 max-w-md">

          <div className="w-16 h-16 rounded-full bg-[var(--butter)] border border-[var(--border)] flex items-center justify-center mb-8">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
              className="text-[var(--accent)]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>

          <h1
            className="text-[clamp(2rem,4vw,2.75rem)] font-light italic text-[var(--text)] mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Pago pendiente
          </h1>

          <p className="text-[14px] text-[var(--text-light)] font-light mb-10 leading-relaxed">
            Tu pago está siendo revisado. Cuando se acredite te contactamos para coordinar el envío.
          </p>

          <Link href="/" className="btn-primary">
            Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}