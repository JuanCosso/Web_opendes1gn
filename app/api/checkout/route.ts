import { NextResponse } from "next/server";
import { mp } from "@/lib/mercadopago";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Preference } from "mercadopago";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const {
      items, guestName, guestEmail, guestPhone,
      guestStreet, guestCity, guestState, guestZip, notes,
    } = body;

    if (!items || items.length === 0)
      return NextResponse.json({ error: "El carrito está vacío" }, { status: 400 });

    const subtotal = items.reduce(
      (acc: number, item: { price: number; quantity: number }) =>
        acc + item.price * item.quantity, 0
    );

    // Crear la orden en la DB
    const order = await prisma.order.create({
      data: {
        userId: null,
        status: "PENDING",
        subtotal,
        total: subtotal,
        shippingCost: 0,
        discount: 0,
        notes: notes ?? null,
        guestName: guestName ?? null,
        guestEmail: guestEmail ?? null,
        guestPhone: guestPhone ?? null,
        guestStreet: guestStreet ?? null,
        guestCity: guestCity ?? null,
        guestState: guestState ?? null,
        guestZip: guestZip ?? null,
        items: {
          create: items.map((item: {
            productId: string; variantId?: string;
            quantity: number; price: number;
          }) => ({
            productId: item.productId,
            variantId: item.variantId ?? null,
            quantity: item.quantity,
            price: item.price,
          })),
        },
        payment: {
          create: {
            method: "CARD",
            status: "PENDING",
            amount: subtotal,
            currency: "ars",
          },
        },
      },
    });

    // Crear preferencia de MercadoPago
    const preference = new Preference(mp);
    const response = await preference.create({
      body: {
        external_reference: order.id,
        payer: {
          name: guestName ?? session?.user?.name ?? "",
          email: guestEmail ?? session?.user?.email ?? "",
          phone: { number: guestPhone ?? "" },
          address: {
            street_name: guestStreet ?? "",
            city: { name: guestCity ?? "" },
            zip_code: guestZip ?? "",
          },
        },
        items: items.map((item: {
          name: string; price: number;
          quantity: number; image?: string;
        }) => ({
          id: item.name,
          title: item.name,
          quantity: item.quantity,
          unit_price: item.price,
          currency_id: "ARS",
          picture_url: item.image ?? "",
        })),
        back_urls: {
            success: `https://elegant-seriocomically-joetta.ngrok-free.dev/checkout/exito`,
            failure: `https://elegant-seriocomically-joetta.ngrok-free.dev/carrito`,
            pending: `https://elegant-seriocomically-joetta.ngrok-free.dev/pendiente`,
        },
        auto_return: "approved",
        notification_url: `https://elegant-seriocomically-joetta.ngrok-free.dev/api/webhooks/mercadopago`,
      },
    });

    // Guardar el ID de la preferencia
    await prisma.payment.update({
      where: { orderId: order.id },
      data: { stripeSessionId: response.id }, // reutilizamos el campo
    });

    return NextResponse.json({ url: response.init_point });
  } catch (error) {
    console.error("[CHECKOUT ERROR]", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}