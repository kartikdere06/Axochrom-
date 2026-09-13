import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductDetailClient from "./ProductDetailClient";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: { variants: true, category: true },
  });

  if (!product || !product.active) notFound();

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden bg-graphite-800">
          <Image src={product.imageUrl} alt={product.name} fill className="object-cover" priority />
        </div>
        <ProductDetailClient product={product} />
      </div>
    </div>
  );
}
