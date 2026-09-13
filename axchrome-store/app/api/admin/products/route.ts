import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const VariantInput = z.object({
  label: z.string().min(1),
  sku: z.string().min(1),
  stock: z.number().int().min(0),
  priceDelta: z.number().int().default(0),
});

const ProductInput = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().min(1),
  priceCents: z.number().int().positive(),
  imageUrl: z.string().url(),
  categoryId: z.string().nullable().optional(),
  active: z.boolean().default(true),
  variants: z.array(VariantInput).default([]),
});

export async function GET() {
  const products = await prisma.product.findMany({
    include: { category: true, variants: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = ProductInput.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { variants, ...productData } = parsed.data;

  try {
    const product = await prisma.product.create({
      data: {
        ...productData,
        variants: { create: variants },
      },
      include: { variants: true },
    });
    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "A product with that slug or SKU already exists" }, { status: 409 });
  }
}
