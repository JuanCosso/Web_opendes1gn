import { prisma } from "@/lib/prisma";
import { PedidosClient } from "@/components/admin/PedidosClient";

export const dynamic = "force-dynamic";

export default async function PedidosAdminPage() {
  const orders = await prisma.order.findMany({
    include: {
      items: { include: { product: true } },
      payment: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const serialized = JSON.parse(JSON.stringify(orders));

  return <PedidosClient orders={serialized} />;
}