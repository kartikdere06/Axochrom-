import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/money";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [productCount, paidOrders, pendingOrders] = await Promise.all([
    prisma.product.count(),
    prisma.order.findMany({ where: { status: "PAID" } }),
    prisma.order.count({ where: { status: "PENDING" } }),
  ]);

  const revenueCents = paidOrders.reduce((sum, o) => sum + o.totalCents, 0);

  return (
    <div>
      <h1 className="text-xl font-medium text-chrome-200">Dashboard</h1>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="Products" value={String(productCount)} />
        <Stat label="Paid orders" value={String(paidOrders.length)} />
        <Stat label="Pending checkouts" value={String(pendingOrders)} />
        <Stat label="Revenue" value={formatCents(revenueCents)} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-graphite-700 p-4">
      <p className="font-mono text-xs text-chrome-500">{label.toUpperCase()}</p>
      <p className="mt-2 text-2xl font-semibold text-chrome-200">{value}</p>
    </div>
  );
}
