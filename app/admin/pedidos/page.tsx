import { prisma } from "@/lib/prisma";
import { PedidosClient } from "@/components/admin/PedidosClient";

export default async function PedidosAdminPage() {
  const orders = await prisma.order.findMany({
    include: {
      items: { include: { product: true } },
      payment: true,
    },
    orderBy: { createdAt: "desc" },
  });

  // JSON.parse/stringify convierte todos los Decimal y Date a primitivos de una vez
  const serialized = JSON.parse(JSON.stringify(orders));

  return <PedidosClient orders={serialized} />;
}