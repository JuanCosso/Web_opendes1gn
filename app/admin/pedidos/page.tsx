import { prisma } from "@/lib/prisma";
import Link from "next/link";

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Pendiente",
  CONFIRMED: "Confirmado",
  PROCESSING: "En proceso",
  SHIPPED: "Enviado",
  DELIVERED: "Entregado",
  CANCELLED: "Cancelado",
  REFUNDED: "Reembolsado",
};

const STATUS_COLOR: Record<string, string> = {
  PENDING: "bg-[var(--butter)] text-[var(--text)]",
  CONFIRMED: "bg-[var(--blush)] text-[var(--text)]",
  PROCESSING: "bg-[var(--blush)] text-[var(--text)]",
  SHIPPED: "bg-[var(--accent)]/10 text-[var(--accent)]",
  DELIVERED: "bg-green-50 text-green-700",
  CANCELLED: "bg-red-50 text-red-500",
  REFUNDED: "bg-gray-100 text-gray-500",
};

export default async function PedidosAdminPage() {
  const orders = await prisma.order.findMany({
    include: {
      items: {
        include: { product: true },
      },
      payment: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-12">
        <span className="block text-[12px] tracking-[3px] uppercase text-[var(--accent)] mb-2">Gestión</span>
        <h1 className="text-[clamp(2rem,4vw,2.5rem)] font-light text-[var(--text)] italic"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Pedidos
        </h1>
      </div>

      {orders.length === 0 ? (
        <div className="bg-[var(--white)] border border-[var(--border)] rounded-[var(--radius)] p-12 text-center">
          <p className="text-[var(--text-light)] text-[14px]">Todavía no hay pedidos.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id}
              className="bg-[var(--white)] border border-[var(--border)] rounded-[var(--radius)] p-6 hover:border-[var(--accent)]/40 transition-colors">

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-[11px] tracking-[2px] uppercase text-[var(--text-light)]">
                      #{order.id.slice(-8).toUpperCase()}
                    </span>
                    <span className={`text-[9px] tracking-[2px] uppercase px-2.5 py-1 rounded-[var(--radius-sm)] ${STATUS_COLOR[order.status] ?? "bg-gray-100 text-gray-500"}`}>
                      {STATUS_LABEL[order.status] ?? order.status}
                    </span>
                    {order.payment && (
                      <span className={`text-[9px] tracking-[2px] uppercase px-2.5 py-1 rounded-[var(--radius-sm)] ${
                        order.payment.status === "COMPLETED"
                          ? "bg-green-50 text-green-700"
                          : "bg-[var(--butter)] text-[var(--text)]"
                      }`}>
                        {order.payment.status === "COMPLETED" ? "Pagado" : "Pago pendiente"}
                      </span>
                    )}
                  </div>
                  <p className="text-[13px] text-[var(--text-light)]">
                    {order.guestName && <span className="text-[var(--text)] font-light">{order.guestName} · </span>}
                    {order.guestEmail}
                  </p>
                  {order.guestPhone && (
                    <p className="text-[12px] text-[var(--text-light)]">{order.guestPhone}</p>
                  )}
                </div>

                <div className="text-right flex-shrink-0">
                  <p className="text-[22px] font-light text-[var(--text)]"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    ${Number(order.total).toLocaleString("es-AR")}
                  </p>
                  <p className="text-[11px] text-[var(--text-light)]">
                    {new Date(order.createdAt).toLocaleDateString("es-AR", {
                      day: "numeric", month: "short", year: "numeric",
                      hour: "2-digit", minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              {/* Productos */}
              <div className="border-t border-[var(--border)] pt-4 mb-4">
                <div className="space-y-1">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-[12px]">
                      <span className="text-[var(--text-light)]">
                        {item.product.name} × {item.quantity}
                      </span>
                      <span className="text-[var(--text)]">
                        ${Number(item.price * item.quantity).toLocaleString("es-AR")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dirección */}
              {order.guestStreet && (
                <div className="border-t border-[var(--border)] pt-4 mb-4">
                  <p className="text-[10px] tracking-[2px] uppercase text-[var(--text-light)] mb-1">Envío a</p>
                  <p className="text-[12px] text-[var(--text)]">
                    {order.guestStreet}, {order.guestCity}, {order.guestState} ({order.guestZip})
                  </p>
                </div>
              )}

              {/* Notas */}
              {order.notes && (
                <div className="border-t border-[var(--border)] pt-4 mb-4">
                  <p className="text-[10px] tracking-[2px] uppercase text-[var(--text-light)] mb-1">Notas</p>
                  <p className="text-[12px] text-[var(--text-light)] italic">{order.notes}</p>
                </div>
              )}

              {/* Cambiar estado */}
              <div className="border-t border-[var(--border)] pt-4 flex items-center gap-3">
                <p className="text-[10px] tracking-[2px] uppercase text-[var(--text-light)]">Cambiar estado:</p>
                <UpdateStatusForm orderId={order.id} currentStatus={order.status} />
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function UpdateStatusForm({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
  return (
    <form action={`/api/admin/orders/${orderId}/status`} method="POST" className="flex items-center gap-2">
      <select name="status" defaultValue={currentStatus}
        className="bg-transparent border border-[var(--border)] px-3 py-1.5 text-[11px] tracking-[1px] uppercase text-[var(--text)] focus:outline-none focus:border-[var(--accent)] rounded-[var(--radius-sm)] cursor-pointer">
        {Object.entries(STATUS_LABEL).map(([value, label]) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>
      <button type="submit"
        className="px-3 py-1.5 text-[10px] tracking-[2px] uppercase border border-[var(--border)] text-[var(--text-light)] hover:text-[var(--text)] hover:border-[var(--accent)]/40 transition-colors rounded-[var(--radius-sm)]">
        Guardar
      </button>
    </form>
  );
}