"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatCents } from "@/lib/money";
import { useCart } from "@/lib/cart-store";

type Variant = {
  id: string;
  label: string;
  stock: number;
  priceDelta: number;
};

type Product = {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  imageUrl: string;
  category: { name: string } | null;
  variants: Variant[];
};

export default function ProductDetailClient({ product }: { product: Product }) {
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    product.variants[0] ?? null
  );
  const [added, setAdded] = useState(false);
  const [wantsCustomPrint, setWantsCustomPrint] = useState(false);
  const [printNote, setPrintNote] = useState("");
  const addItem = useCart((s) => s.addItem);
  const router = useRouter();

  const unitPrice = product.priceCents + (selectedVariant?.priceDelta ?? 0);
  const outOfStock = selectedVariant ? selectedVariant.stock <= 0 : false;

  function handleAddToCart() {
    addItem({
      productId: product.id,
      variantId: selectedVariant?.id ?? null,
      name: product.name,
      variantLabel: selectedVariant?.label ?? null,
      unitPriceCents: unitPrice,
      imageUrl: product.imageUrl,
      quantity: 1,
      customPrintNote: wantsCustomPrint && printNote.trim() ? printNote.trim() : undefined,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div>
      {product.category && (
        <p className="font-mono text-xs text-chrome-500">{product.category.name.toUpperCase()}</p>
      )}
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-chrome-200">{product.name}</h1>
      <p className="mt-3 text-lg text-chrome-300">{formatCents(unitPrice)}</p>
      <p className="mt-6 max-w-md text-chrome-400">{product.description}</p>

      {product.variants.length > 0 && (
        <div className="mt-8">
          <p className="mb-2 text-sm text-chrome-400">Options</p>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((v) => (
              <button
                key={v.id}
                onClick={() => setSelectedVariant(v)}
                disabled={v.stock <= 0}
                className={`rounded border px-3.5 py-2 text-sm focus-ring disabled:cursor-not-allowed disabled:opacity-40 ${
                  selectedVariant?.id === v.id
                    ? "border-signal-500 text-signal-500"
                    : "border-graphite-600 text-chrome-300 hover:border-chrome-400"
                }`}
              >
                {v.label}
                {v.stock <= 0 ? " — sold out" : ""}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 rounded border border-graphite-700 p-4">
        <label className="flex items-center gap-2 text-sm text-chrome-300">
          <input
            type="checkbox"
            checked={wantsCustomPrint}
            onChange={(e) => setWantsCustomPrint(e.target.checked)}
            className="h-4 w-4 rounded border-graphite-600 bg-graphite-800 text-signal-500 focus-ring"
          />
          Request custom printing on this tote
        </label>
        {wantsCustomPrint && (
          <div className="mt-3">
            <textarea
              value={printNote}
              onChange={(e) => setPrintNote(e.target.value)}
              rows={3}
              placeholder="Describe your logo or design, and where you'd like it placed. We'll follow up by email to collect artwork."
              className="w-full rounded border border-graphite-600 bg-graphite-800 px-3 py-2 text-sm text-chrome-200 placeholder:text-chrome-500 focus-ring"
            />
            <p className="mt-1.5 text-xs text-chrome-500">
              Custom printing may add production time and cost — we'll confirm details before fulfilling.
            </p>
          </div>
        )}
      </div>

      <button
        onClick={handleAddToCart}
        disabled={outOfStock}
        className="mt-4 w-full rounded bg-signal-500 py-3 text-sm font-medium text-graphite-900 hover:bg-signal-400 focus-ring disabled:cursor-not-allowed disabled:bg-graphite-600 disabled:text-chrome-500 sm:w-auto sm:px-8"
      >
        {outOfStock ? "Out of stock" : added ? "Added ✓" : "Add to cart"}
      </button>

      {added && (
        <button
          onClick={() => router.push("/cart")}
          className="mt-3 block text-sm text-chrome-400 hover:text-signal-500 focus-ring"
        >
          View cart
        </button>
      )}
    </div>
  );
}
