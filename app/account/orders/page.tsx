import Link from "next/link";
import { requireCustomer } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/money";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Pending payment",
  PAID: "Paid",
  FULFILLED: "Fulfilled",
  CANCELLED: "Cancelled",
};

export default async function AccountOrdersPage() {
  const session = await requireCustomer();
  const orders = await prisma.order.findMany({
    where: { customerId: session.customerId },
    include: { items: { include: { product: true, variant: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-chrome-200">Your orders</h1>

      {orders.length === 0 ? (
        <div className="mt-8 rounded border border-graphite-700 p-8 text-center">
          <p className="text-chrome-400">You haven't placed any orders yet.</p>
          <Link
            href="/products"
            className="mt-4 inline-block rounded bg-signal-500 px-5 py-2.5 text-sm font-medium text-graphite-900 hover:bg-signal-400 focus-ring"
          >
            Browse products
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded border border-graphite-700 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-mono text-xs text-chrome-500">
                  ORDER #{order.id.slice(-8).toUpperCase()} · {order.createdAt.toLocaleDateString("en-IN")}
                </p>
                <span className="rounded-full border border-graphite-600 px-2.5 py-0.5 text-xs text-chrome-300">
                  {STATUS_LABEL[order.status] ?? order.status}
                </span>
              </div>
              <div className="mt-3 space-y-1.5">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-chrome-300">
                      {item.product.name}
                      {item.variant ? ` — ${item.variant.label}` : ""} × {item.quantity}
                    </span>
                    <span className="text-chrome-400">{formatCents(item.unitPriceCents * item.quantity)}</span>
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
