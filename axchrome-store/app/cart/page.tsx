"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart-store";
import { formatCents } from "@/lib/money";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalCents } = useCart();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => setMounted(true), []);

  async function handleCheckout() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");
      window.location.href = data.url;
    } catch (e: any) {
      setError(e.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  if (!mounted) return null;

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-bold text-chrome-200">Your cart</h1>

      {items.length === 0 ? (
        <div className="mt-10 rounded border border-graphite-700 p-10 text-center">
          <p className="text-chrome-400">Your cart is empty.</p>
          <Link
            href="/products"
            className="mt-4 inline-block rounded bg-signal-500 px-5 py-2.5 text-sm font-medium text-graphite-900 hover:bg-signal-400 focus-ring"
          >
            Browse products
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-8 divide-y divide-graphite-700 border-y border-graphite-700">
            {items.map((item) => (
              <div key={`${item.productId}-${item.variantId}`} className="flex gap-4 py-5">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden bg-graphite-800">
                  <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex justify-between gap-2">
                    <div>
                      <p className="text-sm text-chrome-200">{item.name}</p>
                      {item.variantLabel && (
                        <p className="text-xs text-chrome-500">{item.variantLabel}</p>
                      )}
                    </div>
                    <p className="whitespace-nowrap text-sm text-chrome-300">
                      {formatCents(item.unitPriceCents * item.quantity)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center rounded border border-graphite-600">
                      <button
                        className="px-2.5 py-1 text-chrome-400 hover:text-chrome-200 focus-ring"
                        onClick={() =>
                          updateQuantity(item.productId, item.variantId, item.quantity - 1)
                        }
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="px-2 text-sm text-chrome-200">{item.quantity}</span>
                      <button
                        className="px-2.5 py-1 text-chrome-400 hover:text-chrome-200 focus-ring"
                        onClick={() =>
                          updateQuantity(item.productId, item.variantId, item.quantity + 1)
                        }
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="text-xs text-chrome-500 hover:text-signal-500 focus-ring"
                      onClick={() => removeItem(item.productId, item.variantId)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <p className="text-chrome-400">Subtotal</p>
            <p className="text-lg text-chrome-200">{formatCents(totalCents())}</p>
          </div>
          <p className="mt-1 text-xs text-chrome-500">Shipping and tax calculated at checkout.</p>

          {error && <p className="mt-4 text-sm text-signal-500">{error}</p>}

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="mt-6 w-full rounded bg-signal-500 py-3 text-sm font-medium text-graphite-900 hover:bg-signal-400 focus-ring disabled:opacity-60"
          >
            {loading ? "Redirecting to checkout..." : "Checkout with Stripe"}
          </button>
        </>
      )}
    </div>
  );
}
