"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";

const STATUS_LABEL: Record<string, string> = {
  PENDING:    "Pendiente",
  CONFIRMED:  "Confirmado",
  PROCESSING: "En proceso",
  SHIPPED:    "Enviado",
  DELIVERED:  "Entregado",
  CANCELLED:  "Cancelado",
  REFUNDED:   "Reembolsado",
};

const STATUS_COLOR: Record<string, string> = {
  PENDING:    "bg-[var(--butter)] text-[var(--text)]",
  CONFIRMED:  "bg-[var(--blush)] text-[var(--text)]",
  PROCESSING: "bg-[var(--blush)] text-[var(--text)]",
  SHIPPED:    "bg-[var(--accent)]/10 text-[var(--accent)]",
  DELIVERED:  "bg-green-50 text-green-700",
  CANCELLED:  "bg-red-50 text-red-500",
  REFUNDED:   "bg-gray-100 text-gray-500",
};

type Order = {
  id: string;
  status: string;
  createdAt: string;
  total: number;
  guestName?: string | null;
  guestEmail?: string | null;
  guestPhone?: string | null;
  guestStreet?: string | null;
  guestCity?: string | null;
  guestState?: string | null;
  guestZip?: string | null;
  notes?: string | null;
  items: { id: string; price: number; quantity: number; product: { name: string } }[];
  payment?: { status: string; amount: number } | null;
};

export function PedidosClient({ orders: initial }: { orders: Order[] }) {
  const router = useRouter();
  const [orders, setOrders]           = useState(initial);
  const [query, setQuery]             = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPago, setFilterPago]   = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [deleting, setDeleting]       = useState(false);
  const [statusLoading, setStatusLoading] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = [...orders];
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((o) =>
        o.id.toLowerCase().includes(q) ||
        (o.guestName ?? "").toLowerCase().includes(q) ||
        (o.guestEmail ?? "").toLowerCase().includes(q) ||
        o.items.some((i) => i.product.name.toLowerCase().includes(q))
      );
    }
    if (filterStatus) list = list.filter((o) => o.status === filterStatus);
    if (filterPago === "paid")    list = list.filter((o) => o.payment?.status === "COMPLETED");
    if (filterPago === "pending") list = list.filter((o) => o.payment?.status !== "COMPLETED");
    return list;
  }, [orders, query, filterStatus, filterPago]);

  async function handleStatusChange(orderId: string, newStatus: string) {
    setStatusLoading(orderId);
    const formData = new FormData();
    formData.append("status", newStatus);
    await fetch(`/api/admin/orders/${orderId}/status`, { method: "POST", body: formData });
    setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: newStatus } : o));
    setStatusLoading(null);
  }

  async function handleDelete() {
    if (!confirmDelete) return;
    setDeleting(true);
    const res = await fetch(`/api/admin/orders/${confirmDelete}`, { method: "DELETE" });
    if (res.ok) {
      setOrders((prev) => prev.filter((o) => o.id !== confirmDelete));
    }
    setConfirmDelete(null);
    setDeleting(false);
  }

  const hasFilters = query || filterStatus || filterPago;

  return (
    <div>
      {/* Modal confirmar eliminar */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(45,61,34,0.4)", backdropFilter: "blur(4px)" }}
          onClick={() => !deleting && setConfirmDelete(null)}>
          <div className="bg-[var(--cream)] border border-[var(--border)] rounded-[var(--radius)] p-8 max-w-sm w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}>
            <p className="text-[20px] font-light italic text-[var(--text)] mb-2"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              ¿Eliminar pedido?
            </p>
            <p className="text-[13px] text-[var(--text-light)] font-light mb-2">
              #{confirmDelete.slice(-8).toUpperCase()}
            </p>
            <p className="text-[13px] text-[var(--text-light)] font-light mb-7">
              Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <button onClick={handleDelete} disabled={deleting}
                className="flex-1 py-3 bg-red-500 text-white text-[11px] tracking-[2px] uppercase hover:bg-red-600 transition-colors disabled:opacity-50">
                {deleting ? "Eliminando…" : "Eliminar"}
              </button>
              <button onClick={() => setConfirmDelete(null)} disabled={deleting}
                className="flex-1 py-3 border border-[var(--border)] text-[var(--text-light)] text-[11px] tracking-[2px] uppercase hover:border-[var(--text)] hover:text-[var(--text)] transition-all disabled:opacity-50">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <span className="block text-[12px] tracking-[3px] uppercase text-[var(--accent)] mb-2">Gestión</span>
        <h1 className="text-[clamp(2rem,4vw,2.5rem)] font-light text-[var(--text)] italic"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Pedidos
        </h1>
      </div>

      {/* Controles */}
      <div className="mb-8 space-y-3">
        {/* Buscador */}
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre, email, producto o ID…"
            className="w-full pl-4 pr-10 py-3 bg-[var(--white)] border border-[var(--border)] text-[13px] text-[var(--text)] placeholder-[var(--text-light)]/60 font-light focus:outline-none focus:border-[var(--accent)] transition-colors rounded-[var(--radius)]"
          />
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-light)]">
            {query ? (
              <button onClick={() => setQuery("")} className="hover:text-[var(--text)] transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="pointer-events-none">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            )}
          </span>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Estado del pedido */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 bg-[var(--white)] border border-[var(--border)] text-[11px] tracking-[1.5px] uppercase text-[var(--text-light)] focus:outline-none focus:border-[var(--accent)] transition-colors rounded-[var(--radius-sm)] cursor-pointer"
          >
            <option value="">Todos los estados</option>
            {Object.entries(STATUS_LABEL).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>

          {/* Estado del pago */}
          <select
            value={filterPago}
            onChange={(e) => setFilterPago(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 bg-[var(--white)] border border-[var(--border)] text-[11px] tracking-[1.5px] uppercase text-[var(--text-light)] focus:outline-none focus:border-[var(--accent)] transition-colors rounded-[var(--radius-sm)] cursor-pointer"
          >
            <option value="">Todos los pagos</option>
            <option value="paid">Pagados</option>
            <option value="pending">Pago pendiente</option>
          </select>

          {/* Contador y limpiar */}
          <span className="text-[11px] text-[var(--text-light)] ml-1">
            {filtered.length} {filtered.length === 1 ? "pedido" : "pedidos"}
          </span>
          {hasFilters && (
            <button
              onClick={() => { setQuery(""); setFilterStatus(""); setFilterPago(""); }}
              className="ml-auto flex items-center gap-1.5 text-[10px] tracking-[2px] uppercase text-[var(--accent)] hover:text-[var(--text)] transition-colors">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Lista */}
      {filtered.length === 0 ? (
        <div className="bg-[var(--white)] border border-[var(--border)] rounded-[var(--radius)] p-12 text-center">
          <p className="text-[var(--text-light)] text-[14px]">
            {hasFilters ? "Sin resultados para estos filtros." : "Todavía no hay pedidos."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => (
            <div key={order.id}
              className="bg-[var(--white)] border border-[var(--border)] rounded-[var(--radius)] p-6 hover:border-[var(--accent)]/40 transition-colors">

              {/* Cabecera */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-[11px] tracking-[2px] uppercase text-[var(--text-light)]">
                      #{order.id.slice(-8).toUpperCase()}
                    </span>
                    <span className={`text-[9px] tracking-[2px] uppercase px-2.5 py-1 rounded-[var(--radius-sm)] ${STATUS_COLOR[order.status] ?? "bg-gray-100 text-gray-500"}`}>
                      {STATUS_LABEL[order.status] ?? order.status}
                    </span>
                    {order.payment && (
                      <span className={`text-[9px] tracking-[2px] uppercase px-2.5 py-1 rounded-[var(--radius-sm)] ${
                        order.payment.status === "COMPLETED" ? "bg-green-50 text-green-700" : "bg-[var(--butter)] text-[var(--text)]"
                      }`}>
                        {order.payment.status === "COMPLETED" ? "Pagado" : "Pago pendiente"}
                      </span>
                    )}
                  </div>
                  <p className="text-[13px] text-[var(--text-light)]">
                    {order.guestName && <span className="text-[var(--text)] font-light">{order.guestName} · </span>}
                    {order.guestEmail}
                  </p>
                  {order.guestPhone && <p className="text-[12px] text-[var(--text-light)]">{order.guestPhone}</p>}
                </div>

                <div className="flex items-start gap-4 flex-shrink-0">
                  <div className="text-right">
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
                  {/* Botón eliminar */}
                  <button
                    onClick={() => setConfirmDelete(order.id)}
                    title="Eliminar pedido"
                    className="mt-1 text-[var(--text-light)] hover:text-red-400 transition-colors">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Productos */}
              <div className="border-t border-[var(--border)] pt-4 mb-4 space-y-1">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-[12px]">
                    <span className="text-[var(--text-light)]">{item.product.name} × {item.quantity}</span>
                    <span className="text-[var(--text)]">${(item.price * item.quantity).toLocaleString("es-AR")}</span>
                  </div>
                ))}
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
              <div className="border-t border-[var(--border)] pt-4 flex items-center gap-3 flex-wrap">
                <p className="text-[10px] tracking-[2px] uppercase text-[var(--text-light)]">Estado:</p>
                <select
                  value={order.status}
                  disabled={statusLoading === order.id}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  className="bg-transparent border border-[var(--border)] px-3 py-1.5 text-[11px] tracking-[1px] uppercase text-[var(--text)] focus:outline-none focus:border-[var(--accent)] rounded-[var(--radius-sm)] cursor-pointer disabled:opacity-50"
                >
                  {Object.entries(STATUS_LABEL).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
                {statusLoading === order.id && (
                  <span className="text-[11px] text-[var(--text-light)] italic">Guardando…</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}