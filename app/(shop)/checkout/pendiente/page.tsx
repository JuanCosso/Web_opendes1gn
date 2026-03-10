import Link from "next/link";

export default function PendientePage() {
  return (
    <main className="w-full min-h-screen bg-[var(--cream)] flex items-center justify-center">
      <div className="container-center py-24 text-center max-w-lg">
        <div className="w-16 h-16 rounded-full bg-[var(--butter)] border border-[var(--border)] flex items-center justify-center mx-auto mb-8">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-[clamp(2rem,4vw,2.75rem)] font-light italic text-[var(--text)] mb-4"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Pago pendiente
        </h1>
        <p className="text-[14px] text-[var(--text-light)] mb-10">
          Tu pago está siendo revisado. Cuando se acredite te contactamos para coordinar el envío.
        </p>
        <Link href="/" className="btn-primary">Volver al inicio</Link>
      </div>
    </main>
  );
}