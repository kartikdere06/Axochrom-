import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  const activeSlug = searchParams.category;

  const products = await prisma.product.findMany({
    where: {
      active: true,
      ...(activeSlug ? { category: { slug: activeSlug } } : {}),
    },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-10 flex flex-wrap items-center gap-3">
        <FilterLink href="/products" active={!activeSlug} label="All" />
        {categories.map((c) => (
          <FilterLink
            key={c.id}
            href={`/products?category=${c.slug}`}
            active={activeSlug === c.slug}
            label={c.name}
          />
        ))}
      </div>

      {products.length === 0 ? (
        <p className="text-chrome-500">No products found in this category yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              slug={p.slug}
              name={p.name}
              priceCents={p.priceCents}
              imageUrl={p.imageUrl}
              categoryName={p.category?.name}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterLink({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <Link
      href={href}
      className={`rounded-full border px-3.5 py-1.5 text-sm focus-ring ${
        active
          ? "border-signal-500 bg-signal-500 text-graphite-900"
          : "border-graphite-600 text-chrome-400 hover:border-chrome-400 hover:text-chrome-200"
      }`}
    >
      {label}
    </Link>
  );
}
