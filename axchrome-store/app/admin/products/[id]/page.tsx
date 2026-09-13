import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductForm from "../ProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id: params.id } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) notFound();

  return (
    <div>
      <h1 className="text-xl font-medium text-chrome-200">Edit product</h1>
      <ProductForm
        categories={categories}
        productId={product.id}
        initialValues={{
          name: product.name,
          slug: product.slug,
          description: product.description,
          priceCents: product.priceCents,
          imageUrl: product.imageUrl,
          categoryId: product.categoryId ?? "",
          active: product.active,
        }}
      />
      <p className="mt-6 text-xs text-chrome-500">
        Stock and options (variants) for existing products can be adjusted directly in the
        database via <code className="text-chrome-400">npm run db:studio</code> for now.
      </p>
    </div>
  );
}
