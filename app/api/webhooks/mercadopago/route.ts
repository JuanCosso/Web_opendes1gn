import { NextResponse } from "next/server";
import { mp } from "@/lib/mercadopago";
import { prisma } from "@/lib/prisma";
import { Payment } from "mercadopago";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (body.type !== "payment") return NextResponse.json({ ok: true });

    const paymentId = body.data?.id;
    if (!paymentId) return NextResponse.json({ ok: true });

    const mpPayment = new Payment(mp);
    const payment = await mpPayment.get({ id: paymentId });

    const orderId = payment.external_reference;
    if (!orderId) return NextResponse.json({ ok: true });

    if (payment.status === "approved") {
      await prisma.payment.updateMany({
        where: { orderId },
        data: { status: "COMPLETED", stripePaymentId: String(paymentId) },
      });
      await prisma.order.updateMany({
        where: { id: orderId },
        data: { status: "CONFIRMED" },
      });
    } else if (payment.status === "rejected") {
      await prisma.payment.updateMany({
        where: { orderId },
        data: { status: "FAILED" },
      });
      await prisma.order.updateMany({
        where: { id: orderId },
        data: { status: "CANCELLED" },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[MP WEBHOOK]", error);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}