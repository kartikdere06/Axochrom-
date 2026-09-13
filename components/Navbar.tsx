"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart-store";

export default function Navbar() {
  const totalCount = useCart((s) => s.totalCount());
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-40 border-b border-graphite-700 bg-graphite-900/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-bold tracking-tight text-chrome-200 focus-ring">
          axo<span className="text-signal-500">chrome</span>
        </Link>
        <nav className="hidden gap-8 text-sm text-chrome-400 sm:flex">
          <Link href="/products" className="hover:text-chrome-200 focus-ring">
            All products
          </Link>
          <Link href="/products?category=bags" className="hover:text-chrome-200 focus-ring">
            Bags
          </Link>
          <Link href="/products?category=eyewear" className="hover:text-chrome-200 focus-ring">
            Eyewear
          </Link>
          <Link href="/products?category=accessories" className="hover:text-chrome-200 focus-ring">
            Accessories
          </Link>
        </nav>
        <Link
          href="/cart"
          className="relative rounded border border-graphite-600 px-3 py-1.5 text-sm text-chrome-200 hover:border-signal-500 focus-ring"
        >
          Cart
          {mounted && totalCount > 0 && (
            <span className="ml-2 rounded-full bg-signal-500 px-1.5 py-0.5 text-xs font-medium text-graphite-900">
              {totalCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
