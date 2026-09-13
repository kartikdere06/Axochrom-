import { prisma } from "@/lib/prisma";
import ProductForm from "../ProductForm";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <h1 className="text-xl font-medium text-chrome-200">Add product</h1>
      <ProductForm categories={categories} />
    </div>
  );
}
