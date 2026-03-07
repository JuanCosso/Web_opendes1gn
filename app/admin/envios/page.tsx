export default function EnviosAdminPage() {
  return (
    <div>
      <div className="mb-12">
        <span className="block text-[12px] tracking-[3px] uppercase text-[var(--accent)] mb-2">Gestión</span>
        <h1 className="text-[clamp(2rem,4vw,2.5rem)] font-light text-[var(--text)] italic" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Envíos
        </h1>
      </div>
      <div className="bg-[var(--white)] border border-[var(--border)] rounded-[var(--radius)] p-12 text-center">
        <p className="text-[var(--text-light)] text-[14px]">Próximamente: gestión de envíos.</p>
      </div>
    </div>
  );
}
