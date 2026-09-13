import { requireCustomer } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AccountOverviewPage() {
  const session = await requireCustomer();
  const customer = await prisma.customer.findUnique({ where: { id: session.customerId } });

  return (
    <div>
      <h1 className="text-2xl font-bold text-chrome-200">Welcome back{customer?.name ? `, ${customer.name}` : ""}</h1>
      <div className="mt-6 rounded border border-graphite-700 p-5">
        <p className="text-sm text-chrome-500">Email</p>
        <p className="text-chrome-200">{customer?.email}</p>
        {customer?.phone && (
          <>
            <p className="mt-3 text-sm text-chrome-500">Phone</p>
            <p className="text-chrome-200">{customer.phone}</p>
          </>
        )}
      </div>
    </div>
  );
}
