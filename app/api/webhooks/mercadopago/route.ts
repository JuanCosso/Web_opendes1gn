import { NextResponse } from "next/server";
import { mp } from "@/lib/mercadopago";
import { prisma } from "@/lib/prisma";
import { Payment } from "mercadopago";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // MP puede enviar el ID como payment_id o collection_id
    const paymentId = body.paymentId || body.collectionId;
    if (!paymentId) return NextResponse.json({ ok: false });

    const mpPayment = new Payment(mp);
    const payment = await mpPayment.get({ id: paymentId });

    const orderId = payment.external_reference;
    if (!orderId) return NextResponse.json({ ok: false });

    if (payment.status === "approved") {
      await prisma.payment.updateMany({
        where: { orderId },
        data: { status: "COMPLETED", stripePaymentId: String(paymentId) },
      });
      await prisma.order.updateMany({
        where: { id: orderId },
        data: { status: "CONFIRMED" },
      });
      return NextResponse.json({ ok: true, status: "approved" });
    }

    return NextResponse.json({ ok: true, status: payment.status });
  } catch (error) {
    console.error("[CONFIRM PAYMENT]", error);
    return NextResponse.json({ ok: false });
  }
}