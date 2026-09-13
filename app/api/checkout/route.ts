import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { getCustomerSession } from "@/lib/auth";

const CartItemSchema = z.object({
  productId: z.string(),
  variantId: z.string().nullable(),
  quantity: z.number().int().positive(),
  customPrintNote: z.string().optional(),
});

const CheckoutSchema = z.object({
  items: z.array(CartItemSchema).min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = CheckoutSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid cart data" }, { status: 400 });
    }

    // Re-fetch authoritative prices/stock from the DB — never trust client-sent prices.
    const lineItems: {
      price_data: {
        currency: string;
        product_data: { name: string; images: string[] };
        unit_amount: number;
      };
      quantity: number;
    }[] = [];

    const orderItemsData: {
      productId: string;
      variantId: string | null;
      quantity: number;
      unitPriceCents: number;
      customPrintNote?: string;
    }[] = [];

    let totalCents = 0;

    for (const item of parsed.data.items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        include: { variants: true },
      });
      if (!product || !product.active) {
        return NextResponse.json({ error: "A product in your cart is unavailable" }, { status: 400 });
      }

      let unitPriceCents = product.priceCents;
      let variantLabel = "";
      if (item.variantId) {
        const variant = product.variants.find((v) => v.id === item.variantId);
        if (!variant) {
          return NextResponse.json({ error: "Selected option is unavailable" }, { status: 400 });
        }
        if (variant.stock < item.quantity) {
          return NextResponse.json(
            { error: `Not enough stock for ${product.name} (${variant.label})` },
            { status: 400 }
          );
        }
        unitPriceCents += variant.priceDelta;
        variantLabel = ` — ${variant.label}`;
      }

      totalCents += unitPriceCents * item.quantity;
      orderItemsData.push({
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
        unitPriceCents,
        customPrintNote: item.customPrintNote,
      });

      lineItems.push({
        price_data: {
          currency: "inr",
          product_data: {
            name: `${product.name}${variantLabel}`,
            images: [product.imageUrl],
          },
          unit_amount: unitPriceCents,
        },
        quantity: item.quantity,
      });
    }

    const customerSession = await getCustomerSession();

    const order = await prisma.order.create({
      data: {
        customerEmail: customerSession?.email || "pending@checkout",
        customerId: customerSession?.customerId,
        status: "PENDING",
        totalCents,
        items: { create: orderItemsData },
      },
    });

    const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel`,
      metadata: { orderId: order.id },
      customer_email: customerSession?.email,
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: session.id },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json({ error: "Unable to start checkout" }, { status: 500 });
  }
}
