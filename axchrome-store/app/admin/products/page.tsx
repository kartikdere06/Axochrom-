import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/money";
import DeleteProductButton from "./DeleteProductButton";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true, variants: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-medium text-chrome-200">Products</h1>
        <Link
          href="/admin/products/new"
          className="rounded bg-signal-500 px-4 py-2 text-sm font-medium text-graphite-900 hover:bg-signal-400 focus-ring"
        >
          Add product
        </Link>
      </div>

      <div className="mt-6 divide-y divide-graphite-700 border-y border-graphite-700">
        {products.map((p) => (
          <div key={p.id} className="flex items-center justify-between gap-4 py-3">
            <div className="min-w-0">
              <p className="truncate text-sm text-chrome-200">{p.name}</p>
              <p className="mt-0.5 text-xs text-chrome-500">
                {p.category?.name ?? "Uncategorized"} · {p.variants.length} option
                {p.variants.length === 1 ? "" : "s"} ·{" "}
                {p.variants.reduce((sum, v) => sum + v.stock, 0)} in stock
                {!p.active && " · hidden"}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-4">
              <p className="text-sm text-chrome-400">{formatCents(p.priceCents)}</p>
              <Link
                href={`/admin/products/${p.id}`}
                className="text-sm text-chrome-300 hover:text-signal-500 focus-ring"
              >
                Edit
              </Link>
              <DeleteProductButton productId={p.id} productName={p.name} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
