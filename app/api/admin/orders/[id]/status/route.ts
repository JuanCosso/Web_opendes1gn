import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const formData = await req.formData();
    const status = formData.get("status") as string;

    await prisma.order.update({
      where: { id },
      data: { status: status as any },
    });

    return NextResponse.redirect(new URL("/admin/pedidos", req.url));
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}