"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-store";

export default function CheckoutSuccessPage() {
  const clear = useCart((s) => s.clear);

  useEffect(() => {
    clear();
  }, [clear]);

  return (
    <div className="mx-auto max-w-lg px-6 py-24 text-center">
      <p className="font-mono text-xs text-signal-500">ORDER CONFIRMED</p>
      <h1 className="mt-4 text-2xl font-bold text-chrome-200">Thanks — it's on the way.</h1>
      <p className="mt-3 text-chrome-400">
        We've received your order and sent a confirmation to your email. You'll get a
        shipping notice once it leaves the warehouse.
      </p>
      <Link
        href="/products"
        className="mt-8 inline-block rounded bg-signal-500 px-5 py-2.5 text-sm font-medium text-graphite-900 hover:bg-signal-400 focus-ring"
      >
        Keep browsing
      </Link>
    </div>
  );
}
