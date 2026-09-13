import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/money";

export const dynamic = "force-dynamic";

const STATUS_STYLE: Record<string, string> = {
  PENDING: "border-graphite-600 text-chrome-400",
  PAID: "border-signal-500 text-signal-500",
  FULFILLED: "border-chrome-400 text-chrome-200",
  CANCELLED: "border-red-500 text-red-400",
};

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      items: { include: { product: true, variant: true } },
      customer: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-xl font-medium text-chrome-200">Orders</h1>

      {orders.length === 0 ? (
        <p className="mt-6 text-chrome-500">No orders yet.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded border border-graphite-700 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-xs text-chrome-500">
                    #{order.id.slice(-8).toUpperCase()} ·{" "}
                    {order.createdAt.toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                  <p className="mt-1 text-sm text-chrome-200">
                    {order.customer?.name || "Guest checkout"}
                  </p>
                  <p className="text-xs text-chrome-500">{order.customerEmail}</p>
                  {order.customer?.phone && (
                    <p className="text-xs text-chrome-500">{order.customer.phone}</p>
                  )}
                  {order.shippingAddress && (
                    <p className="mt-1 text-xs text-chrome-500">{order.shippingAddress}</p>
                  )}
                </div>
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-xs ${
                    STATUS_STYLE[order.status] ?? "border-graphite-600 text-chrome-400"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <div className="mt-3 space-y-1.5 border-t border-graphite-700 pt-3">
                {order.items.map((item) => (
                  <div key={item.id} className="text-sm">
                    <div className="flex justify-between">
                      <span className="text-chrome-300">
                        {item.product.name}
                        {item.variant ? ` — ${item.variant.label}` : ""} × {item.quantity}
                      </span>
                      <span className="text-chrome-400">
                        {formatCents(item.unitPriceCents * item.quantity)}
                      </span>
                    </div>
                    {item.customPrintNote && (
                      <p className="mt-0.5 text-xs text-signal-500">
                        Custom print request: {item.customPrintNote}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-3 flex justify-between border-t border-graphite-700 pt-3 text-sm">
                <span className="text-chrome-400">Total</span>
                <span className="text-chrome-200">{formatCents(order.totalCents)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
