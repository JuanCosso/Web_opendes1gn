import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function ExitoPage({
  searchParams,
}: {
  searchParams: Promise<{
    collection_id?: string;
    collection_status?: string;
    external_reference?: string;
    payment_type?: string;
  }>;
}) {
  const params = await searchParams;
  const orderId = params.external_reference;
  const status = params.collection_status; // "approved", "pending", "rejected"

  // Actualizar la orden si el pago fue aprobado
  if (orderId && status === "approved") {
    await prisma.payment.updateMany({
      where: { orderId },
      data: {
        status: "COMPLETED",
        stripePaymentId: params.collection_id ?? null,
      },
    });
    await prisma.order.updateMany({
      where: { id: orderId },
      data: { status: "CONFIRMED" },
    });
  }

  const isPending = status === "pending" || status === "in_process";

  return (
    <main className="w-full min-h-screen bg-[var(--cream)] flex items-center justify-center">
      <div className="container-center py-24 text-center max-w-lg">

        <div className={`w-16 h-16 rounded-full border flex items-center justify-center mx-auto mb-8 ${
          isPending
            ? "bg-[var(--butter)] border-[var(--border)]"
            : "bg-[var(--blush)] border-[var(--border)]"
        }`}>
          {isPending ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          )}
        </div>

        <h1
          className="text-[clamp(2rem,4vw,2.75rem)] font-light italic text-[var(--text)] mb-4"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          {isPending ? "Pago en proceso" : "¡Gracias por tu compra!"}
        </h1>

        <p className="text-[14px] text-[var(--text-light)] mb-10">
          {isPending
            ? "Tu pago está siendo procesado. Te avisaremos cuando se confirme."
            : "Tu pedido fue confirmado. Te contactaremos para coordinar el envío."}
        </p>

        <Link href="/productos" className="btn-primary">
          Seguir comprando
        </Link>
      </div>
    </main>
  );
}